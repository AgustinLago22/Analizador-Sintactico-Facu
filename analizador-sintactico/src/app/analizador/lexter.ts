export type TokenType =
  | "IDENTIFICADOR"
  | "ENTERO"
  | "DECIMAL"
  | "BOOLEANO"
  | "STRING"
  | "OPERADOR"
  | "PAREN_IZQ"
  | "PAREN_DER"
  | "LLAVE_IZQ"
  | "LLAVE_DER"
  | "COMA"
  | "DOSPUNTOS"
  | "PALABRA_CLAVE"
  | "EOF";

export interface Token {
  tipo: TokenType;
  valor: string;
  posicion: number;
}

const palabrasClave = new Set([
  "hae",
  "nee",
  "ramo",
  "ambue",
  "guara",
  "hembiapo",
  "jujey",
  "entero",
  "decimal",
  "booleano",
  "string",
  "true",
  "false",
]);

const operadores = new Set([
  "+",
  "-",
  "*",
  "/",
  "==",
  "<",
  "<=",
  ">",
  ">=",
  "!=",
  "&&",
  "||",
]);

export function lexer(codigo: string): Token[] {
  const tokens: Token[] = [];
  // Nuevo regex para separar tokens: identificadores, números, strings, operadores y símbolos
  const regex =
    /([a-zA-Z_][a-zA-Z0-9_]*)|(\d+\.\d+)|(\d+)|("(?:[^"\\]|\\.)*")|([+\-*\/==<>]|<=|>=|!=|&&|\|\|)|([{}()\,:])|(\s+)/g;
  let match;
  let posicion = 0;

  while ((match = regex.exec(codigo)) !== null) {
    const tokenValor = match[0];
    // Ignorar espacios en blanco
    if (tokenValor.match(/^\s+$/)) {
      posicion += tokenValor.length;
      continue;
    }

    if (palabrasClave.has(tokenValor)) {
      tokens.push({ tipo: "PALABRA_CLAVE", valor: tokenValor, posicion });
    } else if (operadores.has(tokenValor)) {
      tokens.push({ tipo: "OPERADOR", valor: tokenValor, posicion });
    } else if (match[2]) {
      // Grupo para decimales
      tokens.push({ tipo: "DECIMAL", valor: tokenValor, posicion });
    } else if (match[3]) {
      // Grupo para enteros
      tokens.push({ tipo: "ENTERO", valor: tokenValor, posicion });
    } else if (match[4]) {
      // Grupo para strings
      // Eliminar las comillas
      const valorString = tokenValor.substring(1, tokenValor.length - 1);
      tokens.push({ tipo: "STRING", valor: valorString, posicion });
    } else if (match[1]) {
      // Grupo para identificadores
      tokens.push({ tipo: "IDENTIFICADOR", valor: tokenValor, posicion });
    } else if (tokenValor === "(") {
      tokens.push({ tipo: "PAREN_IZQ", valor: tokenValor, posicion });
    } else if (tokenValor === ")") {
      tokens.push({ tipo: "PAREN_DER", valor: tokenValor, posicion });
    } else if (tokenValor === "{") {
      tokens.push({ tipo: "LLAVE_IZQ", valor: tokenValor, posicion });
    } else if (tokenValor === "}") {
      tokens.push({ tipo: "LLAVE_DER", valor: tokenValor, posicion });
    } else if (tokenValor === ",") {
      tokens.push({ tipo: "COMA", valor: tokenValor, posicion });
    } else if (tokenValor === ":") {
      tokens.push({ tipo: "DOSPUNTOS", valor: tokenValor, posicion });
    } else {
      throw new Error(`Token no reconocido: ${tokenValor}`);
    }
    posicion += tokenValor.length;
  }

  tokens.push({ tipo: "EOF", valor: "", posicion });
  return tokens;
}
