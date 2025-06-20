/*
    Once its type may change if we use uuid or something like
    that, It's better to store the ID as a separated type.

    The same applies for image, and some other information.
*/
export type PokemonId = number;
export type PokemonImage = string;
export type PokemonType = string;
export type PokemonMove = string;
export type PokemonAbility = string;
export type PokemonForm = {
  name: string;
  image: string;
};

export type PokemonData = {
  id: PokemonId;
  name: string;
  height: number;
  weight: number;
  image: PokemonImage;
  types: PokemonType[];
  moves: PokemonMove[];
  abilities: PokemonAbility[];
  forms: PokemonForm[];
};

export type PokemonMinimalData = {
  id: PokemonId;
  name: string;
  image: PokemonImage;
};
