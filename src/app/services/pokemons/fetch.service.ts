import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PokemonData } from '@customTypes/pokemon';
import { environment } from '@env/environment';
import { DEFAULT_POKEMONS_PER_PAGE } from '@utils/constants';
import { Pokemon } from '@utils/pokemon';
import { map, Observable } from 'rxjs';

interface Fetcher {
  fetch(input: any): Promise<Pokemon | Pokemon[]> | Observable<Pokemon>;
}

type FetcherMultipleProvider = (
  offset: number,
  limit: number
) => Promise<any[]>;

type FormIncomingData = {
  name: string;
  image: string;
};

export function apiParser(data: any): PokemonData {
  /**
   * @param {any} data - the unparsed incoming response data (from PokeAPI V2)
   * @returns {PokemonData} - the nicely parsed data
   */

  if (!data) {
    throw new TypeError('Invalid data!');
  }

  const pokemonId = data?.id || 0;
  const pokemonName = data?.name || 'none';

  return {
    id: pokemonId,
    name: pokemonName,
    height: (data?.height || 0) * 10, // decimeters to centimeters
    weight: (data?.weight || 0) / 10, // hectograms to kilograms
    image: data?.sprites?.front_default || 'none',
    types: data?.types?.map((type: any) => type.type.name) || [],
    moves: data?.moves?.map(({ move }: any) => move.name) || [],
    abilities: data?.abilities?.map(({ ability }: any) => ability.name) || [],
    forms: data?.forms?.map((form: FormIncomingData) => {
      const formName = form.name.replace(`${pokemonName}-`, '');
      const imageFile = ['normal', pokemonName].includes(formName)
        ? `${pokemonId}.png`
        : `${pokemonId}-${formName}.png`;

      return {
        name: formName,
        image: `${environment.baseImageUrl}/${imageFile}`,
      };
    }),
  };
}

@Injectable({ providedIn: 'root' })
export class SinglePokemonFetch implements Fetcher {
  constructor(private http: HttpClient) {}

  fetch(id: number): Observable<Pokemon> {
    /**
     * @param {number} id - the pokemon's id
     * @returns {Pokemon} - A pokemon object
     */

    return this.http
      .get<any>(`${environment.baseApiUrl}/${id}`)
      .pipe(map((data: any) => new Pokemon(apiParser(data))));
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
