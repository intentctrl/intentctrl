export default function ExamplePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Examples</h1>
      <p className="text-muted-foreground mb-8 max-w-md">Explore interactive examples to learn how IntentCtrl works.</p>
      <div className="flex gap-4">
        <a
          href="/example/simple"
          className="rounded-lg border bg-card px-6 py-4 font-medium hover:bg-accent transition-colors"
        >
          Simple Example
        </a>
        <a
          href="/example/modern"
          className="rounded-lg border bg-card px-6 py-4 font-medium hover:bg-accent transition-colors"
        >
          Modern Example
        </a>
      </div>
    </div>
  );
}
