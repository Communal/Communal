"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PurchaseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        let isMounted = true;
        setLoading(true);

        (async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err?.error || "Product not found");
                }
                const data = await res.json();
                if (isMounted) setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                toast.error(err.message || "Unable to load product");
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [id]);

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Product Details</h1>
                <button
                    onClick={() => router.back()}
                    className="text-sm px-3 py-1 border rounded"
                >
                    Back
                </button>
            </div>

            {loading ? (
                <p>Loading product details...</p>
            ) : !product ? (
                <div className="p-4 bg-red-50 text-red-700 rounded">Product not found.</div>
            ) : (
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold">{product.name}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Price</p>
                            <p className="text-lg font-bold">
                                {product.usdPrice || product.currency === "USD" || product.priceCurrency === "USD"
                                    ? `$${product.price}`
                                    : `₦${product.price}`}
                            </p>

                            <p className="text-sm text-gray-600 mt-4">Category</p>
                            <p>{product.category?.name || "N/A"}</p>

                            <p className="text-sm text-gray-600 mt-4">Status</p>
                            <p>{product.isSold ? "Sold" : "Available"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-2">Description</p>
                            <p className="whitespace-pre-line">{product.info || "No description"}</p>

                            {product.data && (
                                <div className="mt-4">
                                    {/* If product.data is an image URL show it, otherwise just show text */}
                                    {typeof product.data === "string" && (product.data.startsWith("http") || product.data.startsWith("data:")) ? (
                                        // image
                                        <img src={product.data} alt={product.name} className="max-h-64 object-cover rounded" />
                                    ) : (
                                        <pre className="text-sm text-gray-700 mt-2">{product.data}</pre>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Raw JSON for debugging (optional) */}
                    {/* <pre className="text-xs text-gray-500">{JSON.stringify(product, null, 2)}</pre> */}
                </div>
            )}
        </div>
    );
}
