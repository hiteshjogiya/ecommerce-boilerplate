'use client';

import { BarChart3, Box, FolderOpen, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/features/auth/actions/auth-actions';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'Products', href: '/admin/products', icon: Box },
  { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { label: 'Orders', href: '/admin/orders', icon: BarChart3 },
];

interface AdminSidebarProps {
  onClose?: () => void;
  open?: boolean;
}

export function AdminSidebar({ onClose, open = true }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {!open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 lg:z-auto lg:static transition-transform duration-300 lg:translate-x-0 ${
          !open ? '-translate-x-full' : ''
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <button
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <form
              action={async () => {
                await signOutAction();
              }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold hidden lg:block">Admin Dashboard</h1>
        <div className="flex-1" />
      </div>
    </header>
  );
}

export function AdminBreadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
