const MAX_POKEMON = 151;

let allPokemons = [];

const pokemonList = document.querySelector('.pokemon-list');
const typeFilter = document.getElementById('type-filter');

fetchPokemons(MAX_POKEMON);

typeFilter.addEventListener('change', () => {
  const selectedType = typeFilter.value;
  console.log(selectedType);
  if(selectedType === "all"){
    displayPokemons(allPokemons);
  } else {
    filterPokemonsByType(selectedType);
  }
});

function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

async function fetchPokemons(MAX_POKEMON) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`);
  const data = await response.json();
  allPokemons = await Promise.all(data.results.map(async (pokemon) => {
    const pokemonData = await fetchPokmeonData(pokemon.url);
    return { ...pokemon, types: pokemonData.types.map(typeInfo => typeInfo.type.name) };
  }));
  displayPokemons(allPokemons);
}

async function fetchPokmeonData(url) {
  const response = await fetch(url);
  return await response.json();
}

async function displayPokemons(pokemon) {
  pokemonList.innerHTML = '';
  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split('/')[6];
    const listItem = document.createElement('div');
    //const types = pokemon.types.join(' ');
    const types = pokemon.types.map(type => {
      const color = typeColors[type];
      const capitalizedType = capitalizeFirstLetter(type);
      return `<span class="pokemon-type" style="background-color: ${color};">${capitalizedType}</span>`;
    }).join(' ');

    listItem.className = 'list-item';
    listItem.innerHTML = `
    <div class="name-wrap">
      <p class="body3-fonts">${capitalizeFirstLetter(pokemon.name)}</p>
    </div>
    <div class="img-wrap"> 
      <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}" class="img-pokemon"/>
    </div>
    <div class="type-wrap">
      <p>${types}</p>
    </div>
    `;
    listItem.addEventListener('click', () => {
      window.location.href = `./detail.html?id=${pokemonID}`;
    });
    pokemonList.appendChild(listItem);
  });
}


// Filter Pokémon by selected type
function filterPokemonsByType(type) {
  const filteredPokemons = allPokemons.filter(pokemon => pokemon.types.includes(type));
  displayPokemons(filteredPokemons);
}

// Fetch Pokémon data before redirecting to the detail page
async function fetchPokemonDataBeforeRedirect(id) {
  try {
      const [pokemon, pokemonSpecies] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) => response.json()),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((response) => response.json())
      ]);
      return true;
  } catch (error) {
      console.error('Error fetching Pokémon data before redirect:', error);
  }
}


const typeColors = {
  normal: '#a8a77a',
  fire: '#ee8130',
  water: '#6390f0',
  electric: '#f7d02c',
  grass: '#7ac74c',
  ice: '#96d9d6',
  fighting: '#c22e28',
  poison: '#a33ea1',
  ground: '#e2bf65',
  flying: '#a98ff3',
  psychic: '#f95587',
  bug: '#a6b91a',
  rock: '#b6a136',
  ghost: '#735797',
  dragon: '#6f35fc',
  dark: '#705746',
  steel: '#b7b7ce',
  fairy: '#d685ad',
};










/*


fetch('https://pokeapi.co/api/v2/pokemon/ditto')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Convertir la respuesta en JSON
  })
  .then(data => {
    // Extraer los tipos del Pokémon
    const types = data.types.map(typeInfo => typeInfo.type.name);
    console.log(`Los tipos de Ditto son: ${types.join(', ')}`);
  })
  .catch(error => {
    console.error('Error fetching Pokémon types:', error);
  });

async function fetchPokemons(MAX_POKEMON) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`);
    const data = await response.json();
    allPokemons = data.results;
    displayPokemons(allPokemons);
}


async function displayPokemons(pokemon) {
    pokemonList.innerHTML = '';
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split('/')[6];
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `<p>${pokemon.name}</p>`;
        listItem.addEventListener('click', async () => {
            const isFetched = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (isFetched) {
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });
        pokemonList.appendChild(listItem);
    });
}

async function fetchPokemonDataBeforeRedirect(id){
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((response) => response.json())
        ]);
        return true;
    } catch (error) {
        console.error('Error to fetch Pokemon data before redirect:', error);
    }
}

console.log("fetchPokemons");

fetchPokemons(MAX_POKEMON);
*/