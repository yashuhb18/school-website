import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  role:        { type: String, required: true },
  department:  { type: String, required: true },
  qualification:{ type: String },
  initials:    { type: String },   // e.g. "PK" for display avatar
  avatarColor: { type: String, default: "#0d1f38" },
  createdAt:   { type: Date, default: Date.now }
});

export default mongoose.model("Faculty", facultySchema);