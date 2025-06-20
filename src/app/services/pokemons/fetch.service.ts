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

type TypeIncomingData = {
  type: {
    name: string;
    url: string;
  };
};

type AbilityIncomingData = {
  ability: {
    name: string;
    url: string;
  };
};

type MoveIncomingData = {
  move: {
    name: string;
    url: string;
  };
};

export function apiParser(data: any): PokemonData {
  /**
   * @param {any} data - the unparsed incoming response data (from PokeAPI V2)
   * @returns {PokemonData} - the nicely parsed data
   */

  if (!data) {
    throw new TypeError('Invalid data!');
  }

  const id = data?.id || 0;
  const name = data?.name || 'none';

  const height = (data?.height || 0) * 10; // decimeters to centimeters
  const weight = (data?.weight || 0) / 10; // hectograms to kilograms

  const image = data?.sprites?.front_default || 'none';

  const types = !data?.types
    ? []
    : data.types.map(({ type }: TypeIncomingData) => type.name);
  const moves = !data?.moves
    ? []
    : data.moves.map(({ move }: MoveIncomingData) => move.name);
  const abilities = !data?.abilities
    ? []
    : data.abilities.map(({ ability }: AbilityIncomingData) => ability.name);

  const parseForm = (form: FormIncomingData) => {
    const formName = form.name.replace(`${name}-`, '');
    const imageFile = ['normal', name].includes(formName)
      ? `${id}.png`
      : `${id}-${formName}.png`;

    return {
      name: formName,
      image: `${environment.baseImageUrl}/${imageFile}`,
    };
  };

  const forms = !data?.forms ? [] : data.forms.map(parseForm);

  return {
    id,
    name,
    height,
    weight,
    image,
    types,
    moves,
    abilities,
    forms,
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
