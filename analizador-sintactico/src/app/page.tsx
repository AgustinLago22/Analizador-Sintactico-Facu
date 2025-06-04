"use client";

import { useState } from "react";
import { lexer } from "./analizador/lexter";
import Parser from "./analizador/parser";
import { ASTNode } from "./types/ast";
import { Token } from "./types/Token.type";
import Image from "next/image";
import logo from "../../public/logo.png";

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
    <main className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex justify-center">
      <div className="w-full max-w-screen-xl">
        <div className="flex flex-row items-center justify-center ">
          <h1 className="text-3xl font-bold mt-2 text-center text-gray-100">
            Compilador Guaraní
          </h1>
          <Image src={logo} alt="logo" width={200} />
        </div>

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
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col min-h-[600px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Código en Guaraní
            </h2>
            <textarea
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full min-h-[200px] flex-grow p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-700 text-black dark:text-gray-100"
              placeholder={`Ejemplo:
        entero x hae 5
        decimal y hae 3.14
        nee x + y

        ramo (x > 3) {
            nee "x es mayor que 3"
        } ambue {
            nee "x es menor o igual a 3"
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
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Tokens
            </h2>
            <div className="w-full min-h-[200px] flex-grow p-4 border rounded-lg bg-white dark:bg-gray-700 overflow-auto">
              {tokensResult ? (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600 text-gray-900 dark:text-gray-100">
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
                <div className="text-gray-500 dark:text-gray-300 italic">
                  Los tokens aparecerán aquí después del análisis...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fila 2: AST */}
        <div className="bg-gray-500 dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white dark:text-gray-100">
            Árbol Sintáctico Abstracto (AST)
          </h2>
          <div className="h-64 overflow-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
            {astResult ? (
              <pre className="font-mono text-sm text-black dark:text-gray-100">
                {JSON.stringify(astResult, null, 2)}
              </pre>
            ) : (
              <div className="text-gray-500 dark:text-gray-300 italic">
                El AST aparecerá aquí después del análisis sintáctico...
              </div>
            )}
          </div>
        </div>

        {/* Fila 3: Guía de uso */}
        <div className="bg-gray-500 dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Guía de Uso
          </h2>
          <div className="space-y-4 text-white dark:text-gray-100">
            <div>
              <h3 className="font-semibold">Declaración de Variables:</h3>
              <code className="block bg-gray-200 dark:bg-gray-700 p-2 rounded mt-1">
                entero x hae 5
                <br />
                decimal y hae 3.14
                <br />
                string mensaje hae &quot;Hola&quot;
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Impresión:</h3>
              <code className="block bg-gray-50 dark:bg-gray-700 p-2 rounded mt-1">
                nee x
                <br />
                nee &quot;Hola mundo&quot;
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Condicionales:</h3>
              <code className="block bg-gray-50 dark:bg-gray-700 p-2 rounded mt-1">
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
              <code className="block bg-gray-50 dark:bg-gray-700 p-2 rounded mt-1">
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
