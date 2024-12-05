const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hotelPromotions', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define Promotion Schema
const promotionSchema = new mongoose.Schema({
    type: String, // e.g., Room Type
    discount: Number, // e.g., 20 for 20%
    startDate: Date,
    endDate: Date
});

const Promotion = mongoose.model('Promotion', promotionSchema);

// Routes
// Create Promotion
app.post('/promotions', async (req, res) => {
    const promotion = new Promotion(req.body);
    try {
        const result = await promotion.save();
        res.status(201).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Read Promotions
app.get('/promotions', async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.status(200).send(promotions);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update Promotion
app.put('/promotions/:id', async (req, res) => {
    try {
        const updatedPromotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedPromotion);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Promotion
app.delete('/promotions/:id', async (req, res) => {
    try {
        const result = await Promotion.findByIdAndDelete(req.params.id);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the Server
app.listen(7000, () => {
    console.log('Server running on port 7000');
});
