const GITHUB_API = 'https://api.github.com/repos/cghq/cghq.github.io/contents/recipes';
const RAW_BASE = 'https://raw.githubusercontent.com/cghq/cghq.github.io/main/recipes/';

const recipesContainer = document.getElementById('recipes');
const searchInput = document.getElementById('search');

let recipes = [];

async function fetchRecipeList() {
try {
const res = await fetch(GITHUB_API);
if (!res.ok) throw new Error('Failed to fetch recipe list');
const files = await res.json();
return files
.filter(file => file.name.endsWith('.md'))
.map(file => file.name);
} catch (err) {
console.error('Error fetching recipe list:', err);
recipesContainer.innerHTML = '<p>⚠️ Failed to load recipe list.</p>';
return [];
}
}

async function fetchRecipes() {
const recipeFiles = await fetchRecipeList();
const fetches = recipeFiles.map(async file => {
try {
const res = await fetch(RAW_BASE + file);
const text = await res.text();
const title = file.replace(/.md$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
return { title, content: marked.parse(text) };
} catch (err) {
console.error(Error loading ${file}:, err);
return null;
}
});

const loaded = await Promise.all(fetches);
recipes = loaded.filter(r => r !== null);
displayRecipes(recipes);
}

function displayRecipes(list) {
recipesContainer.innerHTML = '';
if (list.length === 0) {
recipesContainer.innerHTML = '<p>No recipes found.</p>';
return;
}
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
