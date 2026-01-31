# Manner - Meal Planning App

A simple web-based meal planner that helps you organize weekly meals and generate shopping lists.

## Features

- 📅 Weekly meal planning with dropdown selection
- 🛒 Automatic shopping list generation from selected meals
- 🎲 Random meal suggestions
- 🔐 Recipe database with cuisine types and dietary tags
- 🍽️ Separate lunch planning

## Tech Stack

**Frontend:**
- HTML/CSS/JavaScript (vanilla)
- Responsive design

**Backend:**
- Flask (Python web framework)
- SQLAlchemy (ORM)
- MySQL database
- Flask-CORS for API access

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure database:**
   - Copy `config.py.example` to `config.py`
   - Update with your MySQL database credentials

3. **Run the Flask server:**
   ```bash
   python flask_app.py
   ```

4. **Open the app:**
   - Open `manner.html` in your browser
   - Or serve via a local web server

## Database Schema

**Recipes Table:**
- MealName (string)
- cuisine (string)
- mealType (string)
- dietary (JSON)
- characteristics (JSON)

**Ingredients Table:**
- name (string)
- recipe_id (foreign key to Recipes)

## API Endpoints

- `GET /recipes` - List all recipes
- `GET /recipes/<MealName>` - Get specific recipe with ingredients
- `GET /recipes_with_ingredients` - Get all recipes with their ingredients
- `POST /add_recipe` - Add new recipe with ingredients

## Configuration

The app expects a MySQL database connection. Update `config.py` with:
```python
SQLALCHEMY_DATABASE_URI = 'mysql://username:password@host/database'
```

## Development

This is a simple meal planning tool for personal use. The frontend makes API calls to the Flask backend to fetch recipes and generate shopping lists.
