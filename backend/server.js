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

app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map(x=>x.trim()) : true
}));
app.use(express.json());

app.get("/api/health",(req,res)=>res.json({status:"ok",service:"Hospital Management API"}));

app.get("/api/dashboard",async(req,res,next)=>{
  try{
    const [patients,doctors,appointments,revenueAgg]=await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Invoice.aggregate([{$match:{paymentStatus:"paid"}},{$group:{_id:null,total:{$sum:"$total"}}}])
    ]);
    res.json({patients,doctors,appointments,revenue:revenueAgg[0]?.total||0});
  }catch(e){next(e);}
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