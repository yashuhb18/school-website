import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  label:     { type: String, required: true },  // caption shown on photo
  imageUrl:  { type: String, required: true },  // hosted image URL (Cloudinary / direct link)
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Gallery", gallerySchema);