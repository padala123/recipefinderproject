// Recipe Finder JavaScript Code with Image Display
const API_KEY = 'your_api_key_here';  // Replace with your API key
const API_URL = 'https://api.spoonacular.com/recipes/complexSearch';
let currentPage = 1;

// Fetch recipes from API based on search query and filters
async function fetchRecipes(query, page = 1) {
    const isVegetarian = document.getElementById('vegetarian').checked;
    const isVegan = document.getElementById('vegan').checked;

    let filterQuery = '';
    if (isVegetarian) filterQuery += '&diet=vegetarian';
    if (isVegan) filterQuery += '&diet=vegan';

    const response = await fetch(${API_URL}?query=${query}${filterQuery}&number=10&offset=${(page - 1) * 10}&apiKey=${API_KEY});
    const data = await response.json();
    displayRecipes(data.results);
}

// Display fetched recipes in the UI
function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = ''; // Clear previous results

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <button onclick="addToFavorites('${recipe.title}', '${recipe.image}')">Add to Favorites</button>
        `;

        recipesContainer.appendChild(recipeCard);
    });
}

// Add recipe to favorites and store in localStorage
function addToFavorites(title, image) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ title, image });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// Display favorite recipes stored in localStorage
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesContainer = document.getElementById('favorites');
    favoritesContainer.innerHTML = '';

    favorites.forEach(recipe => {
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('favorite-card');

        favoriteCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="favorite-image">
        `;

        favoritesContainer.appendChild(favoriteCard);
    });
}

// Search button event listener
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});

// Pagination event listeners
document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    const query = document.getElementById('search-input').value;
    fetchRecipes(query, currentPage);
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        const query = document.getElementById('search-input').value;
        fetchRecipes(query, currentPage);
    }
});

// Initial display of favorites when the page loads
displayFavorites();