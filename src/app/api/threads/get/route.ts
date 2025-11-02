import { getThreads } from "@/lib/threads";

export async function GET() {
  try {
    const threads = await getThreads();
    return new Response(JSON.stringify({ threads }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
