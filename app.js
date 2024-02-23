document.addEventListener('DOMContentLoaded', function() {
  populateAllMealDropdowns();

  document.getElementById('plan-meals').addEventListener('click', generateShoppingList);
});

async function populateAllMealDropdowns() {
  const MAX_RETRIES = 3; // Define the maximum number of retry attempts
  let retries = 0;

  try {
    const response = await fetch('https://marcuu.pythonanywhere.com/recipes', {
      method: 'GET',
      headers: {
        'Authorization': 'Token d7d9b014bc89742181d8dfd65270e6386e6f7833'
      }
    });

    if (!response.ok) {
      throw new Error(`Network response error: ${response.status}`);
    }

    const meals = await response.json();

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    daysOfWeek.forEach(day => {
      const select = document.getElementById(day);

      // Add the default option
      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Choose a meal';
      defaultOption.value = '';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.hidden = true; // Hide this option once others are available
      select.appendChild(defaultOption);

      // Populate the dropdown with meal options
      meals.forEach(meal => {
        const option = document.createElement('option');
        option.value = meal;
        option.textContent = meal;
        select.appendChild(option);
      });
    });
  } catch (error) {
    retries++;
    if (retries < MAX_RETRIES) {
      console.warn(`Retrying meal dropdown population (attempt ${retries}/${MAX_RETRIES})...`);
      await populateAllMealDropdowns(); // Retry recursively
    } else {
      console.error('Error fetching meals:', error);

      // Create and style the error message element
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('error-message');
      errorMessage.textContent = 'An error occurred while fetching meals. Please try refreshing the page.';

      // Insert the error message at the top of the page
      const firstElement = document.body.firstChild;
      if (firstElement) {
        document.body.insertBefore(errorMessage, firstElement);
      } else {
        document.body.appendChild(errorMessage);
      }
    }
  }
}
function generateShoppingList() {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  let shoppingList = new Map(); // Using a map to avoid duplicate ingredients

  Promise.all(daysOfWeek.map(day => {
    const mealName = document.getElementById(day).value;
    if (mealName) { // Proceed only if a meal is selected
      return fetch(`https://marcuu.pythonanywhere.com/recipes/${mealName}`, {
        headers: {
          'Authorization': 'Token d7d9b014bc89742181d8dfd65270e6386e6f7833'
        }
      })
      .then(response => {
        // Check for network errors (status codes outside 200-299 range)
        if (!response.ok) {
          throw new Error(`Network response error: ${response.status}`);
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
        // Display a user-friendly error message indicating the specific issue
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        if (error.message.includes('Network')) {
          errorMessage.textContent = 'There was a network error while fetching ingredients. Please check your internet connection and try again.';
        } else {
          errorMessage.textContent = 'An error occurred while fetching ingredients. Please try again later.';
        }
        document.body.insertBefore(errorMessage, document.body.firstChild);
      });
    } else {
      return Promise.resolve(); // Resolve to nothing if no meal is selected
    }
  }))
  .then(() => {
    // Now that all ingredients have been gathered, display the shopping list
    displayShoppingList(Array.from(shoppingList));
  });
}

function scrollToShoppingList() {
  const shoppingListElement = document.getElementById('shopping-list');
  if (shoppingListElement) {
      shoppingListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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

    scrollToShoppingList();
  }
