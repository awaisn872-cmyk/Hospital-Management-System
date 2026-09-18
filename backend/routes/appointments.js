import { Router } from "express";
import Appointment from "../models/Appointment.js";

const router=Router();

router.get("/",async(req,res,next)=>{
  try{
    const q=(req.query.q||"").trim();
    let data=await Appointment.find().populate("patientId","name phone age gender").populate("doctorId","name spec fee").sort({datetime:1});
    data=data.map(a=>a.toObject({virtuals:false}));
    data=data.map(a=>({...a,patient:a.patientId,doctor:a.doctorId}));
    if(q){
      const low=q.toLowerCase();
      data=data.filter(a=>
        (a.patient?.name||"").toLowerCase().includes(low) ||
        (a.doctor?.name||"").toLowerCase().includes(low) ||
        (a.doctor?.spec||"").toLowerCase().includes(low) ||
        new Date(a.datetime).toLocaleString().toLowerCase().includes(low)
      );
    }
    res.json(data);
  }catch(e){next(e);}
});

router.post("/",async(req,res,next)=>{
  try{res.status(201).json(await Appointment.create(req.body));}catch(e){next(e);}
});

router.put("/:id",async(req,res,next)=>{
  try{res.json(await Appointment.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}));}catch(e){next(e);}
});

router.delete("/:id",async(req,res,next)=>{
  try{await Appointment.findByIdAndDelete(req.params.id);res.json({message:"Appointment cancelled"});}catch(e){next(e);}
});

export default router;