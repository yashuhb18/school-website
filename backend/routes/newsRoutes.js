import express from "express";
import News from "../models/News.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/add", protect, async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.json({ message: "News added", news });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;