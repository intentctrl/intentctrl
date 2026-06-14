import { waitForNavigation } from "./settle-detector";

interface RouterRef {
  push: (path: string) => void;
}

let injectedRouter: RouterRef | null = null;

export function setRouter(router: RouterRef): void {
  injectedRouter = router;
}

function tryReactRouter(): RouterRef | null {
  const global = window as unknown as Record<string, unknown>;
  const rr = global["__reactRouterDomGlobal"];
  if (rr && typeof (rr as RouterRef).push === "function") {
    return rr as RouterRef;
  }
  return null;
}

function isSafePath(target: string): boolean {
  if (/^javascript:/i.test(target)) return false;
  if (/^data:/i.test(target)) return false;
  if (/^https?:\/\//i.test(target)) return false;
  if (/^\/\//i.test(target)) return false;
  return target.startsWith("/") || target.startsWith("#") || target.startsWith("?");
}

export async function navigateTo(target: string): Promise<void> {
  if (!isSafePath(target)) {
    throw new Error(`Unsafe navigation target blocked: "${target}"`);
  }

  if (injectedRouter) {
    injectedRouter.push(target);
    await waitForNavigation(target);
    return;
  }

  const reactRouter = tryReactRouter();
  if (reactRouter) {
    reactRouter.push(target);
    await waitForNavigation(target);
    return;
  }

  window.location.href = target;
  await waitForNavigation(target);
}
