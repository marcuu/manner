# Claude AI Assistant Guide for Manner

## Project Overview

Manner is a lightweight meal planning web application. Users select meals for each day of the week from a recipe database, and the app generates a shopping list of required ingredients.

## Architecture

**Three-tier structure:**
1. **Frontend** - `manner.html` + `app.js` (vanilla JavaScript)
2. **Backend** - `flask_app.py` (Flask REST API)
3. **Database** - MySQL with two tables (Recipes, Ingredients)

**Key Design Principles:**
- Keep it simple - no frameworks on frontend
- Single-page application
- RESTful API communication
- Responsive design for mobile/desktop

## Core Files

### `manner.html`
- Main UI with weekly meal selector
- Dropdowns for each day (Monday-Sunday)
- Shopping list display area
- Minimal inline CSS for clean design

### `app.js`
- Fetches recipes from Flask API on page load
- Populates dropdowns with dinner meals
- Generates shopping list by aggregating ingredients from selected meals
- Includes retry logic for API calls
- Random meal suggestion feature

### `flask_app.py`
- Flask REST API with CORS enabled
- SQLAlchemy ORM for database operations
- Four main endpoints: list recipes, get recipe details, add recipe, get all with ingredients
- Database initialization on startup

### `config.py` (gitignored)
- Contains MySQL connection string
- **Never commit this file** - contains credentials
- Use `config.py.example` as template

## Database Schema

```
Recipes
├── id (PK)
├── MealName
├── cuisine
├── mealType (dinner/lunch/breakfast)
├── dietary (JSON array)
└── characteristics (JSON array)

Ingredients
├── id (PK)
├── name
└── recipe_id (FK -> Recipes.id)
```

## Common Tasks

### Adding New Features
1. **Frontend changes** - Edit `manner.html` or `app.js`
2. **Backend changes** - Add routes to `flask_app.py`
3. **Database changes** - Add models or migrations (manual for now)

### API Integration
- Frontend uses `fetch()` with token authentication
- Base URL: `https://marcuu.pythonanywhere.com`
- Token in Authorization header: `Token d7d9b014bc89742181d8dfd65270e6386e6f7833`

### Testing
- **Local**: Run `python flask_app.py` and open `manner.html`
- **Production**: Deployed on PythonAnywhere

## Deployment

**Current setup:**
- Hosted on PythonAnywhere
- MySQL database on PythonAnywhere services
- Static HTML served separately (StableHost)

**Deployment checklist:**
1. Update Flask app on PythonAnywhere
2. Upload static files to StableHost
3. Verify CORS settings
4. Test API endpoints

## Code Style

- **Python**: PEP 8, simple and readable
- **JavaScript**: Vanilla ES6+, no transpilation needed
- **HTML/CSS**: Inline styles for simplicity, semantic HTML

## Known Limitations

- No user authentication (shared database)
- No meal editing UI (requires direct DB access)
- Limited error handling
- No backend validation on recipe submission

## Future Enhancements (if requested)

- User accounts and personal meal plans
- Recipe rating system
- Meal calendar view
- Mobile app version (React Native version exists separately)
- Nutritional information
- Meal history tracking

## Important Notes

⚠️ **Security:**
- `config.py` contains database credentials - NEVER commit
- API token in `app.js` should be environment variable in production
- Consider adding request rate limiting

⚠️ **Dependencies:**
- Frontend has no build step - plain HTML/CSS/JS
- Backend requires Flask, SQLAlchemy, Flask-CORS
- `package.json` exists but isn't used (legacy from another project)

## Troubleshooting

**"Could not load workout" error:**
- Check Flask server is running
- Verify CORS settings
- Check database connection in config.py

**Empty dropdowns:**
- Check API endpoint returns data
- Verify token authentication
- Check browser console for errors

**Shopping list not generating:**
- Ensure recipes have ingredients in database
- Check ingredient table has recipe_id foreign keys
- Verify fetch logic in app.js
