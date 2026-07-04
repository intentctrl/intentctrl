import { loadRegistryItem, RegistryItemNotFoundError } from "shadcn/registry";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  try {
    const item = await loadRegistryItem(name);
    return Response.json(item);
  } catch (error) {
    if (error instanceof RegistryItemNotFoundError) {
      return Response.json({ error: `Widget "${name}" was not found.` }, { status: 404 });
    }
    console.error(error);
    return Response.json({ error: "Failed to load widget." }, { status: 500 });
  }
}
