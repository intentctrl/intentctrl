import { waitForNavigation } from './settle-detector'

interface RouterRef {
  push: (path: string) => void
}

// Injected by @intentctrl/react so we can use the framework router
let injectedRouter: RouterRef | null = null

// Called by @intentctrl/react to inject the active framework router
export function setRouter(router: RouterRef): void {
  injectedRouter = router
}

// Detects Next.js App Router singleton at runtime without importing React
async function tryNextRouter(): Promise<RouterRef | null> {
  try {
    // Next.js App Router exposes its singleton via a module-level reference
    const mod = await import('next/navigation' as string)
    if (mod && typeof mod.useRouter === 'function') {
      // useRouter is only callable inside React — we rely on setRouter injection instead
      return null
    }
  } catch {
    // next/navigation not available
  }
  return null
}

// Detects React Router via global reference injected by the host app
function tryReactRouter(): RouterRef | null {
  const global = window as unknown as Record<string, unknown>
  const rr = global['__reactRouterDomGlobal']
  if (rr && typeof (rr as RouterRef).push === 'function') {
    return rr as RouterRef
  }
  return null
}

// Navigates to target using best available router, then waits for settle
export async function navigateTo(target: string): Promise<void> {
  if (injectedRouter) {
    injectedRouter.push(target)
    await waitForNavigation(target)
    return
  }

  const reactRouter = tryReactRouter()
  if (reactRouter) {
    reactRouter.push(target)
    await waitForNavigation(target)
    return
  }

  // Fallback to full page navigation
  window.location.href = target
  await waitForNavigation(target)
}
