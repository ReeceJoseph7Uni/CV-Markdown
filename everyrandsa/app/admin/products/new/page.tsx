import { ProductEditor } from '@/components/admin/ProductEditor';

export default function NewProductPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">New Product</h2>
        <p className="text-sm text-gray-500 mt-1">Add a new financial product to the EveryRandSA database.</p>
      </div>
      <ProductEditor isNew />
    </div>
  );
}
