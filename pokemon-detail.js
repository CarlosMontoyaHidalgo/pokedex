let currentPokemonId = null;
document.addEventListener('DOMContentLoaded', () => {
    const MAX_POKEMON = 151;
    const pokemonID = new URLSearchParams(window.location.search).get('id');
    const id = parseInt(pokemonID, 10);

    if(id < 1 || id > MAX_POKEMON){
        return (window.location.href = './index.html'); /* redirect to index.html if the id is invalid, 404.html*/
    }
    currentPokemonId = id;
    loadPokemon(id);
});


async function loadPokemon(id){
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) => response.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((response) => response.json()),
        ]);

        const abilitiesWrapper = document.querySelector('.pokemon-detail-wrap .pokemon-detail.move');
        abilitiesWrapper.innerHTML = ''; /*Clear the abilitiesWrapper previous pokemon*/

        if(currentPokemonId === id){
            displayPokemonDetails(pokemon);
            const flavorText = getEnglishFlavorText2(pokemonSpecies);

            document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;
            
            const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((selector) => document.querySelector(selector));
            
            leftArrow.removeEventListener('click', navigatePokemon);
            rightArrow.removeEventListener('click', navigatePokemon);

            if (id !== 1) {
                leftArrow.addEventListener('click', () => { navigatePokemon (id - 1); 
                });
            }
            if (id !== 151) {
                rightArrow.addEventListener('click', () => { navigatePokemon (id + 1);
                });
            }

            window.history.pushState({}, '', `./detail.html?id=${id}`); /*Update the URL without refreshing the page*/
        }

        return true;
    } catch (error) {
        console.error('Error while fetching Pokemon data:', error);
        return false;
    }
}

async function navigatePokemon(id){
    currentPokemonId = id;
    await loadPokemon(id);
    
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

function setElementStyles(elements, cssProperties, value){
    elements.forEach((element) => {
        element.style[cssProperties] = value;
    });
}

function rgbaFromHex(hexColor){
    return [
        parseInt(hexColor.slice(1, 3), 16), 
        parseInt(hexColor.slice(3, 5), 16), 
        parseInt(hexColor.slice(5, 7), 16),
    ].join(',');
}

function setTypeBackgroundColor(pokemon){
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];

    if(!color){
        console.warn(`Color not found for type: ${mainType}`);
        return;
    }
    const detailMainElement = document.querySelector('.detail-main');
    setElementStyles([detailMainElement], 'backgroundColor', color);
    setElementStyles([detailMainElement], 'borderColor', color);
    setElementStyles(document.querySelectorAll(".power-wrapper > p"), 'backgroundColor', color);
    setElementStyles(document.querySelectorAll(".stats-wrap p.stats"), 'color', color);
    setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"), "color", color);

    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar{
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }`;

    document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}){
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return element;
}

function displayPokemonDetails(pokemon){
    const {name, id, types,  weight, height ,abilities, stats} = pokemon;
    const capitalizePokemonName = capitalizeFirstLetter(name);

    document.querySelector("title").textContent = capitalizePokemonName;

    const detailMainElement = document.querySelector('.detail-main');
    detailMainElement.classList.add(name.toLowerCase());

    document.querySelector(".name-wrap .name").textContent = capitalizePokemonName;


    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`;

    const imageElement = document.querySelector('.detail-img-wrapper img');
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    imageElement.alt = name;

    const typeWrapper = document.querySelector('.power-wrapper');
    typeWrapper.innerHTML = '';


    types.forEach(({type}) => {
        createAndAppendElement(typeWrapper, 'p', {
            className: `body3-fonts type ${type.name}`,
            textContent: type.name,
        });
    });

    document.querySelector('.pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight').textContent = `${weight/10} kg`;
    document.querySelector('.pokemon-detail-wrap .pokemon-detail p.body3-fonts.height').textContent = `${height/10} m`;

    const abilitiesWrapper = document.querySelector('.pokemon-detail-wrap .pokemon-detail.move');
    
    abilities.forEach(({ability}) => {
        createAndAppendElement(abilitiesWrapper, 'p', {
            className: 'body3-fonts',
            textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector('.stats-wrapper');
    statsWrapper.innerHTML = '';

    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
      };

    stats.forEach(({ stat, base_stat }) => {
        const statDiv = document.createElement("div");
        statDiv.className = 'stats-wrap';
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, 'p', {
            className: 'body3-fonts stats',
            textContent: statNameMapping[stat.name],
        });
        createAndAppendElement(statDiv, 'p', {
            className: 'body3-fonts',
            textContent: String(base_stat).padStart(3, '0'),    
        });
        createAndAppendElement(statDiv, 'progress', {
            className: 'progress-bar',
            value: base_stat,
            max: 100,
        });
    });
    setTypeBackgroundColor(pokemon);
}

function getEnglishFlavorText1(pokemonSpecies){
    const englishFlavorText = pokemonSpecies.flavor_text_entries.find((entry) => entry.language.name === 'en');
    return englishFlavorText ? englishFlavorText.flavor_text : 'No description found';
}

function getEnglishFlavorText2(pokemonSpecies){
    for(let entry of pokemonSpecies.flavor_text_entries){
       
        if(entry.language.name === 'en'){
            let flavor = entry.flavor_text.replace(/\f/g, ' ');
            return flavor;
        }
    }
    return "No description found";
}

