import { PokemonData, PokemonId, PokemonImage } from '@customTypes/pokemon';

export class Pokemon {
  private data: PokemonData;

  constructor(data: PokemonData) {
    this.data = data;
  }

  get id(): PokemonId {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get image(): PokemonImage {
    return this.data.image;
  }
}
