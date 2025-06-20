import { PokemonData } from '@customTypes/pokemon';
import { Pokemon } from '@utils/pokemon';

interface Fetcher {
  fetch(input: any): Promise<Pokemon | Pokemon[]>;
}

type FetcherProvider = (input: string) => any;

class SinglePokemonFetch implements Fetcher {
  private fetcher: FetcherProvider;

  constructor(fetcher: FetcherProvider) {
    this.fetcher = fetcher;
  }

  async fetch(name: string): Promise<Pokemon> {
    /**
     * @param {string} name - the pokemon's name
     * @returns {Pokemon} - A pokemon object
     */

    const data = await this.fetcher(name);
    const parsedData = this.apiParser(data);
    return new Pokemon(parsedData);
  }

  private apiParser(data: any): PokemonData {
    /**
     * @param {any} data - the unparsed incoming response data (from PokeAPI V2)
     * @returns {PokemonData} - the nicely parsed data
     */

    return {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
    };
  }
}
