import { loadRegistry } from "shadcn/registry";

export async function GET() {
  try {
    const registry = await loadRegistry();
    return Response.json(registry);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to load chat widgets." }, { status: 500 });
  }
}
