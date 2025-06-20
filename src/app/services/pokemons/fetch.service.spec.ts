import { Pokemon } from '@utils/pokemon';
import {
  apiParser,
  MultiplePokemonFetch,
  SinglePokemonFetch,
} from './fetch.service';

const validPokemon: any = {
  abilities: [
    {
      ability: {
        name: 'limber',
        url: 'https://pokeapi.co/api/v2/ability/7/',
      },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: {
        name: 'imposter',
        url: 'https://pokeapi.co/api/v2/ability/150/',
      },
      is_hidden: true,
      slot: 3,
    },
  ],
  base_experience: 101,
  id: 132,
  is_default: true,
  name: 'ditto',
  order: 214,
  sprites: {
    back_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png',
    back_female: null,
    back_shiny:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/132.png',
    back_shiny_female: null,
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png',
    front_female: null,
    front_shiny:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png',
    front_shiny_female: null,
  },
  stats: [
    {
      base_stat: 48,
      effort: 1,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/',
      },
    },
    {
      base_stat: 48,
      effort: 0,
      stat: {
        name: 'attack',
        url: 'https://pokeapi.co/api/v2/stat/2/',
      },
    },
    {
      base_stat: 48,
      effort: 0,
      stat: {
        name: 'defense',
        url: 'https://pokeapi.co/api/v2/stat/3/',
      },
    },
    {
      base_stat: 48,
      effort: 0,
      stat: {
        name: 'special-attack',
        url: 'https://pokeapi.co/api/v2/stat/4/',
      },
    },
    {
      base_stat: 48,
      effort: 0,
      stat: {
        name: 'special-defense',
        url: 'https://pokeapi.co/api/v2/stat/5/',
      },
    },
    {
      base_stat: 48,
      effort: 0,
      stat: {
        name: 'speed',
        url: 'https://pokeapi.co/api/v2/stat/6/',
      },
    },
  ],
  types: [
    {
      slot: 1,
      type: {
        name: 'normal',
        url: 'https://pokeapi.co/api/v2/type/1/',
      },
    },
  ],
  weight: 40,
};

const fakeSinglePokemonFetcher = (input: string | number): Promise<any> =>
  new Promise((resolve, _) => resolve(validPokemon));

const fakeMultiplePokemonFetcher = (
  offset: number,
  limit: number
): Promise<any[]> =>
  new Promise((resolve, _) => resolve(new Array(10).fill(validPokemon)));

describe('Test Pokemons fetched data parsing', () => {
  it('Should fail parse', () => {
    expect(() => apiParser(null)).toThrowError(TypeError);
  });

  it('Should return default data', () => {
    const parsed = apiParser({});

    expect(parsed.id).toBe(0);
    expect(parsed.name).toBe('none');
    expect(parsed.image).toBe('none');
  });

  it('should return valid parsed data', () => {
    const parsed = apiParser(validPokemon);
    expect(parsed.id).toBe(validPokemon.id);
    expect(parsed.name).toBe(validPokemon.name);
    expect(parsed.image).toBe(validPokemon.sprites.front_default);
  });
});

describe('Test single pokemon fetching', () => {
  it('should return a valid pokemon object', async () => {
    const pokemonFetcher = new SinglePokemonFetch(fakeSinglePokemonFetcher);
    const pokemon = await pokemonFetcher.fetch('none');

    expect(pokemon.id).toBe(validPokemon.id);
    expect(pokemon.name).toBe(validPokemon.name);
    expect(pokemon.image).toBe(validPokemon.sprites.front_default);
  });
});

describe('Test multiple pokemons fetching', () => {
  it('should return a valid pokemon list', async () => {
    const pokemonFetcher = new MultiplePokemonFetch(fakeMultiplePokemonFetcher);
    const pokemons = await pokemonFetcher.fetch(10);

    // once the pokeAPI is in charge of returning the total the correct amount of elements
    // we aren't going to test that

    expect(pokemons.length).toBe(10);

    pokemons.forEach((pokemon: Pokemon) => {
      expect(pokemon.id).toBe(validPokemon.id);
      expect(pokemon.name).toBe(validPokemon.name);
      expect(pokemon.image).toBe(validPokemon.sprites.front_default);
    });
  });
});
