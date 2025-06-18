import React from "react";
import type { CustomNodeElementProps } from "react-d3-tree";

export default function CustomNode({ nodeDatum, toggleNode }: CustomNodeElementProps) {
  // Calcula color en base a la profundidad
  const getGradientColor = (depth: number): string => {
    // hue va de 200 (azul) a 340 (rosa)
    const hue = 200 + depth * 20;
    return `hsl(${hue % 360}, 80%, 60%)`;
  };

  const depth = (nodeDatum as any).__rd3t?.depth ?? 0;
  const color = getGradientColor(depth);

  return (
    <g>
      <foreignObject
        width={200}
        height={100}
        x={-100}
        y={-50}
        style={{ overflow: "visible", cursor: "pointer" }}
        onClick={toggleNode}
      >
        <div
          style={{
            background: color,
            borderRadius: 12,
            padding: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            color: "#fff",
            fontFamily: "sans-serif",
            fontSize: 13,
            textAlign: "center",
            minWidth: 120,
            maxWidth: 200,
            margin: "auto",
            transition: "background 0.3s ease",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: nodeDatum.attributes ? 4 : 0 }}>
            {nodeDatum.name}
          </div>
          {nodeDatum.attributes &&
            Object.entries(nodeDatum.attributes).map(([key, value]) => (
              <div key={key} style={{ fontSize: 11, color: "#e0f2fe" }}>
                {key}: {String(value)}
              </div>
            ))}
        </div>
      </foreignObject>
    </g>
  );
}
