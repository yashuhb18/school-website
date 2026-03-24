import express from "express";
import Faculty from "../models/Faculty.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.json(faculty);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/add", protect, async (req, res) => {
  try {
    const member = new Faculty(req.body);
    await member.save();
    res.json({ message: "Faculty added", member });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty removed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;