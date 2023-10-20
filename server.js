const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize express and define port
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://marcusspike:chef636sis060@cluster0.6nwblin.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Define Mongoose Schema and Model
const mealSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
});
const Meal = mongoose.model('Meal', mealSchema);

// API Endpoints
app.get('/api/meals', async (req, res) => {
  const meals = await Meal.find();
  res.send(meals);
});

app.post('/api/meals', async (req, res) => {
  const meal = new Meal({
    name: req.body.name,
    ingredients: req.body.ingredients,
  });
  const result = await meal.save();
  res.send(result);
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
