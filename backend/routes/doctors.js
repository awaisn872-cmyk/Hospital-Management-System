import { Router } from "express";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

const router=Router();

router.get("/",async(req,res,next)=>{
  try{
    const q=(req.query.q||"").trim();
    const filter=q?{$or:[
      {name:{$regex:q,$options:"i"}},
      {spec:{$regex:q,$options:"i"}}
    ]}:{};
    res.json(await Doctor.find(filter).sort({createdAt:-1}));
  }catch(e){next(e);}
});

router.post("/",async(req,res,next)=>{
  try{res.status(201).json(await Doctor.create(req.body));}catch(e){next(e);}
});

router.put("/:id",async(req,res,next)=>{
  try{res.json(await Doctor.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}));}catch(e){next(e);}
});

router.delete("/:id",async(req,res,next)=>{
  try{
    const id=req.params.id;
    await Appointment.deleteMany({doctorId:id});
    await Doctor.findByIdAndDelete(id);
    res.json({message:"Doctor deleted"});
  }catch(e){next(e);}
});

export default router;