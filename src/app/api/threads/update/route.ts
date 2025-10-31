import { updateThread, type Thread } from "@/lib/threads";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      id?: string;
      updates?: Record<string, unknown>;
    };

    const id = typeof body.id === "string" ? body.id : undefined;
    const updates: Partial<Omit<Thread, "id">> | undefined =
      body.updates && typeof body.updates === "object"
        ? (body.updates as Partial<Omit<Thread, "id">>)
        : undefined;

    if (!id || !updates) {
      return new Response(
        JSON.stringify({ error: "Parámetros inválidos" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Solo permitir campos válidos del thread (excepto id) con validación de tipos
    const safeUpdates: Partial<Omit<Thread, "id">> = {};
    if (typeof updates.title === "string") {
      safeUpdates.title = updates.title;
    }
    if (typeof updates.providerId === "string") {
      safeUpdates.providerId = updates.providerId;
    }
    if (typeof updates.firstMessage === "boolean") {
      safeUpdates.firstMessage = updates.firstMessage;
    }

    if (Object.keys(safeUpdates).length === 0) {
      return new Response(
        JSON.stringify({ error: "Sin campos válidos para actualizar" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const updated = await updateThread(id, safeUpdates);
    if (!updated) {
      return new Response(
        JSON.stringify({ error: "Thread no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ thread: updated }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
