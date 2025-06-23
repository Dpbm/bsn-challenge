import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const targetFolder = path.join(".", "src", "environments");

if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder);
}

const baseApiUrl = "https://pokeapi.co/api/v2/pokemon";
const baseImageUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'";
const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseKey = process.env["SUPABASE_KEY"];

const devEnv = `export const environment = {
  production: false,
  baseApiUrl: '${baseApiUrl}',
  baseImageUrl: '${baseImageUrl}',
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}',
};
`;

const prodEnv = `export const environment = {
  production: true,
  baseApiUrl: '${baseApiUrl}',
  baseImageUrl: '${baseImageUrl}',
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}',
};
`;

const devFile = path.join(targetFolder, "environment.ts");
const prodFile = path.join(targetFolder, "environment.prod.ts");

fs.writeFileSync(devFile, devEnv);
fs.writeFileSync(prodFile, prodEnv);
