import { ShoppingCart, Eye, Filter, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";

export const ProductListingPage = () => {
  const { data: products, error, isLoading } = useProducts();

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        {/* Responsive Product Grid */}
        {!isLoading && products && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                className={`animate-fade-up shadow-none delay-${((index % 4) + 1) * 100}`}
              />
            ))}
          </div>
        )}

        {!products && (
          <div className="flex justify-center p-8">
            <p className="text-center text-muted-foreground">
              No products found.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin w-8 h-8 text-accent" />
          </div>
        )}
      </div>
    </Layout>
  );
};
