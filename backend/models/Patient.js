import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, default: "" },
  age: { type: Number, min: 0, default: null },
  gender: { type: String, enum: ["", "Male", "Female", "Other"], default: "" }
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);