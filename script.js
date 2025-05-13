const GITHUB_REPO = 'https://raw.githubusercontent.com/your-username/your-repo/main/recipes/';

const recipeFiles = [
  'chocolate-cake.md',
  'apple-pie.md',
  'spaghetti-bolognese.md'
];

const recipesContainer = document.getElementById('recipes');
const searchInput = document.getElementById('search');

let recipes = [];

async function fetchRecipes() {
  const fetches = recipeFiles.map(async file => {
    const res = await fetch(GITHUB_REPO + file);
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
    div.innerHTML = `<h2>${r.title}</h2>${r.content}`;
    recipesContainer.appendChild(div);
  });
}

searchInput.addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = recipes.filter(r => r.title.toLowerCase().includes(query));
  displayRecipes(filtered);
});

fetchRecipes();
