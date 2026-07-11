import { createServerSupabaseClient } from '@/src/lib/supabase/server';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { redirect } from 'next/navigation';

async function checkAdminRole() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase.from('user_profiles').select('role').eq('user_id', user.id).single();

  if (error || profile?.role !== 'admin') {
    redirect('/403');
  }
}

async function getAdminStats() {
  const supabase = await createServerSupabaseClient();

  // Get stats
  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: ordersCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('order_number, total, status, created_at')
      .eq('status', 'pending')
      .limit(5)
      .order('created_at', { ascending: false }),
  ]);

  return {
    productsCount: productsCount || 0,
    categoriesCount: categoriesCount || 0,
    ordersCount: ordersCount || 0,
    pendingOrders: recentOrders || [],
  };
}

export default async function AdminDashboard() {
  await checkAdminRole();

  const stats = await getAdminStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb items={[{ label: 'Dashboard' }]} />

        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Products" value={stats.productsCount} color="blue" />
          <StatCard title="Total Categories" value={stats.categoriesCount} color="green" />
          <StatCard title="Total Orders" value={stats.ordersCount} color="purple" />
          <StatCard title="Pending Orders" value={stats.pendingOrders.length} color="orange" />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-bold mb-4">Recent Pending Orders</h2>

          {stats.pendingOrders.length === 0 ? (
            <p className="text-gray-500">No pending orders</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Order #</th>
                    <th className="text-left py-2">Total</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.pendingOrders.map((order) => (
                    <tr key={order.order_number} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <a
                          href={`/admin/orders/${order.order_number}`}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          #{order.order_number}
                        </a>
                      </td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className="px-2 py-1 rounded text-sm font-semibold bg-yellow-100 text-yellow-800">
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
