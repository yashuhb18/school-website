import express from "express";
import Admission from "../models/Admission.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public — anyone can submit enquiry
router.post("/submit", async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.json({ message: "Enquiry submitted successfully!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin only — view all enquiries
router.get("/", protect, async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ submittedAt: -1 });
    res.json(admissions);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin only — update status
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: "Status updated", updated });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin only — delete enquiry
router.delete("/:id", protect, async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ message: "Enquiry deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;