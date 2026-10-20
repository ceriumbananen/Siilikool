/* Liten rullande buffert med de senaste JS-/konsolfelen - fångas globalt i
   plugins/00-errorlog.client.ts och följer sedan med varje buggrapport (useBugReport.ts) som
   teknisk kontext, utan att den som rapporterar behöver beskriva felet själv. */
const MAX = 10;
const errors: string[] = [];

export function logError(msg: string) {
  errors.push(msg.slice(0, 300));
  if (errors.length > MAX) errors.shift();
}

export function recentErrors(): string[] {
  return errors.slice();
}
