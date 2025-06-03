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

const operadores = new Set(["+", "-", "*", "/", "==", "<", "<=", "&&", "||"]);

export function lexer(codigo: string): Token[] {
  const tokens: Token[] = [];
  const palabras = codigo.match(/\w+|\S/g) || [];
  let posicion = 0;

  for (const palabra of palabras) {
    if (palabrasClave.has(palabra)) {
      tokens.push({ tipo: "PALABRA_CLAVE", valor: palabra, posicion });
    } else if (/^\d+$/.test(palabra)) {
      tokens.push({ tipo: "ENTERO", valor: palabra, posicion });
    } else if (/^\d+\.\d+$/.test(palabra)) {
      tokens.push({ tipo: "DECIMAL", valor: palabra, posicion });
    } else if (/^"(.*?)"$/.test(palabra)) {
      tokens.push({ tipo: "STRING", valor: palabra, posicion });
    } else if (palabra === "(") {
      tokens.push({ tipo: "PAREN_IZQ", valor: palabra, posicion });
    } else if (palabra === ")") {
      tokens.push({ tipo: "PAREN_DER", valor: palabra, posicion });
    } else if (palabra === "{") {
      tokens.push({ tipo: "LLAVE_IZQ", valor: palabra, posicion });
    } else if (palabra === "}") {
      tokens.push({ tipo: "LLAVE_DER", valor: palabra, posicion });
    } else if (palabra === ",") {
      tokens.push({ tipo: "COMA", valor: palabra, posicion });
    } else if (palabra === ":") {
      tokens.push({ tipo: "DOSPUNTOS", valor: palabra, posicion });
    } else if (operadores.has(palabra)) {
      tokens.push({ tipo: "OPERADOR", valor: palabra, posicion });
    } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(palabra)) {
      tokens.push({ tipo: "IDENTIFICADOR", valor: palabra, posicion });
    } else {
      throw new Error(`Token no reconocido: ${palabra}`);
    }
    posicion++;
  }

  tokens.push({ tipo: "EOF", valor: "", posicion });
  return tokens;
}
