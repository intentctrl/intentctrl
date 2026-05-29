import { useIntentCtrlContext } from "../provider/context";
import type { IntentCtrlContextValue } from "../provider/context";

// Exposes chat state and controls from the nearest IntentCtrlProvider
export function useIntentCtrl(): IntentCtrlContextValue {
  return useIntentCtrlContext();
}
