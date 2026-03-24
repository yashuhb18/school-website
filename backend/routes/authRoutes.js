import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ message: "Login successful", token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/setup  — run ONCE to create first admin account
router.post("/setup", async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ error: "Admin already exists" });
    const admin = new Admin(req.body);
    await admin.save();
    res.json({ message: "Admin created successfully!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;