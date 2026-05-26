import { redirect } from 'next/navigation';
import { db } from '@/lib/db/client';
import { gearItems, gearUnits } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CATEGORIES = ['Shelter', 'Sleep System', 'Clothing', 'Navigation', 'Cooking', 'Lighting', 'Safety', 'Other'] as const;

export default async function GearItemNewPage() {
  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/gear" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Gear Catalog
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Gear Item</h1>
      </div>

      <form action={async (fd: FormData) => {
        'use server';
        const totalUnits = parseInt(fd.get('totalUnits') as string) || 1;
        const slug = fd.get('slug') as string;

        const result = await db.insert(gearItems).values({
          slug,
          name: fd.get('name') as string,
          category: fd.get('category') as typeof CATEGORIES[number],
          description: (fd.get('description') as string) || undefined,
          dayRateEur: fd.get('dayRateEur') as string,
          depositEur: (fd.get('depositEur') as string) || undefined,
          weightGrams: parseInt(fd.get('weightGrams') as string) || undefined,
          totalUnits,
          published: fd.get('published') === 'on',
          displayOrder: parseInt(fd.get('displayOrder') as string) || 0,
        });

        const newId = (result as unknown as { insertId: number }).insertId;
        if (newId && totalUnits > 0) {
          for (let i = 1; i <= totalUnits; i++) {
            const unitCode = `${slug.toUpperCase().slice(0, 6)}-${String(i).padStart(3, '0')}`;
            await db.insert(gearUnits).values({
              gearItemId: newId,
              unitCode,
              status: 'AVAILABLE',
              conditionStatus: 'NEW',
            });
          }
        }

        revalidatePath('/admin/gear');
        redirect('/admin/gear');
      }} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Name</label><input name="name" required className={inputCls} placeholder="e.g. Osprey Atmos 65" /></div>
            <div><label className={labelCls}>Slug</label><input name="slug" required className={`${inputCls} font-mono`} placeholder="e.g. osprey-atmos-65" /></div>
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" className={inputCls}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Description</label><textarea name="description" rows={3} className={`${inputCls} resize-none`} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Day rate (€)</label><input type="number" step="0.01" name="dayRateEur" required className={inputCls} placeholder="0.00" /></div>
            <div><label className={labelCls}>Deposit (€)</label><input type="number" step="0.01" name="depositEur" className={inputCls} placeholder="0.00" /></div>
            <div><label className={labelCls}>Weight (g)</label><input type="number" name="weightGrams" className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Total units</label>
              <input type="number" name="totalUnits" defaultValue={1} min={1} className={inputCls} />
              <p className="mt-1 text-xs text-gray-400">Units will be auto-created with sequential codes.</p>
            </div>
            <div>
              <label className={labelCls}>Display order</label>
              <input type="number" name="displayOrder" defaultValue={0} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Visibility</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="published" className="rounded" />
              <span className="text-sm text-gray-700">Publish immediately</span>
            </label>
          </div>
          <button type="submit" className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>Create item</button>
        </div>
      </form>
    </div>
  );
}
