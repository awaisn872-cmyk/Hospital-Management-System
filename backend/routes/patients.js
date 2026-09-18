import { Router } from "express";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";

const router = Router();

router.get("/", async (req,res,next)=>{
  try{
    const q=(req.query.q||"").trim();
    const filter=q?{$or:[
      {name:{$regex:q,$options:"i"}},
      {phone:{$regex:q,$options:"i"}},
      {gender:{$regex:q,$options:"i"}}
    ]}:{};
    res.json(await Patient.find(filter).sort({createdAt:-1}));
  }catch(e){next(e);}
});

router.post("/", async(req,res,next)=>{
  try{res.status(201).json(await Patient.create(req.body));}catch(e){next(e);}
});

router.put("/:id", async(req,res,next)=>{
  try{res.json(await Patient.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}));}catch(e){next(e);}
});

router.delete("/:id", async(req,res,next)=>{
  try{
    const id=req.params.id;
    await Appointment.deleteMany({patientId:id});
    await Patient.findByIdAndDelete(id);
    res.json({message:"Patient deleted"});
  }catch(e){next(e);}
});

export default router;