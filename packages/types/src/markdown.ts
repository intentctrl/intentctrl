export type SelectorType = "css" | "xpath";

export type AnnotatableElement =
  | "heading"
  | "paragraph"
  | "link"
  | "image"
  | "list"
  | "listItem"
  | "blockquote"
  | "codeBlock"
  | "button"
  | "textInput"
  | "checkboxRadio"
  | "fileInput"
  | "selectDropdown"
  | "textarea"
  | "editable"
  | "textBlock";

export interface SelectorResult {
  css: string;
  xpath: string;
}
