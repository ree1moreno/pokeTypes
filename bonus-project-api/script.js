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
        await appendStrongAgainst(...getID);
        await appendWeakAgainst(...getID);
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
// console.log((await getPokemonByName('landorus-incarnate')));

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
  const pokemon = await getPokemonByName(`${getInput.value.toLowerCase()}`)
  const types = pokemon.types.map(e => e.type).map(e => e.name);
  console.log(types)
  appendPokemon(pokemon, '.chosen-pokemon');
  await appendStrongAgainst(...types);
  await appendWeakAgainst(...types);
})

const getDamageRelations = async (type) => {
  return fetch(`https://pokeapi.co/api/v2/type/${type}/`)
    .then((response) => response.json())
    .then((data) => data.damage_relations)
}

async function appendStrongAgainst(type1, type2) {
  const pokeType = await calculateWeakness(type1, type2);
  const resistTo = pokeType.resistTo;

  const getPokeSection = document.querySelector('.advantage');
  getPokeSection.innerHTML = '';

  const pokeContent = document.createElement('section');
  
  const pokeTypes = document.createElement('div');

  pokeContent.className = 'poke-section';
  pokeTypes.className = 'poke-types'; 

  resistTo.forEach((element) => {
    const span = document.createElement('span');

    span.classList.add(`${element}`);
    span.classList.add('type');
    span.innerHTML = `${toTitleCase(element)}`

    pokeTypes.appendChild(span);
  })
  
  pokeContent.appendChild(pokeTypes);
  
  getPokeSection.appendChild(pokeContent);
}

async function appendWeakAgainst(type1, type2) {
  const pokeType = await calculateWeakness(type1, type2);
  const resistTo = pokeType.weaknessTo;

  const getPokeSection = document.querySelector('.disadvantage');
  getPokeSection.innerHTML = '';

  const pokeContent = document.createElement('section');
  
  const pokeTypes = document.createElement('div');

  pokeContent.className = 'poke-section';
  pokeTypes.className = 'poke-types'; 

  resistTo.forEach((element) => {
    const span = document.createElement('span');

    span.classList.add(`${element}`);
    span.classList.add('type');
    span.innerHTML = `${toTitleCase(element)}`

    pokeTypes.appendChild(span);
  })
  
  pokeContent.appendChild(pokeTypes);
  
  getPokeSection.appendChild(pokeContent);
}

async function calculateWeakness(type1, type2) {
  let weaknessTo = [];
  let resistTo = [];
  
  const getDamageRelationsType1 = await getDamageRelations(type1);
  
  const { half_damage_from: resist1, double_damage_from: weak1 } = getDamageRelationsType1;
  
  if (!type2) {
    resistTo = resist1.map(i => i.name);
    weaknessTo = weak1.map(i => i.name);
    return { resistTo, weaknessTo }
  }

  // Referentes a qndo tem o type2
  const getDamageRelationsType2 = await getDamageRelations(type2);
  const { half_damage_from: resist2, double_damage_from: weak2 } = getDamageRelationsType2;

  const resistType1 = resist1.filter(resist => {
    return !weak2.find(weak => weak.name === resist.name);
  }).map(i => i.name);

  const resistType2 = resist2.filter(resist => {
    return !weak1.find(week => week.name === resist.name);
  }).map(i => i.name);

  const weakType1 = weak1.filter(weak => {
    return !resist2.find(resist => resist.name === weak.name);
  }).map(i => i.name);

  const weakType2 = weak2.filter(weak => {
    return !resist1.find(resist => resist.name === weak.name);
  }).map(i => i.name);


  // Retirando duplicatas
  let arr =  [...resistType1 , ...resistType2];
  arr = arr.reduce((acc, curr) => {
    if (!resistTo.includes(curr)) {
      resistTo.push(curr);
    }
  }, 0);

  let arr1 =  [...weakType1 , ...weakType2];
  arr1 = arr1.reduce((acc, curr) => {
    if (!weaknessTo.includes(curr)) {
      weaknessTo.push(curr);
    }
  }, 0);

  resistTo; // Array contendendo as resistencias
  weaknessTo; // Array contendo as fraquezas

  return { resistTo, weaknessTo }
}

console.log(await calculateWeakness('fire', 'steel'));

// console.log(await getDamageRelations('grass'))
