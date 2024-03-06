# Manner Documentation

## Overview

Manner is a web application designed to simplify the process of planning meals for the week. It enables users to select meals from a dropdown menu for each day of the week and automatically generates a shopping list based on the selected meals. 

## Features

### Meal Selection

Users can choose meals from a dropdown list for each day of the week. The list of meals is fetched from the API documented below.

### Shopping List Generation

The application compiles a list of ingredients needed for the selected meals (retrieved from the API) and presents it in an easy-to-read format.

### Responsive Design

The application is built to be responsive, ensuring a seamless experience across various devices and screen sizes.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (Flask)
- **Database:** SQL (MySQL)
- **Hosting:** PythonAnywhere for the backend and StableHost for hosting the HTML, CSS, and MySQL files.

## Setup and Installation

### Backend Setup

- Ensure Python and Flask are installed on your server.
- Set up your MySQL database and update the connection string in your Flask app configuration.

### Frontend Setup

- The frontend files (HTML, CSS, JavaScript) should be placed in the designated static directory of your Flask application.
- Alternatively, you can host these files through a web host like StableHost.

### Running the Application

- Start the Flask server by executing `flask run` from the command line within your project directory.
- Access the web application via the provided local URL or configure a domain if hosted.

## Usage

### Selecting Meals

- Utilise the dropdown menu for each day to select a meal.
- Expand the lunches section to also include lunches.
- The dropdown menus are populated with meal options from the database.
- Meals are split by mealType and only included in the relevant meal section.

### Generating a Shopping List

- Once all meals are selected, click the "Plan my meals" button.
- The application will display a shopping list with all the ingredients required for the selected meals.

## Customisation

### Colours

- The application uses a colour palette defined in the CSS file. You can modify the HEX codes to match your desired theme.

### Meals Database

- Add or remove meals and their ingredients in the database to update the dropdown options.

# API Documentation

## Overview

The Flask Recipes API provides functionalities to manage and retrieve recipes and their associated ingredients from a database.

## Base URL

`https://marcuu.pythonanywhere.com/`

## Endpoints

### Get All Recipes

- **Endpoint:** `/recipes`
- **Method:** GET
- **Description:** Retrieves a list of all recipes and their meal type.
- **Response:** JSON array of recipe names and mealTypes.

### Add a Recipe

- **Endpoint:** `/add_recipe`
- **Method:** POST
- **Description:** Adds a new recipe to the database.
- **Request:** JSON with `name` and optional `cuisine`.
- **Response:** Success message and status `201 Created`.
- **Example:**
--header 'Authorization: Token _token here_' \
--header 'Content-Type: application/json' \
```
{
    "MealName": "Sample Recipe",
    "cuisine": "null",
    "mealType": "lunch",
    "ingredients": [
        "Ingredient 1",
        "Ingredient 2",
        "Ingredient 3"
    ]
}
```


### Get a Specific Recipe

- **Endpoint:** `/recipes/<int:id>`
- **Method:** GET
- **Description:** Retrieves details of a specific recipe, including a list of associated ingredients.
- **Response:** JSON object with recipe name and ingredients list.


### Get all recipes and ingredients

- **Endpoint:** `/recipes_with_ingredients
- **Method:** GET
- **Description:** Retrieves details of all recipes, and their associated ingredients.
- **Response:** JSON object with recipe names and ingredients lists.
  
## Security

- Database credentials are stored in a config file
- The API requires an authorization header

# Updating Recipes Using SQL

It's recommended to use the APIs to view and add recipes, however it is possible to directly update them using pythonanywhere's MySQL console. This is particularly relevant if you need to delete a recipe which is currently not supported via API. 

## Checking recipes

You can check the current list of recipes and their corresponding ID 
```
SELECT id, name FROM recipes ORDER BY id;
```

## Adding recipes

You can add a recipe using the SQL console

```
INSERT INTO recipes (name) VALUES 
('Courgette and Parmesan Soup (Slow Cooker)');
```

The recipes are referenced in the SQL table as a number, rather than by name. To add ingredients you need to know the number; for example, if the recipe was number 25 you'd do the following

``` 
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES 
(25, 'Courgette'),
(25, 'Onion'),
(25, 'Garlic');
```

## Deleting recipes

You can also delete recipes by first deleting their ingredients 

```
DELETE FROM ingredients WHERE recipe_id IN (4, 6);
```

Then you can delete the recipe entirely 

```
DELETE FROM recipes WHERE id IN (4, 6);
```
