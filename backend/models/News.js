import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  category: { type: String, enum: ["Achievement","Event","Sports","Academics","General"], default: "General" },
  date:     { type: String, default: () => new Date().toLocaleDateString("en-IN") },
  createdAt:{ type: Date, default: Date.now }
});

export default mongoose.model("News", newsSchema);