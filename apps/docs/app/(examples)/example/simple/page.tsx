export default function SimpleExamplePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Simple Example</h1>
      <p className="text-muted-foreground mb-8 max-w-md">A basic example showcasing core IntentCtrl functionality.</p>
      <a href="/example" className="text-sm text-muted-foreground hover:text-foreground underline">
        &larr; Back to examples
      </a>
    </div>
  );
}
