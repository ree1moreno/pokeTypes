const getRandomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min));
}

const fetchPokemon = (name) => {
    return fetch(`https://pokeapi.co/api/v2/type/${name}/`)
    .then((response) => response.json())
    .then((data) => data.pokemon)
}
const getPokemonByType = async (type) => {
    const pokemonByType = fetchPokemon(type)
    .then((data) => data.map((e) => {
        return e.pokemon.name;
    }));

    return pokemonByType;
}

async function getPokemonByTypes (type1, type2) {
  const firstType = await getPokemonByType(type1);
  const secondType = await getPokemonByType(type2);
  return firstType.filter((pokeA) => {
    return secondType.find((pokeB) => pokeA === pokeB);
  })
}
// console.log(await getPokemonByTypes('ground', 'fire'));

async function getPokemonByName(pokeName) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}/`)
    .then((response) => response.json())
    .then((data) => {
      const { name, types, sprites} = data;
      return { name, types, sprites }
    })
}
console.log((await getPokemonByName('landorus-incarnate')));

function appendPokemon (pokemon) {
  const pokeContent = document.createElement('section');
  const pokeName = document.createElement('h2');
  const pokeImage = document.createElement('img');
  const pokeTypes = document.createElement('div');

  pokeImage.src = `${(pokemon.sprites.other.dream_world.front_default) ? 
    pokemon.sprites.other.dream_world.front_default : 
    pokemon.sprites.other['official-artwork'].front_default}`;
  pokeImage.className = 'poke-sprite';
  pokeName.innerText = `Você escolheu o ${pokemon.name}! `;
  pokeName.className = 'poke-name';
  pokeContent.className = 'poke-section';
  pokeTypes.className = 'poke-types'; 

  pokemon.types.forEach((element) => {
    const span = document.createElement('span');
    span.classList.add(`${element.type.name}`);
    span.classList.add('type');
    span.innerHTML = `${element.type.name}`
    pokeTypes.appendChild(span);
  })
  
  pokeContent.appendChild(pokeName);
  pokeContent.appendChild(pokeImage);
  pokeContent.appendChild(pokeTypes);

  const getPokeSection = document.querySelector('.chosen-pokemon')
  
  getPokeSection.appendChild(pokeContent);
}

const getButton = document.querySelector('#find-pokemon');

getButton.addEventListener('click', async () => {
  appendPokemon(await getPokemonByName('landorus-incarnate'));
})
