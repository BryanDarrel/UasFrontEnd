const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Koneksi ke MongoDB
mongoose.connect("mongodb://localhost:27017/wishlistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Koneksi MongoDB berhasil"))
  .catch((error) => console.error("Koneksi MongoDB gagal:", error));

// Schema dan Model Wishlist
const wishlistSchema = new mongoose.Schema({
  userId: String,
  roomId: String,
  roomName: String,
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

// Endpoint API
app.get("/api/wishlist/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlists = await Wishlist.find({ userId });
    res.json(wishlists);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data wishlist" });
  }
});

app.post("/api/wishlist", async (req, res) => {
  try {
    const newWishlist = new Wishlist(req.body);
    const savedWishlist = await newWishlist.save();
    res.json(savedWishlist);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambahkan ke wishlist" });
  }
});

app.put("/api/wishlist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { roomName } = req.body;
    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      id,
      { roomName },
      { new: true }
    );
    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ error: "Gagal memperbarui wishlist" });
  }
});

app.delete("/api/wishlist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Wishlist.findByIdAndDelete(id);
    res.json({ message: "Wishlist berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus wishlist" });
  }
});

// Jalankan server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
