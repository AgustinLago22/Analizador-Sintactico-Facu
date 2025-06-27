import {
  ASTNode,
  ProgramaNode,
  DeclaracionVariableNode,
  AsignacionNode,
  ImpresionNode,
  CondicionalNode,
  BucleNode,
  FuncionNode,
  RetornoNode,
  ExpresionNode,
  LlamadaFuncionNode,
} from "../types/ast";

type Env = Map<string, any>;

export class Interpreter {
  private globalEnv: Env = new Map();
  private functions: Map<string, FuncionNode> = new Map();
  public  output: string[] = [];

  // Ejecuta el programa raíz
  run(program: ASTNode[]): any {
  for (const stmt of program) {
    const res = this.execute(stmt);
    if (res?.returnValue !== undefined) {
      return res.returnValue;
    }
  }
}

  // Ejecuta un nodo genérico
  execute(node: ASTNode): any {
  if (node.tipo === "Programa") {
    return this.run((node as ProgramaNode).declaraciones);
  }

    // DeclaracionNode cubre varios tipos
    if (
      node.tipo === "Asignacion" ||
      node.tipo === "Impresion" ||
      node.tipo === "Condicional" ||
      node.tipo === "Bucle" ||
      node.tipo === "DeclaracionVariable" ||
      node.tipo === "Funcion" ||
      node.tipo === "Retorno" ||
      node.tipo === "LlamadaFuncion"
    ) {
      switch (node.tipo) {
        case "DeclaracionVariable":
          return this.declareVariable(node as DeclaracionVariableNode);
        case "Asignacion":
          return this.assignVariable(node as AsignacionNode);
        case "Impresion":
          return this.print(node as ImpresionNode);
        case "Condicional":
          return this.conditional(node as CondicionalNode);
        case "Bucle":
          return this.loop(node as BucleNode);
        case "Funcion":
          return this.declareFunction(node as FuncionNode);
        case "Retorno":
          return { returnValue: this.evaluate((node as RetornoNode).valor) };
        case "LlamadaFuncion":
        return this.callFunction(node as LlamadaFuncionNode);
      }
    }

    throw new Error(`Nodo no soportado en ejecución: ${node.tipo}`);
  }

  declareVariable(node: DeclaracionVariableNode) {
    const val = node.valor ? this.evaluate(node.valor) : undefined;
    this.globalEnv.set(node.nombre, val);
  }

  assignVariable(node: AsignacionNode) {
    if (!this.globalEnv.has(node.identificador)) {
      throw new Error(`Variable no declarada: ${node.identificador}`);
    }
    const val = this.evaluate(node.expresion);
    this.globalEnv.set(node.identificador, val);
  }

  print(node: ImpresionNode) {
     const val = this.evaluate(node.expresion);
    this.output.push(String(val)); // Guardar la impresión en el arreglo
    return val;
  }

  conditional(node: CondicionalNode) {
    if (this.evaluate(node.condicion)) {
      for (const stmt of node.entonces) {
        const res = this.execute(stmt);
        if (res?.returnValue !== undefined) return res; // retorno temprano
      }
    } else if (node.sino) {
      for (const stmt of node.sino) {
        const res = this.execute(stmt);
        if (res?.returnValue !== undefined) return res; // retorno temprano
      }
    }
  }

  loop(node: BucleNode) {
    while (this.evaluate(node.condicion)) {
      for (const stmt of node.cuerpo) {
        const res = this.execute(stmt);
        if (res?.returnValue !== undefined) return res; // retorno temprano
      }
    }
  }

  declareFunction(node: FuncionNode) {
    this.functions.set(node.nombre, node);
  }

  isLlamadaFuncionNode(node: ExpresionNode): node is LlamadaFuncionNode {
    return node.tipo === "LlamadaFuncion";
  }

  evaluate(node: ExpresionNode): any {
    if (node.tipo === "Literal") {
      return node.valor;
    } else if (node.tipo === "Identificador") {
      if (!this.globalEnv.has(node.valor as string)) {
        throw new Error(`Variable no declarada: ${node.valor}`);
      }
      return this.globalEnv.get(node.valor as string);
    } else if (node.tipo === "Binaria") {
      return this.evalBinary(node);
    } else if (this.isLlamadaFuncionNode(node)) {
      return this.callFunction(node);
    }
    throw new Error(`Tipo de expresión no soportado: ${node.tipo}`);
  }

  evalBinary(node: ExpresionNode): any {
    if (!node.operador || !node.izquierdo || !node.derecho)
      throw new Error("Nodo binario incompleto");

    const left = this.evaluate(node.izquierdo);
    const right = this.evaluate(node.derecho);

    switch (node.operador) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "==":
        return left === right;
      case "!=":
        return left !== right;
      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;
      case "&&":
        return left && right;
      case "||":
        return left || right;
      default:
        throw new Error(`Operador no soportado: ${node.operador}`);
    }
  }

  callFunction(node: LlamadaFuncionNode): any {
    const func = this.functions.get(node.nombre);
    if (!func) throw new Error(`Función no declarada: ${node.nombre}`);

    const args = node.argumentos?.map((arg) => this.evaluate(arg)) || [];

    const localEnv: Env = new Map();

    // Mapear parámetros a argumentos
    func.parametros.forEach((param, i) => {
      localEnv.set(param, args[i]);
    });

    // Guardar entorno global para restaurar después
    const oldEnv = this.globalEnv;
    this.globalEnv = localEnv;

    let returnValue: any;

    try {
      for (const stmt of func.cuerpo) {
        const res = this.execute(stmt);
        if (res?.returnValue !== undefined) {
          returnValue = res.returnValue;
          break;
        }
      }
    } finally {
      this.globalEnv = oldEnv; // Restaurar entorno global
    }

    return returnValue;
  }
}
