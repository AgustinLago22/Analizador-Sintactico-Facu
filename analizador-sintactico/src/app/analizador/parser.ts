import { Token, TokenType } from "../types/Token.type";
import {
  ASTNode,
  ImpresionNode,
  DeclaracionVariableNode,
  ExpresionNode,
  CondicionalNode,
  BucleNode,
  FuncionNode,
  RetornoNode,
  AsignacionNode,
} from "../types/ast";

class Parser {
  private tokens: Token[];
  private position = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private currentToken(): Token | null {
    return this.position < this.tokens.length
      ? this.tokens[this.position]
      : null;
  }

  private nextToken(): Token | null {
    return this.position + 1 < this.tokens.length
      ? this.tokens[this.position + 1]
      : null;
  }

  private consume(expectedType: TokenType): Token {
    const token = this.currentToken();
    if (!token || token.tipo !== expectedType) {
      throw new Error(
        `Error de sintaxis: se esperaba ${expectedType}, pero se encontró ${token?.tipo} (${token?.valor})`
      );
    }
    this.position++;
    return token;
  }

  private match(valor: string): boolean {
    const token = this.currentToken();
    return token?.valor === valor;
  }

  private advance(): Token {
    return this.tokens[this.position++];
  }

  parseProgram(): ASTNode[] {
    return this.parseStatements();
  }

  parseStatements(): ASTNode[] {
    const statements: ASTNode[] = [];
    while (this.currentToken()?.tipo !== "EOF") {
      statements.push(this.parseStatement());
    }
    return statements;
  }

  parseStatement(): ASTNode {
    const token = this.currentToken();
    if (!token) throw new Error("No hay más tokens para procesar");

    console.log("Parsing statement starting with:", token);

    switch (token.valor) {
      case "nee":
        return this.parseImpresion();
      case "ramo":
        return this.parseCondicional();
      case "guara":
        return this.parseBucle();
      case "hembiapo":
        return this.parseFuncion();
      case "jujey":
        return this.parseRetorno();
      default:
        if (["entero", "decimal", "booleano", "string"].includes(token.valor)) {
          return this.parseDeclaracionVariable();
        }
        if (token.tipo === "IDENTIFICADOR") {
          return this.parseAsignacion();
        }
    }

    throw new Error(`Sentencia no válida comenzando con: ${token.valor}`);
  }

  parseImpresion(): ImpresionNode {
    this.consume("PALABRA_CLAVE"); // nee
    const expr = this.parseExpresion();
    return {
      tipo: "Impresion",
      expresion: expr,
    };
  }

  parseDeclaracionVariable(): DeclaracionVariableNode {
    const tipoToken = this.consume("PALABRA_CLAVE"); // Consume el tipo (entero, decimal, etc.)
    const nombreToken = this.consume("IDENTIFICADOR"); // Consume el nombre de la variable
    let valor: ExpresionNode | undefined = undefined;

    if (this.match("hae")) {
      this.advance(); // consumir hae
      valor = this.parseExpresion(); // Parsear la expresión de inicialización
    }

    return {
      tipo: "DeclaracionVariable",
      tipoDato: tipoToken.valor as "entero" | "decimal" | "booleano" | "string",
      nombre: nombreToken.valor,
      valor,
    };
  }

  parseAsignacion(): AsignacionNode {
    const identificador = this.consume("IDENTIFICADOR"); // Consume el identificador
    this.consume("PALABRA_CLAVE"); // Consume 'hae'
    const expresion = this.parseExpresion(); // Consume la expresión a asignar

    return {
      tipo: "Asignacion",
      identificador: identificador.valor,
      expresion: expresion,
    };
  }

  parseCondicional(): CondicionalNode {
    this.consume("PALABRA_CLAVE"); // ramo
    this.consume("PAREN_IZQ");
    const condicion = this.parseExpresion();
    this.consume("PAREN_DER");

    const entonces = this.parseBloque();
    let sino: ASTNode[] | undefined;

    if (this.match("ambue")) {
      this.advance();
      sino = this.parseBloque();
    }

    return {
      tipo: "Condicional",
      condicion,
      entonces,
      sino,
    };
  }

