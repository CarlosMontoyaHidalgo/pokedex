const MAX_POKEMON = 151;
const listWrapper = document.querySelector('.list-wrapper');
const searchInput = document.querySelector('#search-input');
const numberFilter = document.querySelector('#number');
const nameFilter = document.querySelector('#name');
const notFoundMessage = document.querySelector('#not-found-message');

let allPokemons = []; /*Array to store all our Pokemons*/

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then(response => response.json())
.then((data) => {
    allPokemons = data.results; 
    displayPokemons(allPokemons);
    
}).catch(error => console.error('Error:', error))

/*
allPokemons[].name
allPokemons[].url

*/

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

function displayPokemons(pokemon){
    listWrapper.innerHTML ='';
    pokemon.forEach((pokemon)=>{
        const pokemonID = pokemon.url.split('/')[6];
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">${pokemon.name}</p>
        </div>
        `;
        listItem.addEventListener('click', async () => {
            const isFetched = await fetchPokemonDataBeforeRedirect(pokemonID);
            if(isFetched){
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });

        listWrapper.appendChild(listItem);
    });
}
/* 
<img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
<img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}" />
`pokemon-detail.html?pokemonID=${pokemonID}` 
*/

searchInput.addEventListener('keyup', handleSearch);
function handleSearch2(){
    const searchValue = searchInput.value.toLowerCase();
    const filteredPokemons = allPokemons.filter((pokemon) => pokemon.name.includes(searchValue));
    displayPokemons(filteredPokemons);
    if(filteredPokemons.length === 0){
        notFoundMessage.style.display = 'block';
    }else{
        notFoundMessage.style.display = 'none';
    }
}

function handleSearch(){
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;
    if(numberFilter.checked){
        filteredPokemons = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split('/')[6];
            return pokemonID.startsWith(searchTerm);
        });
    } else if(nameFilter.checked){
        filteredPokemons = allPokemons.filter((pokemon) => pokemon.name.toLowerCase().startsWith(searchTerm));
    } else {
        filteredPokemons = allPokemons;
    }

    displayPokemons(filteredPokemons);
    if(filteredPokemons.length === 0){
        notFoundMessage.style.display = 'block';
    }else{
        notFoundMessage.style.display = 'none';
    }   
}

const closeButton = document.querySelector('.search-close-icon');
closeButton.addEventListener('click', clearSearch);

function clearSearch(){
    searchInput.value = '';
    displayPokemons(allPokemons);
    notFoundMessage.style.display = 'none';
}