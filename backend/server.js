import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import noticeRoutes     from "./routes/noticeRoutes.js";
import newsRoutes       from "./routes/newsRoutes.js";
import facultyRoutes    from "./routes/facultyRoutes.js";
import galleryRoutes    from "./routes/galleryRoutes.js";
import admissionRoutes  from "./routes/admissionRoutes.js";
import authRoutes       from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: "*",           // change to your Netlify URL in production
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/notices",    noticeRoutes);
app.use("/api/news",       newsRoutes);
app.use("/api/faculty",    facultyRoutes);
app.use("/api/gallery",    galleryRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/auth",       authRoutes);

app.get("/", (req, res) => res.send("VVS School API Running 🚀"));

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ── MongoDB connection ──────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected 🔥");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });