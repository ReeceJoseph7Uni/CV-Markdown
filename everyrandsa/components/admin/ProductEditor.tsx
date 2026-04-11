'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import Link from 'next/link';

const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  institution: z.string().min(2, 'Institution required'),
  type: z.enum(['savings', 'loan', 'investment']),
  category: z.enum(['savings_account', 'notice_deposit', 'fixed_deposit', 'tfsa', 'money_market', 'personal_loan', 'home_loan', 'credit_card', 'transaction_account']),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'review_needed']),
  interestRate: z.number().min(0).max(100),
  rateType: z.enum(['nominal', 'effective']),
  isPromotional: z.boolean(),
  promotionEndDate: z.string().optional(),
  compoundingFrequency: z.enum(['daily', 'monthly', 'quarterly', 'annually']),
  monthlyFee: z.number().min(0),
  withdrawalFee: z.number().min(0),
  adminFee: z.number().min(0),
  openingFee: z.number().min(0),
  closurePenalty: z.number().min(0),
  minDeposit: z.number().min(0),
  minIncome: z.number().optional(),
  maxBalance: z.number().optional(),
  minTerm: z.number().optional(),
  accessType: z.enum(['24/7', 'business_hours', 'notice_period']),
  noticePeriodDays: z.number().optional(),
  isTfsaEligible: z.boolean(),
  taxTreatment: z.enum(['regular_income', 'tax_free']),
  sourceUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  lastCheckedDate: z.string(),
  lastCheckedBy: z.string().optional(),
  verificationStatus: z.enum(['verified', 'unverified']),
  updateFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
  notes: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

interface ProductEditorProps {
  defaultValues?: Partial<ProductForm>;
  onSave?: (data: ProductForm) => void;
  isNew?: boolean;
}

export function ProductEditor({ defaultValues, onSave, isNew = false }: ProductEditorProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'financial' | 'fees' | 'requirements' | 'tracking'>('basic');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      type: 'savings',
      category: 'savings_account',
      status: 'active',
      rateType: 'nominal',
      isPromotional: false,
      compoundingFrequency: 'monthly',
      monthlyFee: 0,
      withdrawalFee: 0,
      adminFee: 0,
      openingFee: 0,
      closurePenalty: 0,
      minDeposit: 0,
      accessType: '24/7',
      isTfsaEligible: false,
      taxTreatment: 'regular_income',
      lastCheckedDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'unverified',
      updateFrequency: 'monthly',
      interestRate: 0,
      ...defaultValues,
    },
  });

  const isPromotional = watch('isPromotional');

  const onSubmit = (data: ProductForm) => {
    console.log('Save product:', data);
    onSave?.(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'financial', label: 'Financial' },
    { id: 'fees', label: 'Fees' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'tracking', label: 'Source & Tracking' },
  ] as const;

  const fieldClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClass = 'text-xs text-red-600 mt-0.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Basic Info */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input {...register('name')} className={fieldClass} placeholder="e.g. Standard Bank PureSave" />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Institution *</label>
              <input {...register('institution')} className={fieldClass} placeholder="e.g. Standard Bank" />
              {errors.institution && <p className={errorClass}>{errors.institution.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Product Type *</label>
              <select {...register('type')} className={fieldClass}>
                <option value="savings">Savings</option>
                <option value="loan">Loan</option>
                <option value="investment">Investment</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select {...register('category')} className={fieldClass}>
                <option value="savings_account">Savings Account</option>
                <option value="notice_deposit">Notice Deposit</option>
                <option value="fixed_deposit">Fixed Deposit</option>
                <option value="tfsa">TFSA</option>
                <option value="money_market">Money Market</option>
                <option value="personal_loan">Personal Loan</option>
                <option value="home_loan">Home Loan</option>
                <option value="credit_card">Credit Card</option>
                <option value="transaction_account">Transaction Account</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status *</label>
              <select {...register('status')} className={fieldClass}>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="review_needed">Review Needed</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Description / Notes</label>
            <textarea {...register('description')} className={`${fieldClass} resize-none`} rows={3} placeholder="Brief description of this product..." />
          </div>
        </div>
      )}

      {/* Tab: Financial */}
      {activeTab === 'financial' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Financial Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Interest Rate (%) *</label>
              <input {...register('interestRate', { valueAsNumber: true })} type="number" step="0.01" className={fieldClass} />
              {errors.interestRate && <p className={errorClass}>{errors.interestRate.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Rate Type *</label>
              <select {...register('rateType')} className={fieldClass}>
                <option value="nominal">Nominal</option>
                <option value="effective">Effective</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Compounding Frequency *</label>
              <select {...register('compoundingFrequency')} className={fieldClass}>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" {...register('isPromotional')} id="isPromo" className="rounded border-gray-300" />
              <label htmlFor="isPromo" className="text-sm font-medium text-gray-700">Promotional Rate</label>
            </div>
            {isPromotional && (
              <div>
                <label className={labelClass}>Promotion End Date</label>
                <input {...register('promotionEndDate')} type="date" className={fieldClass} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Fees */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Fees</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'monthlyFee', label: 'Monthly Fee (R)' },
              { name: 'withdrawalFee', label: 'Withdrawal Fee (R)' },
              { name: 'adminFee', label: 'Admin Fee (R)' },
              { name: 'openingFee', label: 'Opening / Initiation Fee (R)' },
              { name: 'closurePenalty', label: 'Early Closure Penalty (R)' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className={labelClass}>{label}</label>
                <input
                  {...register(name as keyof ProductForm, { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className={fieldClass}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Requirements */}
      {activeTab === 'requirements' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Requirements & Eligibility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Minimum Deposit (R)</label>
              <input {...register('minDeposit', { valueAsNumber: true })} type="number" min="0" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Minimum Income (R)</label>
              <input {...register('minIncome', { valueAsNumber: true })} type="number" min="0" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Maximum Balance (R)</label>
              <input {...register('maxBalance', { valueAsNumber: true })} type="number" min="0" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Minimum Term (months)</label>
              <input {...register('minTerm', { valueAsNumber: true })} type="number" min="1" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Access Type *</label>
              <select {...register('accessType')} className={fieldClass}>
                <option value="24/7">24/7</option>
                <option value="business_hours">Business Hours</option>
                <option value="notice_period">Notice Period</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Notice Period (days)</label>
              <input {...register('noticePeriodDays', { valueAsNumber: true })} type="number" min="0" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Tax Treatment</label>
              <select {...register('taxTreatment')} className={fieldClass}>
                <option value="regular_income">Regular Income Tax</option>
                <option value="tax_free">Tax-Free</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" {...register('isTfsaEligible')} id="isTfsa" className="rounded border-gray-300" />
              <label htmlFor="isTfsa" className="text-sm font-medium text-gray-700">TFSA Eligible</label>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tracking */}
      {activeTab === 'tracking' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Source & Tracking</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Source URL</label>
              <input {...register('sourceUrl')} type="url" className={fieldClass} placeholder="https://www.bank.co.za/product-page" />
              {errors.sourceUrl && <p className={errorClass}>{errors.sourceUrl.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Last Checked Date *</label>
              <input {...register('lastCheckedDate')} type="date" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Last Checked By</label>
              <input {...register('lastCheckedBy')} className={fieldClass} placeholder="Username" />
            </div>
            <div>
              <label className={labelClass}>Verification Status</label>
              <select {...register('verificationStatus')} className={fieldClass}>
                <option value="unverified">Unverified</option>
                <option value="verified">Verified</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Update Frequency</label>
              <select {...register('updateFrequency')} className={fieldClass}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Notes / Disclaimer</label>
              <textarea {...register('notes')} className={`${fieldClass} resize-none`} rows={3} />
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm sticky bottom-0">
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-green-600 font-medium">✓ Saved successfully</span>
          )}
          {isDirty && !saved && (
            <span className="text-sm text-amber-600">Unsaved changes</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isNew ? 'Create Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
