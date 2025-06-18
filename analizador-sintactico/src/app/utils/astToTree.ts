import { ASTNode } from "../types/ast";

type RawNodeDatum = {
  name: string;
  children?: RawNodeDatum[];
};

function isASTNode(obj: any): obj is ASTNode {
  return obj && typeof obj === "object" && typeof obj.tipo === "string";
}

export function astToRawNodeDatum(node: ASTNode): RawNodeDatum {
  if (!node) return { name: "Nodo inválido" };

  // Tratamiento especial para Literal
  if (node.tipo === "Literal") {
    // En tu definición, valor está en node.valor
    return {
      name: "Literal",
      children: [{ name: String((node as any).valor) }],
    };
  }

  // Tratamiento especial para Identificador
  if (node.tipo === "Identificador") {
    // Puede estar en node.valor o node.nombre según tu AST
    const nombre = (node as any).valor || (node as any).nombre || "sin nombre";
    return {
      name: "Identificador",
      children: [{ name: nombre }],
    };
  }

  const children: RawNodeDatum[] = [];

  for (const key of Object.keys(node)) {
    if (key === "tipo") continue;

    const value = (node as any)[key];

    if (Array.isArray(value)) {
      if (value.length === 0) continue;

      if (value.every(isASTNode)) {
        children.push({
          name: key,
          children: value.map(astToRawNodeDatum),
        });
      } else {
        children.push({
          name: key,
          children: value.map((v: any) => ({
            name: "Elemento",
            children: [
              {
                name:
                  typeof v === "object" && v !== null
                    ? JSON.stringify(v)
                    : String(v),
              },
            ],
          })),
        });
      }
    } else if (isASTNode(value)) {
      children.push({
        name: key,
        children: [astToRawNodeDatum(value)],
      });
    } else if (typeof value === "object" && value !== null) {
      children.push({
        name: key,
        children: [{ name: JSON.stringify(value) }],
      });
    } else if (value !== undefined) {
      children.push({
        name: key,
        children: [{ name: String(value) }],
      });
    }
  }

  return {  
    name: node.tipo,
    children: children.length > 0 ? children : undefined,
  };
}
