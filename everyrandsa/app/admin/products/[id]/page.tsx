'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, History } from 'lucide-react';
import { ProductEditor } from '@/components/admin/ProductEditor';
import { Badge } from '@/components/admin/Badge';
import { MOCK_PRODUCTS, MOCK_RATE_HISTORY } from '@/lib/mock-data';
import { formatDate, formatDateTime } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  const history = MOCK_RATE_HISTORY.filter((r) => r.productId === id);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back + title */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/products" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
          <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
          <p className="text-sm text-gray-500">{product.institution}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={product.status === 'active' ? 'success' : 'warning'}>
            {product.status.replace(/_/g, ' ')}
          </Badge>
          {product.sourceUrl && (
            <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <ExternalLink className="h-4 w-4" /> View on bank site
            </a>
          )}
        </div>
      </div>

      {/* Rate History */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Rate History</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Effective Date', 'Old Rate', 'New Rate', 'Changed By', 'Reason', 'Notes'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{formatDate(h.effectiveDate)}</td>
                  <td className="px-3 py-2 text-red-600">{h.oldRate}%</td>
                  <td className="px-3 py-2 text-green-600 font-semibold">{h.newRate}%</td>
                  <td className="px-3 py-2">{h.changedBy}</td>
                  <td className="px-3 py-2 capitalize">{h.reason}</td>
                  <td className="px-3 py-2 text-gray-500">{h.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor */}
      <ProductEditor
        defaultValues={{
          name: product.name,
          institution: product.institution,
          type: product.type,
          category: product.category,
          description: product.description,
          status: product.status,
          interestRate: product.interestRate,
          rateType: product.rateType,
          isPromotional: product.isPromotional,
          promotionEndDate: product.promotionEndDate,
          compoundingFrequency: product.compoundingFrequency,
          monthlyFee: product.monthlyFee,
          withdrawalFee: product.withdrawalFee,
          adminFee: product.adminFee,
          openingFee: product.openingFee,
          closurePenalty: product.closurePenalty,
          minDeposit: product.minDeposit,
          minIncome: product.minIncome,
          maxBalance: product.maxBalance,
          minTerm: product.minTerm,
          accessType: product.accessType,
          noticePeriodDays: product.noticePeriodDays,
          isTfsaEligible: product.isTfsaEligible,
          taxTreatment: product.taxTreatment,
          sourceUrl: product.sourceUrl,
          lastCheckedDate: product.lastCheckedDate,
          lastCheckedBy: product.lastCheckedBy,
          verificationStatus: product.verificationStatus,
          updateFrequency: product.updateFrequency,
          notes: product.notes,
        }}
      />
    </div>
  );
}
