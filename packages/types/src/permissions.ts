// Controls which built-in tools the LLM can call
export interface RuntimePermissions {
  navigate?: boolean;
  click?: boolean;
  type?: boolean;
  highlight?: boolean;
  scroll?: boolean;
  extract?: boolean;
}
