// DOM elements
const themeToggle = document.getElementById('toggle');
const headings = document.getElementById('heading');
const searchContainer = document.getElementById('search_container');
const searchInput = document.getElementById('search_input');
const searchBtn = document.getElementById('search_btn');
const mealsContainer = document.getElementById('meals');
const resultHeading = document.getElementById('result_heading');
const errorContainer = document.getElementById('error-container');
const deleteBtn = document.getElementById('delete_btn');
const mealDetails = document.getElementById('meal-details');
const mealsDetailsContent = document.getElementById('meals-details-content');
const backBtn = document.getElementById('back-btn');


// variables
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
    document.documentElement.setAttribute("data-theme", "🌑");
    }
    else {
        document.documentElement.setAttribute("data-theme", "☀️");
    }
});

// event listeners
searchBtn.addEventListener('click', searchMeals)
searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') searchMeals()
});

deleteBtn.addEventListener('click', () => {
    searchInput.value = '';
});

mealsContainer.addEventListener('click', handleMealClick)

backBtn.addEventListener('click', () => {
    mealDetails.classList.add('hidden')
    mealsContainer.classList.remove('hidden')
    searchContainer.classList.remove('hidden')
    headings.classList.remove('hidden')
});
// functions
async function searchMeals() {
    const searchTerm = searchInput.value.trim()
    if(!searchTerm){
        errorContainer.textContent = 'Please enter a valid search term';
        errorContainer.classList.remove('hidden')
        return;
    }

    try {
        resultHeading.textContent = `Searching for '${searchTerm}...'`
        mealsContainer.innerHTML = '';
        errorContainer.classList.add('hidden')

        // fetch from api
        const response = await fetch(`${SEARCH_URL}${searchTerm}`);
        const data = await response.json();

        console.log('data is here:', data);
        if(data.meals === null) {
            // no meals found
            resultHeading.textContent = ``
            mealsContainer.innerHTML = ''
            errorContainer.textContent = `No recipes found for ${searchTerm}. Try another search term`;
            errorContainer.classList.remove('hidden')
        }
        else{
            resultHeading.textContent = `Search results for ${searchTerm}:`
            displayMeals(data.meals)
            searchInput.value = ''
        }
    } catch (error) {
        errorContainer.textContent = `Something went wrong. Please try again later.`;
        errorContainer.classList.remove('hidden')

    }
}

function displayMeals(meals) {
    mealsContainer.innerHTML = '';

  // loop through meals and create a card for each meal
  meals.forEach((meal) => {
    mealsContainer.innerHTML += `
      <div class="meal" data-meal-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="meal-info">
          <h3 class="meal-title">${meal.strMeal}</h3>
          ${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
        </div>
      </div>
    `;
  });
}

async function handleMealClick(e) {
    console.log('clicked');
    const mealEl = e.target.closest('.meal')
    if(!mealEl) return

    const mealId = mealEl.getAttribute('data-meal-id')

    try {
      const response = await fetch(`${LOOKUP_URL}${mealId}`);
      const data = await response.json();

      console.log(mealId);
      console.log(data);

      if (data.meals && data.meals[0]) {
          const meal = data.meals[0]

          const ingredients = []

          for (let i = 1; i <= 20; i++) {
              const ingredient = meal[`strIngredient${i}`];
              const measure = meal[`strMeasure${i}`];

              if (ingredient && ingredient.trim()) {
                  ingredients.push({
                      ingredient: ingredient.trim(),
                      measure: measure ? measure.trim() : ''
                  });
              }
          }

      // display meal details
      mealsDetailsContent.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
        <h2 class="meal-details-title">${meal.strMeal}</h2>
        <div class="meal-details-category">
          <span>${meal.strCategory || "Uncategorized"}</span>
        </div>
        <div class="meal-details-instructions">
          <h3>Instructions</h3>
          <p>${meal.strInstructions}</p>
        </div>
        <div class="meal-details-ingredients">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            ${ingredients
              .map(
                (item) => `
              <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
            `
              )
              .join("")}
          </ul>
        </div>
        ${
          meal.strYoutube
            ? `
          <a href="${meal.strYoutube}" target="_blank" class="yt-link">
            <i class="fab fa-youtube"></i> Watch Video
          </a>
        `
            : ""
        }
      `;

            mealDetails.classList.remove('hidden')
            // mealDetails.scrollIntoView({ behavior: 'smooth'});
            mealsContainer.classList.add('hidden')
            searchContainer.classList.add('hidden')
            headings.classList.add('hidden')
        }
    }
    catch(error){
        console.error(error);
        errorContainer.textContent = "Failed to load meal details.";
        errorContainer.classList.remove('hidden');   
    }   
}