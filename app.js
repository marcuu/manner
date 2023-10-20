document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("load-meals").addEventListener("click", loadMeals);
  });
  
  function loadMeals() {
    fetch('http://localhost:3000/api/meals')  // Replace with your API endpoint
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
  