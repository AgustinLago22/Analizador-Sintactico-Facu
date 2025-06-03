"use client";

import { useState } from "react";
import { lexer } from "./analizador/lexter";
import Parser from "./analizador/parser";
import { ASTNode } from "./types/ast";
import { Token } from "./types/Token.type";

export default function Home() {
  const [codigo, setCodigo] = useState("");
  const [tokensResult, setTokensResult] = useState<Token[] | null>(null);
  const [astResult, setAstResult] = useState<ASTNode[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analizarCodigo = () => {
    try {
      setError(null);
      setTokensResult(null);
      setAstResult(null);

      const tokens = lexer(codigo);
      setTokensResult(tokens);

      const parser = new Parser(tokens);
      const ast = parser.parseProgram();
      setAstResult(ast);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setTokensResult(null);
      setAstResult(null);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100 flex justify-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Analizador Sintáctico en Guaraní
        </h1>

        {error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : null}

        {/* Fila 1: Editor y Tokens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Editor de código */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Código en Guaraní
            </h2>
            <textarea
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full flex-grow p-4 border rounded-lg font-mono text-sm bg-gray-50 text-black"
              placeholder={`Ejemplo:
                          entero x hae 5
                          decimal y hae 3.14
                          nee x + y

                          ramo (x > 3) {
                              nee &quot;x es mayor que 3&quot;
                          } ambue {
                              nee &quot;x es menor o igual a 3&quot;
                          }`}
            />
            <button
              onClick={analizarCodigo}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-start"
            >
              Analizar
            </button>
          </div>

          {/* Cuadro de Tokens */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Tokens</h2>
            <div className="flex-grow overflow-auto p-2 border rounded-lg bg-gray-50">
              {tokensResult ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-gray-900">
                    {tokensResult.map((token, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          {token.valor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          {token.tipo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500 italic">
                  Los tokens aparecerán aquí después del análisis...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fila 2: AST */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Árbol Sintáctico Abstracto (AST)
          </h2>
          <div className="h-64 overflow-auto p-4 border rounded-lg bg-gray-50">
            {astResult ? (
              <pre className="font-mono text-sm">
                {JSON.stringify(astResult, null, 2)}
              </pre>
            ) : (
              <div className="text-gray-500 italic">
                El AST aparecerá aquí después del análisis sintáctico...
              </div>
            )}
          </div>
        </div>

        {/* Fila 3: Guía de uso */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Guía de Uso
          </h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold">Declaración de Variables:</h3>
              <code className="block bg-gray-50 p-2 rounded mt-1">
                entero x hae 5
                <br />
                decimal y hae 3.14
                <br />
                string mensaje hae &quot;Hola&quot;
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Impresión:</h3>
              <code className="block bg-gray-50 p-2 rounded mt-1">
                nee x
                <br />
                nee &quot;Hola mundo&quot;
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Condicionales:</h3>
              <code className="block bg-gray-50 p-2 rounded mt-1">
                ramo (x &gt; 5) {"{"}
                <br />
                &nbsp;&nbsp;nee &quot;x es mayor que 5&quot;
                <br />
                {"}"} ambue {"{"}
                <br />
                &nbsp;&nbsp;nee &quot;x es menor o igual a 5&quot;
                <br />
                {"}"}
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Bucles:</h3>
              <code className="block bg-gray-50 p-2 rounded mt-1">
                guara (i &lt; 10) {"{"}
                <br />
                &nbsp;&nbsp;nee i
                <br />
                &nbsp;&nbsp;i hae i + 1
                <br />
                {"}"}
              </code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
