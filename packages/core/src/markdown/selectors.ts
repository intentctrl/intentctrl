const MAX_CSS_DEPTH = 5;
const MAX_CSS_CLASSES = 3;

const isElement = (node: any): boolean => !!node && node.nodeType === 1;
const getTag = (node: any): string => (node.nodeName || node.tagName || "").toLowerCase();
const getAttr = (node: any, attr: string): string =>
  typeof node.getAttribute === "function" ? node.getAttribute(attr) || "" : "";
const getParent = (node: any): any => node.parentNode || node.parentElement || null;
const getChildren = (node: any): any[] =>
  node.children ? Array.from(node.children) : Array.from(node.childNodes || []).filter((n: any) => n.nodeType === 1);
const cssEscape = (v: string): string => v.replace(/([^\w-])/g, "\\$1");
const getClasses = (node: any): string[] => getAttr(node, "class").trim().split(/\s+/).filter(Boolean);
const isRootTag = (tag: string): boolean =>
  tag === "body" || tag === "html" || tag === "#document" || tag.startsWith("x-turndown");

function looksGenerated(v: string): boolean {
  return (
    v.startsWith("turndown") ||
    /\d{4,}/.test(v) ||
    /[0-9a-f]{8}-[0-9a-f]{4}/i.test(v) ||
    /^(__|:r\d|:R|rc-|ng-|_\$|ember\d|ext-)/.test(v) ||
    /^(sc-|css-|emotion-|jss-|makeStyles-|styled-)/.test(v) ||
    /[-_](?=[a-f0-9]*\d)[a-f0-9]{5,}$/i.test(v)
  );
}

const getStableClasses = (node: any): string[] =>
  getClasses(node)
    .filter((c) => !looksGenerated(c))
    .slice(0, MAX_CSS_CLASSES);

function countSameTagPosition(node: any): { hasSiblings: boolean; index: number } {
  const tag = getTag(node);
  let index = 1;
  let hasSiblings = false;
  for (let sib = node.previousSibling; sib; sib = sib.previousSibling) {
    if (isElement(sib) && getTag(sib) === tag) {
      index++;
      hasSiblings = true;
    }
  }
  if (!hasSiblings) {
    for (let sib = node.nextSibling; sib; sib = sib.nextSibling) {
      if (isElement(sib) && getTag(sib) === tag) {
        hasSiblings = true;
        break;
      }
    }
  }
  return { hasSiblings, index };
}

function getUniqueSegment(node: any): string {
  const tag = getTag(node);

  const testId = getAttr(node, "data-testid");
  if (testId) return `${tag}[data-testid="${testId}"]`;

  const cls = getStableClasses(node);
  if (cls.length) {
    const parent = getParent(node);
    const siblings = parent && isElement(parent) ? getChildren(parent) : [];
    const matches = siblings.filter((s) => getTag(s) === tag && cls.every((c) => getClasses(s).includes(c)));
    if (matches.length === 1) return `${tag}.${cls.map(cssEscape).join(".")}`;
  }

  const id = getAttr(node, "id");
  if (id && !looksGenerated(id)) return `#${cssEscape(id)}`;

  const { hasSiblings, index } = countSameTagPosition(node);
  const classPart = cls.length ? `.${cls.map(cssEscape).join(".")}` : "";
  return hasSiblings ? `${tag}${classPart}:nth-of-type(${index})` : `${tag}${classPart}`;
}

export function computeCSSSelector(el: any): string {
  if (!isElement(el)) return "";

  const parts: string[] = [];
  let current = el;

  while (current && isElement(current)) {
    const tag = getTag(current);
    if (isRootTag(tag)) break;

    const segment = getUniqueSegment(current);
    parts.unshift(segment);

    if (segment.startsWith("#") || segment.includes("[data-testid=")) break;
    if (parts.length >= MAX_CSS_DEPTH) break;
    if (getStableClasses(current).length > 0 && parts.length >= 2) break;

    current = getParent(current);
  }

  return parts.join(" > ");
}
