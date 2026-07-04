import { useIntentCtrlChatContext } from "../provider/context";
import type { IntentCtrlChat } from "../provider/context";

// Exposes chat state and controls from the nearest IntentCtrlProvider
export function useIntentCtrlChat(): IntentCtrlChat {
  return useIntentCtrlChatContext();
}
