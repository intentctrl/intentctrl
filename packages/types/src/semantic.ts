// Role of an extracted UI element
export type SemanticRole = "button" | "input" | "link" | "section" | "heading" | "form" | "text";

// Single UI element with semantic meaning
export interface SemanticNode {
  id: string;
  role: SemanticRole;
  label: string;
  description?: string;
  visible: boolean;
  importance: number;
  annotated: boolean;
}

// Compressed semantic representation of current page
export interface SemanticGraph {
  route: string;
  title: string;
  nodes: SemanticNode[];
}
