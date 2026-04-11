'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/components/admin/Header';
import { mockProducts } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/admin';
import { notFound } from 'next/navigation';

const SECTIONS = [
  'Basic Info',
  'Rates & Interest',
  'Fees',
  'Terms',
  'Eligibility',
  'Data Management',
  'Disclaimers',
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = mockProducts.find((p) => p.id === id);
  if (!product) notFound();

  const [activeSection, setActiveSection] = useState('Basic Info');
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit } = useForm<Product>({ defaultValues: product });

  const onSubmit = (data: Product) => {
    console.log('Saving product:', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <Header
        title={`Edit: ${product.name}`}
        onMenuClick={() => {}}
        actions={
          <div className="flex gap-2">
            {saved && (
              <span className="text-green-600 text-sm font-medium flex items-center">✓ Saved</span>
            )}
            <button
              form="product-form"
              type="submit"
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        }
      />
      <div className="p-6 flex gap-6">
        {/* Section Nav */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1 sticky top-6">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeSection === s
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {s}
              </button>
            ))}
          </nav>
        </div>

        {/* Form */}
        <div className="flex-1">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
            {activeSection === 'Basic Info' && (
              <Section title="Basic Info">
                <Field label="Product Name"><input {...register('name')} className={inputCls} /></Field>
                <Field label="Institution"><input {...register('institution')} className={inputCls} /></Field>
                <Field label="Product Type">
                  <select {...register('productType')} className={inputCls}>
                    {['savings', 'loan', 'investment', 'credit_card', 'transaction'].map((t) => (
                      <option key={t} value={t}>{t.replace('_', ' ')}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Category"><input {...register('category')} className={inputCls} /></Field>
                <Field label="Description" wide>
                  <textarea {...register('description')} rows={3} className={inputCls} />
                </Field>
                <Field label="Apply URL"><input {...register('applyUrl')} className={inputCls} /></Field>
                <Field label="Status">
                  <select {...register('status')} className={inputCls}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
              </Section>
            )}

            {activeSection === 'Rates & Interest' && (
              <Section title="Rates & Interest">
                <Field label="Interest Rate (%)">
                  <input type="number" step="0.01" {...register('interestRate', { valueAsNumber: true })} className={inputCls} />
                </Field>
                <Field label="Rate Type">
                  <select {...register('rateType')} className={inputCls}>
                    <option value="nominal">Nominal</option>
                    <option value="effective">Effective</option>
                  </select>
                </Field>
                <Field label="Is Promotional">
                  <input type="checkbox" {...register('isPromotional')} className="w-4 h-4" />
                </Field>
                <Field label="Promotional Start"><input type="date" {...register('promotionalStartDate')} className={inputCls} /></Field>
                <Field label="Promotional End"><input type="date" {...register('promotionalEndDate')} className={inputCls} /></Field>
                <Field label="Min Balance (R)">
                  <input type="number" {...register('minBalance', { valueAsNumber: true })} className={inputCls} />
                </Field>
                <Field label="Max Balance (R)">
                  <input type="number" {...register('maxBalance', { valueAsNumber: true })} className={inputCls} />
                </Field>
                <Field label="TFSA Eligible">
                  <input type="checkbox" {...register('isTfsaEligible')} className="w-4 h-4" />
                </Field>
                <Field label="Retirement Eligible">
                  <input type="checkbox" {...register('isRetirementEligible')} className="w-4 h-4" />
                </Field>
                <Field label="Tax Status" wide>
                  <input {...register('taxStatus')} className={inputCls} />
                </Field>
              </Section>
            )}

            {activeSection === 'Fees' && (
              <Section title="Fees">
                <Field label="Monthly Fee (R)"><input type="number" step="0.01" {...register('monthlyFee', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Withdrawal Fee (R)"><input type="number" step="0.01" {...register('withdrawalFee', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Transaction Fee (R)"><input type="number" step="0.01" {...register('transactionFee', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Setup Fee (R)"><input type="number" step="0.01" {...register('setupFee', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Closure Penalty (R)"><input type="number" step="0.01" {...register('closurePenalty', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Inactivity Fee (R)"><input type="number" step="0.01" {...register('inactivityFee', { valueAsNumber: true })} className={inputCls} /></Field>
              </Section>
            )}

            {activeSection === 'Terms' && (
              <Section title="Terms">
                <Field label="Notice Period (days)"><input type="number" {...register('noticePeriodDays', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Min Deposit (R)"><input type="number" {...register('minDeposit', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Max Deposit (R)"><input type="number" {...register('maxDeposit', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Lock-in Period (months)"><input type="number" {...register('lockInMonths', { valueAsNumber: true })} className={inputCls} /></Field>
              </Section>
            )}

            {activeSection === 'Eligibility' && (
              <Section title="Eligibility">
                <Field label="Min Income (R)"><input type="number" {...register('minIncome', { valueAsNumber: true })} className={inputCls} /></Field>
                <Field label="Credit Score Requirement"><input {...register('creditScoreRequirement')} className={inputCls} /></Field>
                <Field label="Age Requirement"><input {...register('ageRequirement')} className={inputCls} /></Field>
                <Field label="Residency Requirement"><input {...register('residencyRequirement')} className={inputCls} /></Field>
                <Field label="Special Conditions" wide>
                  <textarea {...register('specialConditions')} rows={2} className={inputCls} />
                </Field>
              </Section>
            )}

            {activeSection === 'Data Management' && (
              <Section title="Data Management">
                <Field label="Data Source">
                  <select {...register('dataSource')} className={inputCls}>
                    {['SARB_API', 'SARS', 'website_scrape', 'manual_entry', 'csv_upload'].map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Source URL" wide><input {...register('sourceUrl')} className={inputCls} /></Field>
                <Field label="API Endpoint" wide><input {...register('apiEndpoint')} className={inputCls} /></Field>
                <Field label="Last Checked"><input type="date" {...register('lastCheckedDate')} className={inputCls} /></Field>
                <Field label="Next Refresh"><input type="date" {...register('nextRefreshDate')} className={inputCls} /></Field>
                <Field label="Refresh Frequency">
                  <select {...register('refreshFrequency')} className={inputCls}>
                    {['daily', 'weekly', 'monthly', 'manual'].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Admin Notes" wide>
                  <textarea {...register('adminNotes')} rows={3} className={inputCls} />
                </Field>
              </Section>
            )}

            {activeSection === 'Disclaimers' && (
              <Section title="Disclaimers">
                <Field label="Public Disclaimer" wide>
                  <textarea {...register('publicDisclaimer')} rows={4} className={inputCls} />
                </Field>
              </Section>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
