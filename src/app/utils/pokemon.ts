import {
  PokemonAbility,
  PokemonData,
  PokemonForm,
  PokemonId,
  PokemonImage,
  PokemonMinimalData,
  PokemonMove,
  PokemonType,
} from '@customTypes/pokemon';

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

  get height(): number {
    return this.data.height;
  }

  get weight(): number {
    return this.data.weight;
  }

  get types(): PokemonType[] {
    return this.data.types;
  }

  get moves(): PokemonMove[] {
    return this.data.moves;
  }

  get abilities(): PokemonAbility[] {
    return this.data.abilities;
  }

  get forms(): PokemonForm[] {
    return this.data.forms;
  }
}

export class PokemonCard {
  private data: PokemonMinimalData;

  constructor(data: PokemonMinimalData) {
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
