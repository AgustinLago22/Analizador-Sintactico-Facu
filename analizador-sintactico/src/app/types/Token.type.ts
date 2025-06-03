export type TokenType =
  | "IDENTIFICADOR"
  | "ENTERO"
  | "DECIMAL"
  | "BOOLEANO"
  | "STRING"
  | "PAREN_IZQ"
  | "PAREN_DER"
  | "LLAVE_IZQ"
  | "LLAVE_DER"
  | "COMA"
  | "PUNTO_Y_COMA"
  | "DOSPUNTOS"
  | "OPERADOR" // + - * / < <= == ha tera
  | "PALABRA_CLAVE"
  | "EOF";

export interface Token {
  tipo: TokenType;
  valor: string;
  posicion: number;
}
