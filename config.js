import fs from "fs";
import path from "path";

const targetFolder = path.join(".", "src", "environments");

if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder);
}

const devEnv = `export const environment = {
  production: false,
  baseApiUrl: 'https://pokeapi.co/api/v2/pokemon',
  baseImageUrl:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon',
  supabaseUrl: '${process.env["SUPABASE_URL"]}',
  supabaseKey: '${process.env["SUPABASE_KEY"]}',
};
`;

const prodEnv = `export const environment = {
  production: true,
  baseApiUrl: 'https://pokeapi.co/api/v2/pokemon',
  baseImageUrl:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon',
  supabaseUrl: '${process.env["SUPABASE_URL"]}',
  supabaseKey: '${process.env["SUPABASE_KEY"]}',
};
`;

const devFile = path.join(targetFolder, "environment.ts");
const prodFile = path.join(targetFolder, "environment.prod.ts");

fs.writeFileSync(devFile, devEnv);
fs.writeFileSync(prodFile, prodEnv);
