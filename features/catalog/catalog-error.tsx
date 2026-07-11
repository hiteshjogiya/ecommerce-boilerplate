interface CatalogErrorProps {
  title?: string;
  description?: string;
}

export function CatalogError({ title = "We couldn’t load products", description = "Please try again in a moment." }: CatalogErrorProps) {
  return (
    <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-red-700">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-red-600">{description}</p>
    </div>
  );
}
