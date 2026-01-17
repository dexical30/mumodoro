import { updateBrowserTitle } from "./browser";
import { formatTime } from "@/utils/format";

export const tick = (second: number) => {
  updateBrowserTitle(`Mumodoro - ${formatTime(second)}`);
}