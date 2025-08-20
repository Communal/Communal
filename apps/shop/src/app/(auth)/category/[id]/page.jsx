import CategoryPageClient from "./CategoryPageClient";

export default async function CategoryPage({ params }) {
  // Await params to avoid the Next.js error
  const { id } = await params;

  return <CategoryPageClient companyId={id} />;
}