  parseBucle(): BucleNode {
    this.consume("PALABRA_CLAVE"); // guara
    this.consume("PAREN_IZQ");
    const condicion = this.parseExpresion();
    this.consume("PAREN_DER");

    const cuerpo = this.parseBloque();

    return {
      tipo: "Bucle",
      condicion,
      cuerpo,
    };
  }

  parseFuncion(): FuncionNode {
    this.consume("PALABRA_CLAVE"); // hembiapo
    const nombre = this.consume("IDENTIFICADOR");
    this.consume("PAREN_IZQ");

    const parametros: string[] = [];
    while (!this.match(")")) {
      if (this.currentToken()?.tipo !== "IDENTIFICADOR") {
        if (this.match(")")) break;
        throw new Error(
          "Se esperaba un IDENTIFICADOR en la lista de parámetros."
        );
      }
      parametros.push(this.consume("IDENTIFICADOR").valor);
      if (this.match(",")) {
        this.advance();
      }
    }
    this.consume("PAREN_DER");

    const cuerpo = this.parseBloque();

    return {
      tipo: "Funcion",
      nombre: nombre.valor,
      parametros,
      cuerpo,
    };
  }

  parseRetorno(): RetornoNode {
    this.consume("PALABRA_CLAVE"); // jujey
    const valor = this.parseExpresion();

    return {
      tipo: "Retorno",
      valor,
    };
  }

  parseBloque(): ASTNode[] {
    this.consume("LLAVE_IZQ");
    const statements: ASTNode[] = [];

    while (!this.match("}") && this.currentToken()?.tipo !== "EOF") {
      statements.push(this.parseStatement());
    }

    this.consume("LLAVE_DER");
    return statements;
  }

  parseExpresion(): ExpresionNode {
    let expr = this.parseTermino();

    while (
      this.match("+") ||
      this.match("-") ||
      this.match("*") ||
      this.match("/") ||
      this.match("==") ||
      this.match("<") ||
      this.match("<=") ||
      this.match(">") ||
      this.match(">=") ||
      this.match("!=") ||
      this.match("&&") ||
      this.match("||")
    ) {
      const operador = this.advance().valor;
      const derecho = this.parseTermino();
      expr = {
        tipo: "Binaria",
        operador,
        izquierdo: expr,
        derecho,
      };
    }

    return expr;
  }

  parseTermino(): ExpresionNode {
    const token = this.currentToken();
    if (!token) throw new Error("Expresión inesperadamente vacía");

    if (
  token.tipo === "ENTERO" ||
  token.tipo === "DECIMAL" ||
  token.tipo === "STRING" ||
  token.tipo === "BOOLEANO"
) {
  this.advance();
  let valor: any;
  if (token.tipo === "ENTERO") {
    valor = Number(token.valor); // convertir a número entero
  } else if (token.tipo === "DECIMAL") {
    valor = Number(token.valor); // convertir a número decimal
  } else if (token.tipo === "BOOLEANO") {
    valor = token.valor === "true"; // convertir a booleano
  } else {
    valor = token.valor; // string queda tal cual
  }
  return {
    tipo: "Literal",
    valor,
  };
}


    if (token.tipo === "IDENTIFICADOR") {
      const nombre = token.valor;
      this.advance();

      if (this.match("(")) {
        this.advance(); // consumir (
        const argumentos: ExpresionNode[] = [];

        while (!this.match(")")) {
          if (this.currentToken()?.tipo === "EOF") {
            throw new Error(
              "Se esperaba una expresión en la lista de argumentos, pero se encontró EOF."
            );
          }
          argumentos.push(this.parseExpresion());
          if (this.match(",")) {
            this.advance();
          }
        }

        this.advance(); // consumir )
        return {
          tipo: "LlamadaFuncion",
          nombre,
          argumentos,
        };
      }

      return {
        tipo: "Identificador",
        valor: nombre,
      };
    }

    if (token.tipo === "PAREN_IZQ") {
      this.advance();
      const expr = this.parseExpresion();
      this.consume("PAREN_DER");
      return expr;
    }

    throw new Error(`Expresión no válida: ${token.valor}`);
  }
}

export default Parser;
