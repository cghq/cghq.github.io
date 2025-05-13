const GITHUB_API = 'https://api.github.com/repos/cghq/cghq.github.io/contents/recipes';
const RAW_BASE = 'https://raw.githubusercontent.com/cghq/cghq.github.io/main/recipes/';

const recipesContainer = document.getElementById('recipes');
const searchInput = document.getElementById('search');

let recipes = [];

async function fetchRecipeList() {
const res = await fetch(GITHUB_API);
const files = await res.json();
return files
.filter(file => file.name.endsWith('.md'))
.map(file => file.name);
}

async function fetchRecipes() {
const recipeFiles = await fetchRecipeList();
const fetches = recipeFiles.map(async file => {
const res = await fetch(RAW_BASE + file);
const text = await res.text();
const title = text.split('\n')[0].replace(/^# /, '');
return { title, content: marked.parse(text) };
});
recipes = await Promise.all(fetches);
displayRecipes(recipes);
}

function displayRecipes(list) {
recipesContainer.innerHTML = '';
list.forEach(r => {
const div = document.createElement('div');
div.className = 'recipe';
div.innerHTML = <h2>${r.title}</h2>${r.content};
recipesContainer.appendChild(div);
});
}

searchInput.addEventListener('input', e => {
const query = e.target.value.toLowerCase();
const filtered = recipes.filter(r => r.title.toLowerCase().includes(query));
displayRecipes(filtered);
});

fetchRecipes();
