# Manner Documentation

## Overview

Manner is a web app designed to simplify the process of planning meals for the week. It allows users to select meals from a dropdown menu for each day of the week and automatically generates a shopping list based on the selected meals.

## Features

### Meal Selection

Users can choose meals from a dropdown list for each day of the week. The list of meals is fetched from the API documented below.

### Shopping List Generation

The app compiles a list of ingredients needed for the selected meals (retrieved from the API) and presents it in an easy-to-read format.

### Responsive Design

The application is built to be responsive, ensuring a seamless experience across various devices and screen sizes.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (Flask)
- **Database:** SQL (MySQL)
- **Hosting:** PythonAnywhere

## Setup and Installation

### Backend Setup

- Ensure Python and Flask are installed on your server.
- Set up your MySQL database and update the connection string in your Flask app configuration.

### Frontend Setup

- The frontend files (HTML, CSS, JavaScript) should be placed in the designated static directory of your Flask application.

### Running the Application

- Start the Flask server by running `flask run` from the command line within your project directory.
- Access the web application via the provided local URL or configure a domain if hosted.

## Usage

### Selecting Meals

- Use the dropdown menu for each day to select a meal.
- The dropdown menus are populated with meal options from the database.

### Generating a Shopping List

- Once all meals are selected, click the "Plan my meals" button.
- The application will display a shopping list with all the ingredients required for the selected meals.

## Customisation

### Colors

- The application uses a color palette defined in the CSS file. You can modify the HEX codes to match your desired theme.

### Meals Database

- Add or remove meals and their ingredients in the database to update the dropdown options.


# api 

## Overview

The Flask Recipes API provides functionalities to manage and retrieve recipes and their associated ingredients from a database.

## Base URL

`https://marcuu.pythonanywhere.com/`

## Endpoints

### 1. Get All Recipes

- **Endpoint:** `/recipes`
- **Method:** GET
- **Description:** Retrieves a list of all recipes.
- **Response:** JSON array of recipe names.

### 2. Add a Recipe

- **Endpoint:** `/recipe`
- **Method:** POST
- **Description:** Adds a new recipe to the database.
- **Request:** JSON with `name` and optional `cuisine`.
- **Response:** Success message and status `201 Created`.

### 3. Get a Specific Recipe

- **Endpoint:** `/recipes/<int:id>`
- **Method:** GET
- **Description:** Retrieves details of a specific recipe, including a list of associated ingredients.
- **Response:** JSON object with recipe name and ingredients list.

## Notes

- Authentication is not required.
- Ensure security measures, as database credentials are currently included in the code.



# Adding recipes directly in pythonanywhere
Usually I just add a recipe using SQL using the PA console. 

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
