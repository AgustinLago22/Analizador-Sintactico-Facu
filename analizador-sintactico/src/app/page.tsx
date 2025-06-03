"use client";

import { useState } from "react";
import { lexer } from "./analizador/lexter";
import Parser from "./analizador/parser";
import { ASTNode } from "./types/ast";

export default function Home() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<ASTNode[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analizarCodigo = () => {
    try {
      setError(null);
      const tokens = lexer(codigo);
      const parser = new Parser(tokens);
      const ast = parser.parseProgram();
      setResultado(ast);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setResultado(null);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Analizador Sintáctico en Guaraní
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor de código */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Código en Guaraní
            </h2>
            <textarea
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full h-64 p-4 border rounded-lg font-mono text-sm bg-gray-50 text-black"
              placeholder={`Ejemplo:
entero x ha&apos;e 5
decimal y ha&apos;e 3.14
ñe&apos;e x + y

ramo (x > 3) {
    ñe&apos;e "x es mayor que 3"
} ambue {
    ñe&apos;e "x es menor o igual a 3"
}`}
            />
            <button
              onClick={analizarCodigo}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Analizar
            </button>
          </div>

          {/* Resultado del análisis */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Resultado del Análisis
            </h2>
            <div className="h-64 overflow-auto p-4 border rounded-lg bg-gray-50">
              {error ? (
                <div className="text-red-600 font-mono text-sm">{error}</div>
              ) : resultado ? (
                <pre className="font-mono text-sm">
                  {JSON.stringify(resultado, null, 2)}
                </pre>
              ) : (
                <div className="text-gray-500 italic">
                  El resultado del análisis aparecerá aquí...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guía de uso */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Guía de Uso
          </h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold">Declaración de Variables:</h3>
              <code className="block bg-gray-50 p-2 rounded mt-1">
                entero x ha&apos;e 5
                <br />
                decimal y ha&apos;e 3.14
                <br />
                string mensaje ha&apos;e &quot;Hola&quot;
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Impresión:</h3>
              <code className="block bg-gray-50 p-2 rounded mt-1">
                ñe&apos;e x
                <br />
                ñe&apos;e &quot;Hola mundo&quot;
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Condicionales:</h3>
              <code className="block bg-gray-50 p-2 rounded mt-1">
                ramo (x &gt; 5) {"{"}
                <br />
                &nbsp;&nbsp;ñe&apos;e &quot;x es mayor que 5&quot;
                <br />
                {"}"} ambue {"{"}
                <br />
                &nbsp;&nbsp;ñe&apos;e &quot;x es menor o igual a 5&quot;
                <br />
                {"}"}
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Bucles:</h3>
              <code className="block bg-gray-50 p-2 rounded mt-1">
                guara (i &lt; 10) {"{"}
                <br />
                &nbsp;&nbsp;ñe&apos;e i
                <br />
                &nbsp;&nbsp;i ha&apos;e i + 1
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
