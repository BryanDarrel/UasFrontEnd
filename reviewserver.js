const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke MongoDB
mongoose
  .connect("mongodb://localhost:27017/reviews")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Model Ulasan
const reviewSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String, required: true } // Pastikan bahwa setiap ulasan memiliki tanggal
});

const Review = mongoose.model("Review", reviewSchema);

// API Endpoint untuk mendapatkan semua ulasan
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// API Endpoint untuk menambahkan ulasan
app.post("/api/reviews", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json(review);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ error: "Failed to save review" });
  }
});

// API Endpoint untuk mengupdate ulasan berdasarkan ID
app.put("/api/reviews/:id", async (req, res) => {
  try {
    // Menggunakan findByIdAndUpdate untuk memperbarui review berdasarkan ID
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(updatedReview);  // Mengirimkan ulasan yang telah diperbarui sebagai respons
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// API Endpoint untuk menghapus ulasan berdasarkan ID
app.delete("/api/reviews/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
