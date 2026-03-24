import express from "express";
import Gallery from "../models/Gallery.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/add", protect, async (req, res) => {
  try {
    const item = new Gallery(req.body);
    await item.save();
    res.json({ message: "Gallery item added", item });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Gallery item removed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;