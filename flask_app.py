from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import SQLALCHEMY_DATABASE_URI

app = Flask(__name__)
CORS(app, resources={r"/recipes/*": {"origins": "https://marcusburgess.co.uk"}})
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the models for the database
class Recipes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    MealName = db.Column(db.String(50))
    cuisine = db.Column(db.String(50))

class Ingredients(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))
    # ... add other fields as necessary ...

@app.route('/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipes.query.order_by(Recipes.MealName).all()
    return jsonify([recipe.MealName for recipe in recipes])

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    data = request.json
    new_recipe = Recipes(MealName=data['MealName'], cuisine=data.get('cuisine', 'Unknown'))
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify({"message": "Recipe added successfully!"}), 201

@app.route('/recipes/<string:MealName>', methods=['GET'])
def get_recipe(MealName):
    recipe = Recipes.query.filter_by(MealName=MealName).first()
    if recipe:
        ingredients = Ingredients.query.filter_by(recipe_id=recipe.id).all()
        ingredient_list = [ingredient.name for ingredient in ingredients]
        return jsonify({"MealName": recipe.MealName, "ingredients": ingredient_list})
    else:
        return jsonify({"message": "Recipe not found"}), 404

@app.route('/recipes_with_ingredients', methods=['GET'])
def get_recipes_with_ingredients():
    recipes = db.session.query(Recipes, Ingredients).join(Ingredients, Recipes.id == Ingredients.recipe_id).all()
    recipes_dict = {}

    for recipe, ingredient in recipes:
        if recipe.MealName not in recipes_dict:
            recipes_dict[recipe.MealName] = {'cuisine': recipe.cuisine, 'ingredients': []}
        recipes_dict[recipe.MealName]['ingredients'].append(ingredient.name)

    return jsonify(recipes_dict)

def create_tables():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    create_tables()  # Create tables if they don't exist.
