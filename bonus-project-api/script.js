const getButtonByType = document.getElementById('get-by-types');

const getRandomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min));
}

const getRandomPokemon = (arr) => {
    const random = getRandomNumber(0, (arr.lenght-1))
    return arr[random];
}

const eventListenerTypeButtons = () => {
    const buttonType = document.getElementsByClassName('symbol');
    const arrayButton = Array.from(buttonType);
    
    arrayButton.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.target.classList.toggle('selected');
            const selectedClass = document.getElementsByClassName('selected');

            if(selectedClass.length > 2) {
                const arraySelected = Array.from(selectedClass);
                arraySelected.forEach((e) => {
                    e.classList.remove('selected');
                })
            }
        })
    })
}

function filterPokemons() {
    getButtonByType.addEventListener('click', async () => {
        const selectedClass = document.getElementsByClassName('selected');
        const arrFromSelected = Array.from(selectedClass);

        const getID = arrFromSelected.map((e) => {
            return e.id;
        })
        
        const pokemons = await getPokemonByTypes(...getID);
        const pokemon =  pokemons[getRandomNumber(0, pokemons.length)]
        appendPokemon(await getPokemonByName(pokemon), '.chosen-pokemon');
        await appendStrongAgainst(getID[0]);
        await appendWeakAgainst(getID[0]);
    })
}
filterPokemons();

eventListenerTypeButtons();

function toTitleCase(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

const fetchPokemon = (name) => {
    return fetch(`https://pokeapi.co/api/v2/type/${name}/`)
    .then((response) => response.json())
    .then((data) => data.pokemon)
}

const getPokemonByType = async (type) => {
    const pokemonByType = await fetchPokemon(type)
    .then((data) => data.map((e) => {
        return e.pokemon.name;
    }));

    return pokemonByType;
}

async function getPokemonByTypes (type1, type2) {
    const firstType = await getPokemonByType(type1);
    if(!type2) {
        return firstType;
    }
    const secondType = await getPokemonByType(type2);
    return firstType.filter((pokeA) => {
    return secondType.find((pokeB) => pokeA === pokeB);
  })
}

async function getPokemonByName(pokeName) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}/`)
    .then((response) => response.json())
    .then((data) => {
      const { name, types, sprites} = data;
      return { name, types, sprites }
    })
}
console.log((await getPokemonByName('landorus-incarnate')));

function appendPokemon (pokemon, element) {
  const getPokeSection = document.querySelector(element);
  getPokeSection.innerHTML = '';

  const pokeContent = document.createElement('section');
  const pokeName = document.createElement('h2');
  const pokeImage = document.createElement('img');
  const pokeTypes = document.createElement('div');

  pokeImage.src = `${(pokemon.sprites.other.dream_world.front_default) ? 
    pokemon.sprites.other.dream_world.front_default : 
    pokemon.sprites.other['official-artwork'].front_default}`;
  pokeImage.className = 'poke-sprite';

  pokeName.innerText = `Você escolheu o ${toTitleCase(pokemon.name)}! `;
  pokeName.className = 'poke-name';

  pokeContent.className = 'poke-section';
  pokeTypes.className = 'poke-types'; 

  pokemon.types.forEach((element) => {
    const span = document.createElement('span');

    span.classList.add(`${element.type.name}`);
    span.classList.add('type');
    span.innerHTML = `${toTitleCase(element.type.name)}`

    pokeTypes.appendChild(span);
  })
  
  pokeContent.appendChild(pokeName);
  pokeContent.appendChild(pokeImage);
  pokeContent.appendChild(pokeTypes);
  
  getPokeSection.appendChild(pokeContent);

}

const getButton = document.querySelector('#find-pokemon');
const getInput = document.querySelector('#pokemon-text');

getButton.addEventListener('click', async () => {
  appendPokemon(await getPokemonByName(`${getInput.value.toLowerCase()}`), '.chosen-pokemon');
  appendStrongAgainst('fire');
})

const getDamageRelations = async (type) => {
  return fetch(`https://pokeapi.co/api/v2/type/${type}/`)
    .then((response) => response.json())
    .then((data) => data.damage_relations)
}

async function appendStrongAgainst(type) {
  const pokeType = await getDamageRelations(type);
  const resistTo = pokeType.half_damage_from;

  const getPokeSection = document.querySelector('.advantage');
  getPokeSection.innerHTML = '';

  const pokeContent = document.createElement('section');
  
  const pokeTypes = document.createElement('div');

  pokeContent.className = 'poke-section';
  pokeTypes.className = 'poke-types'; 

  resistTo.forEach((element) => {
    const span = document.createElement('span');

    span.classList.add(`${element.name}`);
    span.classList.add('type');
    span.innerHTML = `${toTitleCase(element.name)}`

    pokeTypes.appendChild(span);
  })
  
  pokeContent.appendChild(pokeTypes);
  
  getPokeSection.appendChild(pokeContent);
}

async function appendWeakAgainst(type) {
  const pokeType = await getDamageRelations(type);
  const resistTo = pokeType.double_damage_from;

  const getPokeSection = document.querySelector('.disadvantage');
  getPokeSection.innerHTML = '';

  const pokeContent = document.createElement('section');
  
  const pokeTypes = document.createElement('div');

  pokeContent.className = 'poke-section';
  pokeTypes.className = 'poke-types'; 

  resistTo.forEach((element) => {
    const span = document.createElement('span');

    span.classList.add(`${element.name}`);
    span.classList.add('type');
    span.innerHTML = `${toTitleCase(element.name)}`

    pokeTypes.appendChild(span);
  })
  
  pokeContent.appendChild(pokeTypes);
  
  getPokeSection.appendChild(pokeContent);
}