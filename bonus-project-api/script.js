import fetch from "node-fetch";

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

const fire = await getPokemonByType('ground');
const water = await getPokemonByType('flying');

const fireWater = fire.filter((e) => {
    return water.find((j) => j === e);
})

const getRandomPokemonByList = (arr) => {
    const random = getRandomNumber(0, arr.length);
    return console.log(arr[random]);
}

console.log(fireWater);
getRandomPokemonByList(fireWater);
