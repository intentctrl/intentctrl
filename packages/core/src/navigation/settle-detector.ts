const SETTLE_DELAY_MS = 100
const TIMEOUT_MS = 3000
const POLL_INTERVAL_MS = 50

// Resolves when the page URL has settled and document is ready
export function waitForNavigation(expectedPath?: string): Promise<void> {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    let lastUrl = window.location.pathname
    let stableFor = 0

    const check = () => {
      if (Date.now() - startedAt >= TIMEOUT_MS) {
        resolve()
        return
      }

      const currentUrl = window.location.pathname

      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl
        stableFor = 0
      } else {
        stableFor += POLL_INTERVAL_MS
      }

      const urlMatches = !expectedPath || currentUrl === expectedPath
      const isReady = document.readyState === 'complete'
      const isStable = stableFor >= SETTLE_DELAY_MS

      if (urlMatches && isReady && isStable) {
        resolve()
        return
      }

      setTimeout(check, POLL_INTERVAL_MS)
    }

    setTimeout(check, POLL_INTERVAL_MS)
  })
}
