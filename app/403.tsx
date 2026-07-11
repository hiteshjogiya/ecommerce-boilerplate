import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import Link from 'next/link';
import { buildMetadata } from '@/src/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Forbidden',
  description: 'You do not have permission to access this resource.',
  path: '/403',
  noIndex: true,
});

export default function Forbidden() {
  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">403</h1>
          <p className="text-xl font-semibold text-gray-700">Access Denied</p>
          <p className="text-gray-600">You do not have permission to access this resource.</p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button variant="primary" className="w-full sm:w-auto">
              Go Home
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="secondary" className="w-full sm:w-auto">
              Go to Account
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
