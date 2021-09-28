import fetch from "node-fetch";

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

    // const pokemons = pokemonByType.map((e) => {
    //     return e.pokemon.name;
    // })

    return pokemonByType;
}

const fire = await getPokemonByType('bug');
const grass = await getPokemonByType('flying');

const fireGrass = fire.filter((e) => {
    e === grass.filter((j) => j === e);
})

console.log(fireGrass);
