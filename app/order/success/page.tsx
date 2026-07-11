import { MainShell } from "@/components/layout/main-shell";
import { OrderSuccessPage } from "@/features/checkout/components/order-success-page";
import { getOrderByNumberServer } from "@/src/services/order.server";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function OrderSuccessRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const orderNumberRaw = resolvedSearchParams?.orderNumber;
  const orderNumber = typeof orderNumberRaw === "string" ? orderNumberRaw : null;
  const order = orderNumber ? await getOrderByNumberServer(orderNumber) : null;

  return (
    <MainShell>
      <OrderSuccessPage order={order} orderNumber={orderNumber} />
    </MainShell>
  );
}
