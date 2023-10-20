document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("load-meals").addEventListener("click", loadMeals);
  });
  
  function loadMeals() {
    fetch('https://manner-app-cd431d92f8c3.herokuapp.com/api/meals')  // Replace with your API endpoint
      .then(response => response.json())
      .then(data => displayMeals(data))
      .catch(error => console.error('Error:', error));
  }
  
  function displayMeals(meals) {
    const mealList = document.getElementById("meal-list");
    mealList.innerHTML = ""; // Clear previous meals
  
    meals.forEach(meal => {
      const mealItem = document.createElement("div");
      mealItem.textContent = meal.name;
      mealList.appendChild(mealItem);
    });
  }
  
