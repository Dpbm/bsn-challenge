import { apiParserAll, apiParserMinimal } from './fetch.service';
import { environment } from '@env/environment';

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
  forms: [
    {
      name: 'voltorb',
      url: 'https://pokeapi.co/api/v2/pokemon-form/100/',
    },
  ],
  base_experience: 101,
  id: 100,
  is_default: true,
  name: 'voltorb',
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
  height: 100,
  moves: [
    {
      move: {
        name: 'headbutt',
        url: 'https://pokeapi.co/api/v2/move/29/',
      },
      version_group_details: [
        {
          level_learned_at: 0,
          move_learn_method: {
            name: 'machine',
            url: 'https://pokeapi.co/api/v2/move-learn-method/4/',
          },
          order: null,
          version_group: {
            name: 'gold-silver',
            url: 'https://pokeapi.co/api/v2/version-group/3/',
          },
        },
        {
          level_learned_at: 0,
          move_learn_method: {
            name: 'machine',
            url: 'https://pokeapi.co/api/v2/move-learn-method/4/',
          },
          order: null,
          version_group: {
            name: 'crystal',
            url: 'https://pokeapi.co/api/v2/version-group/4/',
          },
        },
        {
          level_learned_at: 0,
          move_learn_method: {
            name: 'tutor',
            url: 'https://pokeapi.co/api/v2/move-learn-method/3/',
          },
          order: null,
          version_group: {
            name: 'heartgold-soulsilver',
            url: 'https://pokeapi.co/api/v2/version-group/10/',
          },
        },
        {
          level_learned_at: 0,
          move_learn_method: {
            name: 'machine',
            url: 'https://pokeapi.co/api/v2/move-learn-method/4/',
          },
          order: null,
          version_group: {
            name: 'lets-go-pikachu-lets-go-eevee',
            url: 'https://pokeapi.co/api/v2/version-group/19/',
          },
        },
      ],
    },
  ],
};

describe('Test Pokemons fetched data parsing (full)', () => {
  it('Should fail parse', () => {
    expect(() => apiParserAll(null)).toThrowError(TypeError);
  });

  it('Should return default data', () => {
    const parsed = apiParserAll({});

    expect(parsed.id).toEqual(0);
    expect(parsed.name).toEqual('none');
    expect(parsed.image).toEqual('none');
    expect(parsed.weight).toEqual(0);
    expect(parsed.height).toEqual(0);
    expect(parsed.types).toEqual([]);
    expect(parsed.moves).toEqual([]);
    expect(parsed.abilities).toEqual([]);
    expect(parsed.forms).toEqual([]);
  });

  it('should return valid parsed data', () => {
    const parsed = apiParserAll(validPokemon);
    expect(parsed.id).toEqual(validPokemon.id);
    expect(parsed.name).toEqual(validPokemon.name);
    expect(parsed.image).toEqual(validPokemon.sprites.front_default);
    expect(parsed.weight).toEqual(validPokemon.weight / 10);
    expect(parsed.height).toEqual(validPokemon.height * 10);
    expect(parsed.types).toEqual(['normal']);
    expect(parsed.moves).toEqual(['headbutt']);
    expect(parsed.abilities).toEqual(['limber', 'imposter']);
    expect(parsed.forms).toEqual([
      { name: 'voltorb', image: `${environment.baseImageUrl}/100.png` },
    ]);
  });
});

describe('Test Pokemons fetched data parsing (minimal)', () => {
  it('Should fail parse', () => {
    expect(() => apiParserMinimal(null)).toThrowError(TypeError);
  });

  it('Should return default data', () => {
    const parsed = apiParserMinimal({});

    expect(parsed.id).toEqual(0);
    expect(parsed.name).toEqual('none');
    expect(parsed.image).toEqual('none');
  });

  it('should return valid parsed data', () => {
    const parsed = apiParserMinimal(validPokemon);
    expect(parsed.id).toEqual(validPokemon.id);
    expect(parsed.name).toEqual(validPokemon.name);
    expect(parsed.image).toEqual(validPokemon.sprites.front_default);
  });
});
