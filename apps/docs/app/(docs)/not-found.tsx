import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "@/layouts/notebook/page";
import { Card, Cards } from "fumadocs-ui/components/card";

export default function NotFound() {
  return (
    <DocsPage toc={[]}>
      <DocsTitle>Page not found</DocsTitle>
      <DocsDescription className="mb-0">The page you're looking for doesn't exist or has been moved.</DocsDescription>
      <DocsBody>
        <Cards>
          <Card title="Documentation" href="/docs">
            Learn how to install, configure, and use IntentCtrl in your app.
          </Card>
          <Card title="UI Components" href="/ui">
            Reusable components for building chat interfaces.
          </Card>
          <Card title="Changelogs" href="/changelogs">
            Release history for all packages and apps.
          </Card>
        </Cards>
      </DocsBody>
    </DocsPage>
  );
}
