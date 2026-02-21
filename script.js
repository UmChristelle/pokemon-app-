const searchInput    = document.querySelector('#searchInput');
const searchBtn      = document.querySelector('#searchBtn');
const loader         = document.querySelector('#loader');
const cardContainer  = document.querySelector('#cardContainer');
const errorMsg       = document.querySelector('#errorMsg');
const cardHeader     = document.querySelector('#cardHeader');
const pokemonId      = document.querySelector('#pokemonId');
const pokemonName    = document.querySelector('#pokemonName');
const typesContainer = document.querySelector('#typesContainer');
const spriteFront    = document.querySelector('#spriteFront');
const spriteBack     = document.querySelector('#spriteBack');
const spriteShiny    = document.querySelector('#spriteShiny');
const spriteBackWrap  = document.querySelector('#spriteBackWrap');
const spriteShinyWrap = document.querySelector('#spriteShinyWrap');
const pokemonHeight  = document.querySelector('#pokemonHeight');
const pokemonWeight  = document.querySelector('#pokemonWeight');
const pokemonExp     = document.querySelector('#pokemonExp');
const darkToggle     = document.querySelector('#darkToggle');
const darkIcon       = document.querySelector('#darkIcon');

const typeGradients = {
  fire:     'from-orange-400 to-red-500',
  water:    'from-blue-400 to-cyan-500',
  grass:    'from-green-400 to-lime-500',
  electric: 'from-yellow-300 to-amber-400',
  psychic:  'from-pink-400 to-fuchsia-500',
  ice:      'from-cyan-300 to-sky-400',
  dragon:   'from-violet-500 to-purple-700',
  dark:     'from-gray-600 to-gray-800',
  fairy:    'from-pink-300 to-rose-400',
  normal:   'from-gray-300 to-stone-400',
  fighting: 'from-red-600 to-rose-700',
  flying:   'from-indigo-300 to-sky-400',
  poison:   'from-purple-400 to-violet-600',
  ground:   'from-yellow-500 to-amber-600',
  rock:     'from-yellow-700 to-stone-600',
  bug:      'from-lime-400 to-green-500',
  ghost:    'from-purple-600 to-indigo-700',
  steel:    'from-slate-400 to-gray-500',
};

function applyDarkMode(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  darkIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark);
}

applyDarkMode(localStorage.getItem('darkMode') === 'true');
darkToggle.addEventListener('click', () => {
  applyDarkMode(!document.documentElement.classList.contains('dark'));
});

function showLoader() {
  loader.classList.replace('hidden', 'flex');
  cardContainer.classList.add('hidden');
  errorMsg.classList.add('hidden');
}

function hideLoader() {
  loader.classList.replace('flex', 'hidden');
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
}

async function fetchPokemon() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return showError('Please enter a Pokémon name or ID!');

  showLoader();
  searchBtn.disabled = true;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

    if (response.status === 404) throw new Error(`"${query}" not found. Try another name or ID!`);
    if (!response.ok)           throw new Error(`Unexpected error (status ${response.status}). Try again.`);

    const data = await response.json();
    displayPokemon(data);

  } catch (error) {
    hideLoader();
    showError(error.message || 'Network error — check your connection and try again.');
  } finally {
    searchBtn.disabled = false;
  }
}

function displayPokemon(data) {
  pokemonName.textContent   = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  pokemonId.textContent     = `#${String(data.id).padStart(3, '0')}`;
  pokemonHeight.textContent = `${(data.height / 10).toFixed(1)} m`;
  pokemonWeight.textContent = `${(data.weight / 10).toFixed(1)} kg`;
  pokemonExp.textContent    = data.base_experience ?? '—';

  spriteFront.src = data.sprites.front_default || 'https://via.placeholder.com/96?text=No+Image';

  spriteBackWrap.classList.toggle('hidden', !data.sprites.back_default);
  if (data.sprites.back_default) spriteBack.src = data.sprites.back_default;

  spriteShinyWrap.classList.toggle('hidden', !data.sprites.front_shiny);
  if (data.sprites.front_shiny) spriteShiny.src = data.sprites.front_shiny;

  typesContainer.innerHTML = '';
  data.types.map((typeObj) => {
    const name  = typeObj.type.name;
    const badge = document.createElement('span');
    badge.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    badge.classList.add('type-' + name, 'text-white', 'text-xs', 'font-body', 'font-bold', 'px-3', 'py-1', 'rounded-full', 'uppercase', 'tracking-wider', 'shadow');
    return badge;
  }).forEach((badge) => typesContainer.appendChild(badge));

  const gradient = typeGradients[data.types[0].type.name] || 'from-yellow-300 to-orange-400';
  cardHeader.className = cardHeader.className.replace(/from-\S+|to-\S+/g, '').trim();
  cardHeader.classList.add('bg-gradient-to-br', ...gradient.split(' '));

  hideLoader();
  cardContainer.classList.remove('hidden');
  cardContainer.classList.remove('card-appear');
  void cardContainer.offsetWidth;
  cardContainer.classList.add('card-appear');
}

searchBtn.addEventListener('click', fetchPokemon);
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchPokemon(); });

window.addEventListener('load', () => {
  searchInput.value = 'ditto';
  fetchPokemon();
});