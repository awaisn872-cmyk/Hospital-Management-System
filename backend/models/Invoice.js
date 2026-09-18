import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  doctorFee: { type: Number, min: 0, default: 0 },
  others: { type: Number, min: 0, default: 0 },
  total: { type: Number, min: 0, default: 0 },
  paymentStatus: { type: String, enum: ["paid"], default: "paid" }
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);