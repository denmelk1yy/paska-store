const express = require('express');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const paskaSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  price: Number,
  description: String,
  image: String,
}, {
  timestamps: true
});

const Paska = mongoose.model('Paska', paskaSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =================all paskas====================
app.get('/pasky', async (req, res) => {
  try {
    const pasky = await Paska.find();
    res.json(pasky);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

///=================paskas by id ====================
app.get('/paska-id/:id', async (req, res) => {
  try {
    const paska = await Paska.findById(req.params.id);

    if (!paska) {
      return res.status(404).json({ message: 'Паску не знайдено' });
    }

    res.json(paska);

  } catch (err) {
    res.status(500).json({ message: 'Невірний ID або помилка сервера' });
  }
});

// ================= search ====================
app.get('/search', async (req, res) => {

  try {

    const query = req.query.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        message: 'Не передано query'
      });
    }

    const stopWords = [
      'паска',
      'і',
      'та',
      'або',
      'з',
      'у',
      'в',
      'на',
      ',',
      '.'
    ];

    const words = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(word => !stopWords.includes(word));

    const conditions = [];

    words.forEach(word => {

      conditions.push({
        name: {
          $regex: word,
          $options: 'i'
        }
      });

      conditions.push({
        description: {
          $regex: word,
          $options: 'i'
        }
      });

    });

    const pasky = await Paska.find({
      $or: conditions
    });

    const ids = pasky.map(item => item._id);

    res.json(ids);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Помилка сервера'
    });

  }

});

///===============new paska ==================
app.post('/paska', async (req, res) => {

  try {

    const { name, price, description, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: 'name і price обовʼязкові'
      });
    }

    const existing = await Paska.findOne({ name });

    if (existing) {
      return res.status(409).json({
        message: 'Така паска вже існує'
      });
    }

    const newPaska = await Paska.create({
      name,
      price,
      description,
      image,
    });

    res.status(201).json(newPaska);

  } catch (err) {

    res.status(500).json({
      message: 'Помилка сервера'
    });

  }

});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
