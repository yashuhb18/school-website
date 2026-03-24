import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  date:        { type: String, default: () => new Date().toLocaleDateString("en-IN") },
  createdAt:   { type: Date, default: Date.now }
});

export default mongoose.model("Notice", noticeSchema);