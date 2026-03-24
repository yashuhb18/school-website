import express from "express";
import Notice from "../models/notice.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET all notices (public)
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add notice (admin only)
router.post("/add", protect, async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.json({ message: "Notice added", notice });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE notice (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;