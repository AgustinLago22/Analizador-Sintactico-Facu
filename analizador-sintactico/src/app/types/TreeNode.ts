
export interface TreeNode {
  name: string;
  children?: TreeNode[];
  attributes?: { [key: string]: string | number | boolean }; // Propiedades adicionales
  
}