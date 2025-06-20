import { PokemonData } from '@customTypes/pokemon';
import { DEFAULT_POKEMONS_PER_PAGE } from '@utils/constants';
import { Pokemon } from '@utils/pokemon';

interface Fetcher {
  fetch(input: any): Promise<Pokemon | Pokemon[]>;
}

type FetcherSingleProvider = (input: string | number) => Promise<any>;
type FetcherMultipleProvider = (
  offset: number,
  limit: number
) => Promise<any[]>;

export function apiParser(data: any): PokemonData {
  /**
   * @param {any} data - the unparsed incoming response data (from PokeAPI V2)
   * @returns {PokemonData} - the nicely parsed data
   */

  if (!data) {
    throw new TypeError('Invalid data!');
  }

  return {
    id: data?.id || 0,
    name: data?.name || 'none',
    image: data?.sprites?.front_default || 'none',
  };
}

export class SinglePokemonFetch implements Fetcher {
  private fetcher: FetcherSingleProvider;

  constructor(fetcher: FetcherSingleProvider) {
    this.fetcher = fetcher;
  }

  async fetch(name: string): Promise<Pokemon> {
    /**
     * @param {string} name - the pokemon's name
     * @returns {Pokemon} - A pokemon object
     */

    const data = await this.fetcher(name);
    const parsedData = apiParser(data);
    return new Pokemon(parsedData);
  }
}

export class MultiplePokemonFetch implements Fetcher {
  private fetcher: FetcherMultipleProvider;
  private limit: number = DEFAULT_POKEMONS_PER_PAGE;

  constructor(fetcher: FetcherMultipleProvider) {
    this.fetcher = fetcher;
  }

  async fetch(offset: number): Promise<Pokemon[]> {
    /**
     * @param {number} offset - the starting pokemon's id
     * @returns {Pokemon[]} - A list of pokemons
     */

    const data = await this.fetcher(offset, this.limit);
    return data.map(
      (unparsedData: any) => new Pokemon(apiParser(unparsedData))
    );
  }
}
