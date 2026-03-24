import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
  parentName:   { type: String, required: true },
  studentName:  { type: String, required: true },
  classApplied: { type: String, required: true },
  phone:        { type: String, required: true },
  status:       { type: String, enum: ["Pending","Contacted","Admitted","Rejected"], default: "Pending" },
  submittedAt:  { type: Date, default: Date.now }
});

export default mongoose.model("Admission", admissionSchema);