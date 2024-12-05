const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/memories', { useNewUrlParser: true, useUnifiedTopology: true });

// Skema MongoDB
const memorySchema = new mongoose.Schema({
  photo: String,
  caption: String,
  created_at: { type: Date, default: Date.now }
});

const Memory = mongoose.model('Memory', memorySchema);

// Konfigurasi Multer untuk Upload Foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// API Routes
app.post('/api/memories', upload.single('photo'), async (req, res) => {
  try {
    const newMemory = new Memory({
      photo: req.file.path,
      caption: req.body.caption
    });
    await newMemory.save();
    res.status(201).json(newMemory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/memories', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ created_at: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/memories/:id', async (req, res) => {
  try {
    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Caption
// Route untuk update caption
app.put('/api/memories/:id', async (req, res) => {
  try {
    const memory = await Memory.findByIdAndUpdate(
      req.params.id,
      { caption: req.body.caption },
      { new: true } // Mengembalikan objek setelah update
    );
    res.json(memory); // Kirimkan objek memory yang telah diperbarui
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Jalankan Server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
