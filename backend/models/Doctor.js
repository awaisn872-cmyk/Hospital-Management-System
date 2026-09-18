import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  spec: { type: String, trim: true, default: "" },
  fee: { type: Number, min: 0, default: 0 }
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);