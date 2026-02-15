import { EventEnvelopeSchema, type EventEnvelope } from "./schemas.js";

export function makeEventEnvelope(params: Omit<EventEnvelope, "id" | "ts">): EventEnvelope {
  const env: EventEnvelope = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    ...params,
  };
  return EventEnvelopeSchema.parse(env);
}

export async function publishEvent(envelope: EventEnvelope, targets: string[]): Promise<void> {
  // Best-effort in dev; failures should not crash the request path.
  await Promise.allSettled(
    targets.map((t) =>
      fetch(t, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(envelope),
      })
    )
  );
}

