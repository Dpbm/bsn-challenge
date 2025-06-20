/*
    Once its type may change if we use uuid or something like
    that, It's better to store the ID as a separated type.

    The same applies for image.
*/
export type PokemonId = number;
export type PokemonImage = string;

export type PokemonData = {
  id: PokemonId;
  name: string;
  image: PokemonImage;
};
