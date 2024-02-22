document.addEventListener('DOMContentLoaded', function() {
  populateAllMealDropdowns();

  document.getElementById('plan-meals').addEventListener('click', generateShoppingList);
});

function populateAllMealDropdowns() {
  fetch('https://marcuu.pythonanywhere.com/recipes', {
    method: 'GET',
    headers: {
      'Authorization': 'Token d7d9b014bc89742181d8dfd65270e6386e6f7833'
    }
  })
  .then(response => response.json())
  .then(meals => {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    daysOfWeek.forEach(day => {
      const select = document.getElementById(day);
      // Add the default option as the first option element in the select
      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Choose a meal';
      defaultOption.value = '';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.hidden = true; // Hide this option once others are available
      select.appendChild(defaultOption);

      // Populate each dropdown with the same set of meal options
      meals.forEach(meal => {
        const option = document.createElement('option');
        option.value = meal;
        option.textContent = meal;
        select.appendChild(option);
      });
    });
  })
  .catch(error => {
    console.error('Error fetching meals:', error);
  });
}

  
  function generateShoppingList() {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let shoppingList = new Map(); // Using a map to avoid duplicate ingredients
  
    Promise.all(daysOfWeek.map(day => {
      const mealName = document.getElementById(day).value;
      if (mealName) { // Proceed only if a meal is selected
        return fetch(`https://marcuu.pythonanywhere.com//recipes/${mealName}`, {
          headers: {
            'Authorization': 'Token d7d9b014bc89742181d8dfd65270e6386e6f7833'
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          data.ingredients.forEach(ingredient => {
            // If the ingredient is already in the map, increment the count
            if (shoppingList.has(ingredient)) {
              shoppingList.set(ingredient, shoppingList.get(ingredient) + 1);
            } else {
              shoppingList.set(ingredient, 1);
            }
          });
        })
        .catch(error => {
          console.error('Error fetching ingredients:', error);
        });
      } else {
        return Promise.resolve(); // Resolve to nothing if no meal is selected
      }
    })).then(() => {
      // Now that all ingredients have been gathered, display the shopping list
      displayShoppingList(Array.from(shoppingList));
    });
  }
  
  function displayShoppingList(ingredientsList) {
    const shoppingListElement = document.getElementById('shopping-list');
    shoppingListElement.innerHTML = '<h2>Shopping List</h2>';
  
    // Create a list for the ingredients
    const list = document.createElement('ul');
    ingredientsList.forEach(ingredient => {
      const item = document.createElement('li');
      item.textContent = `${ingredient[1]}x ${ingredient[0]}`; // e.g., 2x Tomato
      list.appendChild(item);
    });
  
    shoppingListElement.appendChild(list);
  }

  