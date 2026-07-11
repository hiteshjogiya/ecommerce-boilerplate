import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminLoading() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
