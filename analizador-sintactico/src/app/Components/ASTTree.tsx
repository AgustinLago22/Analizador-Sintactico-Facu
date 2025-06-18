import React, { useState, useEffect, useRef } from "react";
import CustomNode from "./CustomNode";
import dynamic from "next/dynamic";
import { ASTNode } from "../types/ast";
import { astToRawNodeDatum } from "../utils/astToTree";

const Tree = dynamic(() => import("react-d3-tree").then((mod) => mod.Tree), {
  ssr: false,
});

interface ASTTreeProps {
  data: ASTNode;
}


export default function ASTTree({ data }: ASTTreeProps) {
  const treeData = astToRawNodeDatum(data);
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 80 }); // centrado horizontal, y fijo
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white overflow-auto"
      style={{ cursor: "grab" }}
    >
      <Tree
        data={treeData}
        orientation="horizontal"
        translate={translate}
        nodeSize={{ x: 220, y: 100 }}
        zoomable
        scaleExtent={{ min: 0.3, max: 2 }}
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        pathFunc="elbow"
        renderCustomNodeElement={(rd3tProps) => <CustomNode {...rd3tProps} />}
      />
    </div>
  );
}
