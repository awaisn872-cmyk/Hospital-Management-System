import { Router } from "express";
import Invoice from "../models/Invoice.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

const router=Router();

router.get("/",async(req,res,next)=>{
  try{res.json(await Invoice.find().populate("patientId").populate("doctorId").sort({createdAt:-1}));}catch(e){next(e);}
});

router.post("/",async(req,res,next)=>{
  try{
    const appointment=await Appointment.findById(req.body.appointmentId).populate("patientId").populate("doctorId");
    if(!appointment) return res.status(404).json({message:"Appointment not found"});
    const doctorFee=appointment.doctorId?.fee||0;
    const others=Number(req.body.others||0);
    const invoice=await Invoice.create({
      appointmentId:appointment._id,
      patientId:appointment.patientId._id,
      doctorId:appointment.doctorId._id,
      doctorFee,
      others,
      total:doctorFee+others,
      paymentStatus:"paid"
    });
    res.status(201).json(await invoice.populate(["patientId","doctorId"]));
  }catch(e){next(e);}
});

export default router;