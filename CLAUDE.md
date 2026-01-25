# CLAUDE.md - AI Assistant Guide for Manner

This document provides essential context for AI assistants working on the Manner codebase.

## Project Overview

**Manner** is a web-based meal planning application that helps users plan weekly meals and generate shopping lists automatically. The tagline: "Meal planning is annoying. This makes it easy."

### Core Features
- Select dinner meals for each day of the week
- Optionally add lunch selections
- Add essential household items (Fabric Conditioner, Bin Bags, etc.)
- Auto-generate a shopping list with ingredient counts
- Random meal suggestion feature
- Mobile sharing via Web Share API

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML5, CSS3, JavaScript |
| Backend | Python Flask with SQLAlchemy |
| Database | MySQL |
| Hosting | PythonAnywhere (backend), StableHost (frontend) |

## Project Structure

```
manner/
├── manner.html      # Single-page HTML application with inline CSS
├── app.js           # Frontend JavaScript (dropdown population, shopping list generation)
├── flask_app.py     # Flask REST API backend
├── server.js        # Node.js server template (unused/incomplete)
├── package.json     # Node.js dependencies (for optional Express server)
└── README.md        # User-facing documentation
```

### Key Files

| File | Purpose |
|------|---------|
| `app.js` | Main frontend logic: populates dropdowns, generates shopping lists, suggests meals |
| `manner.html` | Complete UI with inline styles, accessibility features, and semantic HTML |
| `flask_app.py` | REST API with endpoints for recipes and ingredients |
| `README.md` | API documentation and setup instructions |

## API Reference

**Base URL:** `https://marcuu.pythonanywhere.com/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recipes` | Get all recipes with mealType |
| GET | `/recipes/<meal_name>` | Get specific recipe with ingredients |
| GET | `/recipes_with_ingredients` | Get all recipes with all ingredients |
| POST | `/add_recipe` | Add new recipe (requires auth) |

**Authentication:** Requires `Authorization: Token <token>` header

## Development Commands

```bash
# Node.js (optional server)
npm start       # Run server.js
npm run dev     # Run with nodemon (auto-reload)

# Flask backend
flask run       # Start Flask development server
```

## Code Conventions

### JavaScript (app.js)

- **Async/await** for API calls with try-catch error handling
- **Map data structure** for deduplicating shopping list ingredients
- **Promise.all** for parallel API requests
- Event-driven initialization with `DOMContentLoaded`
- Retry logic with `MAX_RETRIES = 3` for network failures

### HTML (manner.html)

- **Accessibility first**: ARIA labels, skip-to-content link, proper label-input associations
- **Semantic HTML5**: `<details>` for collapsible sections, proper heading hierarchy
- **Inline CSS** with consistent color palette:
  - Primary blue: `#11549b`
  - Hover blue: `#003d82`
  - Background: `#f0f0f0`
  - Card background: `#ffffff`

### Flask (flask_app.py)

- SQLAlchemy ORM for database operations
- CORS restricted to `https://marcusburgess.co.uk`
- Database credentials in separate `config.py` (not in repo)
- Two models: `Recipes` and `Ingredients` with FK relationship

## Database Schema

```sql
-- Recipes table
CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    MealName VARCHAR(50),
    cuisine VARCHAR(50),
    mealType VARCHAR(50)  -- 'dinner' or 'lunch'
);

-- Ingredients table
CREATE TABLE ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    recipe_id INT REFERENCES recipes(id)
);
```

## Important Patterns

### Meal Type Filtering
Meals are filtered by `mealType` field:
- `'dinner'` - Shown in main day dropdowns
- `'lunch'` - Shown in lunch section dropdowns

### Shopping List Generation
1. Collect selected meals from all dropdowns
2. Fetch ingredients for each meal via API
3. Use Map to count ingredient occurrences
4. Include checked essentials from checkbox section
5. Display formatted list with counts (e.g., "2x Tomato")

### Random Meal Suggestion
- Fetches all meals, filters by type
- Uses `splice` to ensure no duplicate suggestions across days
- Populates dropdowns without repeating meals

## Testing

**No automated tests exist.** When making changes:
- Test meal dropdown population manually
- Verify shopping list generation with multiple meals
- Test on mobile for Web Share API functionality
- Check accessibility with screen reader or browser tools

## Common Tasks

### Adding a New Recipe
Use the POST `/add_recipe` endpoint with JSON body:
```json
{
    "MealName": "Recipe Name",
    "cuisine": "Italian",
    "mealType": "dinner",
    "ingredients": ["Ingredient 1", "Ingredient 2"]
}
```

### Modifying UI Colors
Edit inline `<style>` block in `manner.html`. Key selectors:
- `button` - Primary action buttons
- `#meal-planner` - Main card container
- `#shopping-list` - Results container

### Adding New Essential Items
Add checkbox in `manner.html` inside `#essentials` div:
```html
<label><input type="checkbox" value="Item Name"> Item Name</label>
```

## Known Issues and Considerations

1. **API token in client-side code** (`app.js:17`) - Security concern, token is visible
2. **No input validation** on POST endpoints
3. **No rate limiting** on API
4. **server.js is incomplete** - MongoDB connection not configured, not used in production
5. **Retry logic bug** in `populateAllMealDropdowns()` - calls wrong function on retry

## Git Workflow

- Feature branches prefixed with contributor name (e.g., `codex/feature-name`)
- Pull request workflow with merge commits
- Descriptive commit messages focusing on what changed

## Resources

- Production Frontend: Hosted on StableHost
- Production API: https://marcuu.pythonanywhere.com/
- Database Management: PythonAnywhere MySQL console
