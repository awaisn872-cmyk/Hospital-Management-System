import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Patient from "./models/Patient.js";
import Doctor from "./models/Doctor.js";
import Appointment from "./models/Appointment.js";
import Invoice from "./models/Invoice.js";
import patientRoutes from "./routes/patients.js";
import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";
import invoiceRoutes from "./routes/invoices.js";
import connectDB from "./data.js";
dotenv.config();

const app=express();
const PORT=process.env.PORT||5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://hospital-management-system-drab-six.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests without an origin
    // e.g. Postman/server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());
app.use(express.json());

app.get("/api/health",(req,res)=>res.json({status:"ok",service:"Hospital Management API"}));

app.get("/api/dashboard", async (req, res, next) => {
  try {
    const [
      patients,
      doctors,
      appointments,
      revenueAgg,
      patientGrowth,
      appointmentStats,
      revenueStats,
      genderStats
    ] = await Promise.all([
      Patient.countDocuments(),

      Doctor.countDocuments(),

      Appointment.countDocuments(),

      Invoice.aggregate([
        {
          $match: {
            paymentStatus: "paid"
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" }
          }
        }
      ]),

      // Monthly patient registrations
      Patient.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ]),

      // Monthly appointments
      Appointment.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$datetime" },
              month: { $month: "$datetime" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ]),

      // Monthly revenue
      Invoice.aggregate([
        {
          $match: {
            paymentStatus: "paid"
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            revenue: { $sum: "$total" }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ]),

      // Patient gender
      Patient.aggregate([
        {
          $match: {
            gender: {
              $in: ["Male", "Female", "Other"]
            }
          }
        },
        {
          $group: {
            _id: "$gender",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const formatMonthlyData = (data, valueKey) =>
      data.map((item) => ({
        month: monthNames[item._id.month - 1],
        year: item._id.year,
        [valueKey]: item[valueKey]
      }));

    res.json({
      patients,
      doctors,
      appointments,
      revenue: revenueAgg[0]?.total || 0,

      patientGrowth: formatMonthlyData(
        patientGrowth.map((item) => ({
          ...item,
          count: item.count
        })),
        "count"
      ),

      appointmentStats: formatMonthlyData(
        appointmentStats.map((item) => ({
          ...item,
          count: item.count
        })),
        "count"
      ),

      revenueStats: formatMonthlyData(
        revenueStats.map((item) => ({
          ...item,
          revenue: item.revenue
        })),
        "revenue"
      ),

      genderStats: genderStats.map((item) => ({
        name: item._id,
        value: item.count
      }))
    });
  } catch (e) {
    next(e);
  }
});

app.use("/api/patients",patientRoutes);
app.use("/api/doctors",doctorRoutes);
app.use("/api/appointments",appointmentRoutes);
app.use("/api/invoices",invoiceRoutes);

app.use((req,res)=>res.status(404).json({message:"API route not found"}));
app.use((err,req,res,next)=>{
  console.error(err);
  if(err.name==="ValidationError") return res.status(400).json({message:Object.values(err.errors).map(x=>x.message).join(", ")});
  if(err.name==="CastError") return res.status(400).json({message:"Invalid ID"});
  res.status(500).json({message:"Server error"});
});

async function start(){
  await connectDB();
  app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));
}
start().catch(err=>{console.error("Startup failed:",err.message);process.exit(1);});