export type ASTNode =
  | ProgramaNode
  | DeclaracionNode
  | ExpresionNode
  | ImpresionNode
  | CondicionalNode
  | BucleNode
  | FuncionNode
  | RetornoNode
  | LlamadaFuncionNode
  | DeclaracionVariableNode
  | AsignacionNode;

export interface ProgramaNode {
  tipo: "Programa";
  declaraciones: ASTNode[];
}

export interface DeclaracionNode {
  tipo:
    | "Asignacion"
    | "Impresion"
    | "Condicional"
    | "Bucle"
    | "DeclaracionVariable"
    | "Funcion"
    | "Retorno";
  identificador?: string;
  expresion?: ExpresionNode;
  bloque?: ASTNode[];
  parametros?: string[];
  sino?: ASTNode[];
}

export interface ImpresionNode {
  tipo: "Impresion";
  expresion: ExpresionNode;
}

export interface CondicionalNode {
  tipo: "Condicional";
  condicion: ExpresionNode;
  entonces: ASTNode[];
  sino?: ASTNode[];
}

export interface BucleNode {
  tipo: "Bucle";
  condicion: ExpresionNode;
  cuerpo: ASTNode[];
}

export interface FuncionNode {
  tipo: "Funcion";
  nombre: string;
  parametros: string[];
  cuerpo: ASTNode[];
}

export interface LlamadaFuncionNode {
  tipo: "LlamadaFuncion";
  nombre: string;
  argumentos: ExpresionNode[];
}

export interface RetornoNode {
  tipo: "Retorno";
  valor: ExpresionNode;
}

export interface DeclaracionVariableNode {
  tipo: "DeclaracionVariable";
  tipoDato: "entero" | "decimal" | "booleano" | "string";
  nombre: string;
  valor?: ExpresionNode;
}

export interface AsignacionNode {
  tipo: "Asignacion";
  identificador: string;
  expresion: ExpresionNode;
}

export interface ExpresionNode {
  tipo: "Literal" | "Identificador" | "Binaria" | "LlamadaFuncion";
  valor?: unknown;
  operador?: string;
  izquierdo?: ExpresionNode;
  derecho?: ExpresionNode;
  nombre?: string;
  argumentos?: ExpresionNode[];
}
