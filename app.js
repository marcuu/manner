document.addEventListener('DOMContentLoaded', function() {
  populateMealDropdowns();

  document.getElementById('plan-meals').addEventListener('click', generateShoppingList);
  document.getElementById('suggest-meals').addEventListener('click', suggestMeals);
});

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      if (isLastAttempt) {
        throw error;
      }
      // Exponential backoff: 100ms, 200ms, 400ms
      const delay = 100 * Math.pow(2, attempt);
      console.warn(`Fetch failed (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function populateDropdowns(meals, daysOfWeek, mealType) {
  daysOfWeek.forEach(day => {
    const select = document.getElementById(day);
    if (!select) return;

    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Choose a meal';
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.hidden = true;
    select.appendChild(defaultOption);

    meals.filter(meal => meal.mealType === mealType).forEach(meal => {
      const option = document.createElement('option');
      option.value = meal.MealName;
      option.textContent = meal.MealName;
      select.appendChild(option);
    });
  });
}

async function populateMealDropdowns() {
  try {
    const meals = await fetchWithRetry('https://marcuu.pythonanywhere.com/recipes');

    const dinnerDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const lunchDays = ['lunch-monday', 'lunch-tuesday', 'lunch-wednesday', 'lunch-thursday', 'lunch-friday', 'lunch-saturday', 'lunch-sunday'];

    populateDropdowns(meals, dinnerDays, 'dinner');
    populateDropdowns(meals, lunchDays, 'lunch');
  } catch (error) {
    console.error('Error fetching meals:', error);
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'An error occurred while fetching meals. Please try refreshing the page.';
    document.body.insertBefore(errorMessage, document.body.firstChild);
  }
}

function generateShoppingList() {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'lunch-monday', 'lunch-tuesday', 'lunch-wednesday', 'lunch-thursday', 'lunch-friday', 'lunch-saturday', 'lunch-sunday'];
  let shoppingList = new Map(); // Using a map to avoid duplicate ingredients

  Promise.all(daysOfWeek.map(day => {
    const mealName = document.getElementById(day).value;
    if (mealName) { // Proceed only if a meal is selected
      return fetch(`https://marcuu.pythonanywhere.com/recipes/${mealName}`)
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
    document.querySelectorAll('#essentials input[type="checkbox"]:checked').forEach(cb => {
      const item = cb.value;
      if (shoppingList.has(item)) {
        shoppingList.set(item, shoppingList.get(item) + 1);
      } else {
        shoppingList.set(item, 1);
      }
    });

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
  let shoppingListText = 'Shopping List:\n'; // Initialize the shopping list text
  ingredientsList.forEach(ingredient => {
    const item = document.createElement('li');
    item.textContent = `${ingredient[1]}x ${ingredient[0]}`; // e.g., 2x Tomato
    list.appendChild(item);

    // Add each item to the shoppingListText
    shoppingListText += `${ingredient[1]}x ${ingredient[0]}\n`;
  });

  shoppingListElement.appendChild(list);

  // Share button logic
const shareButton = document.getElementById('shareButton');
if (navigator.share && /Mobi/.test(navigator.userAgent)) { // Check if Web Share API is supported and if on a mobile device
  shareButton.style.display = 'inline-block'; // Show the share button

  shareButton.addEventListener('click', async () => {
    try {
      await navigator.share({
        title: 'My Shopping List',
        text: shoppingListText // Share the shopping list text
      });
      console.log('Shopping list shared successfully');
    } catch (err) {
      console.error('Error sharing shopping list', err);
    }
  });
} else {
  shareButton.style.display = 'none'; // Hide the share button if not on a mobile device or if Web Share API is not supported
}


    scrollToShoppingList();
}

async function suggestMeals() {
  try {
    const meals = await fetchWithRetry('https://marcuu.pythonanywhere.com/recipes');

    const dinnerMeals = meals.filter(meal => meal.mealType === 'dinner');
    const lunchMeals = meals.filter(meal => meal.mealType === 'lunch');

    const dinnerDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const lunchDays = ['lunch-monday', 'lunch-tuesday', 'lunch-wednesday', 'lunch-thursday', 'lunch-friday', 'lunch-saturday', 'lunch-sunday'];

    fillRandomSelections(dinnerDays, dinnerMeals);
    fillRandomSelections(lunchDays, lunchMeals);

  } catch (error) {
    console.error('Error suggesting meals:', error);
  }
}

function fillRandomSelections(days, meals) {
  const available = [...meals];
  days.forEach(day => {
    const select = document.getElementById(day);
    if (!select || available.length === 0) return;
    const index = Math.floor(Math.random() * available.length);
    const meal = available.splice(index, 1)[0];
    const option = Array.from(select.options).find(opt => opt.value === meal.MealName);
    if (option) {
      select.value = meal.MealName;
    }
  });
}