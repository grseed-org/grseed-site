'use client';

import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';

// Rendered inside the locale layout, so the back/home actions stay locale-aware.
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="min-w-md max-w-lg">
        <CardContent className="flex flex-col gap-4">
          <h4 className="text-2xl font-bold">Not Found</h4>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-primary" />
            <span>This page doesn’t exist or has been removed.</span>
          </div>
        </CardContent>
        <div className="flex flex-row justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
