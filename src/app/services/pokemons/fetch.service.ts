import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PokemonData, PokemonMinimalData } from '@customTypes/pokemon';
import { environment } from '@env/environment';
import { DEFAULT_POKEMONS_PER_PAGE } from '@utils/constants';
import { Pokemon, PokemonCard } from '@utils/pokemon';
import { forkJoin, map, Observable } from 'rxjs';

interface Fetcher {
  fetch(input: string | number): Observable<Pokemon | PokemonCard[]>;
}

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

export function apiParserAll(data: any): PokemonData {
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

export function apiParserMinimal(data: any): PokemonMinimalData {
  /**
   * @param {any} data - the unparsed incoming response data (from PokeAPI V2)
   * @returns {PokemonData} - the nicely parsed data for cards
   */

  if (!data) {
    throw new TypeError('Invalid data!');
  }

  const id = data?.id || 0;
  const name = data?.name || 'none';
  const image = data?.sprites?.front_default || 'none';

  return {
    id,
    name,
    image,
  };
}

@Injectable({ providedIn: 'root' })
export class SinglePokemonFetch implements Fetcher {
  constructor(private http: HttpClient) {}

  fetch(id: number): Observable<Pokemon> {
    /**
     * @param {number} id - the pokemon's id
     * @returns {Observable<Pokemon>} - A pokemon object
     */

    return this.http
      .get(`${environment.baseApiUrl}/${id}`)
      .pipe(map((data: any) => new Pokemon(apiParserAll(data))));
  }
}

@Injectable({ providedIn: 'root' })
export class MultiplePokemonFetch implements Fetcher {
  private limit: number = DEFAULT_POKEMONS_PER_PAGE;

  constructor(private http: HttpClient) {}

  fetch(offset: number): Observable<PokemonCard[]> {
    /**
     * @param {number} offset - the starting pokemon's id
     * @returns {Observable<PokemonCard[]>} - A list of pokemons
     */

    const ids = [...Array(this.limit).keys()].map((i) => i + offset + 1);
    const requests = ids.map((id: number) =>
      this.http.get(`${environment.baseApiUrl}/${id}`)
    );

    const sortPokemons = (a: PokemonCard, b: PokemonCard) => a.id - b.id;

    return forkJoin(requests).pipe(
      map((results: any[]) =>
        results
          .map((result: any) => new PokemonCard(apiParserMinimal(result)))
          .sort(sortPokemons)
      )
    );
  }
}
