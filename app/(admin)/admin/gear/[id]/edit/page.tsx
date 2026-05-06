import { notFound } from 'next/navigation';
import { db } from '@/lib/db/client';
import { gearItems, gearUnits } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { saveGearItem } from '@/lib/actions/content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ id: string }> };

const CATEGORIES = ['Shelter', 'Sleep System', 'Clothing', 'Navigation', 'Cooking', 'Lighting', 'Safety', 'Other'] as const;

export default async function GearItemEditPage({ params }: Props) {
  const { id } = await params;
  const item = await db.query.gearItems.findFirst({ where: eq(gearItems.id, parseInt(id)) });
  if (!item) notFound();

  const [unitCountRow] = await db.select({ count: sql<number>`count(*)` }).from(gearUnits).where(eq(gearUnits.gearItemId, item.id));
  const currentUnitCount = Number(unitCountRow?.count ?? 0);

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/gear" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Gear Catalog
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit: {item.name}</h1>
        <p className="text-sm text-gray-500">{currentUnitCount} physical units exist</p>
      </div>

      <form action={async (fd: FormData) => {
        'use server';
        const newTotalUnits = parseInt(fd.get('totalUnits') as string);

        await saveGearItem(item.id, {
          slug: fd.get('slug') as string,
          name: fd.get('name') as string,
          category: fd.get('category') as typeof CATEGORIES[number],
          description: (fd.get('description') as string) || undefined,
          dayRateEur: fd.get('dayRateEur') as string,
          depositEur: (fd.get('depositEur') as string) || undefined,
          weightGrams: parseInt(fd.get('weightGrams') as string) || undefined,
          totalUnits: newTotalUnits,
          published: fd.get('published') === 'on',
          displayOrder: parseInt(fd.get('displayOrder') as string) || 0,
        });

        // Auto-generate new units if totalUnits increased
        if (newTotalUnits > currentUnitCount) {
          const toAdd = newTotalUnits - currentUnitCount;
          for (let i = 0; i < toAdd; i++) {
            const unitNum = currentUnitCount + i + 1;
            const unitCode = `${(fd.get('slug') as string).toUpperCase().slice(0, 6)}-${String(unitNum).padStart(3, '0')}`;
            await db.insert(gearUnits).values({
              gearItemId: item.id,
              unitCode,
              status: 'AVAILABLE',
              conditionStatus: 'NEW',
            });
          }
        }
      }} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Name</label><input name="name" defaultValue={item.name} required className={inputCls} /></div>
            <div><label className={labelCls}>Slug</label><input name="slug" defaultValue={item.slug} required className={`${inputCls} font-mono`} /></div>
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" defaultValue={item.category} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Description</label><textarea name="description" defaultValue={item.description ?? ''} rows={3} className={`${inputCls} resize-none`} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Day rate (€)</label><input type="number" step="0.01" name="dayRateEur" defaultValue={String(item.dayRateEur)} required className={inputCls} /></div>
            <div><label className={labelCls}>Deposit (€)</label><input type="number" step="0.01" name="depositEur" defaultValue={String(item.depositEur ?? '')} className={inputCls} /></div>
            <div><label className={labelCls}>Weight (g)</label><input type="number" name="weightGrams" defaultValue={item.weightGrams ?? ''} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Total units</label>
              <input type="number" name="totalUnits" defaultValue={item.totalUnits ?? 1} min={currentUnitCount} className={inputCls} />
              <p className="mt-1 text-xs text-gray-400">
                {currentUnitCount} units already exist. Increasing this auto-creates new units. Cannot decrease below {currentUnitCount}.
              </p>
            </div>
            <div>
              <label className={labelCls}>Display order</label>
              <input type="number" name="displayOrder" defaultValue={item.displayOrder ?? 0} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Visibility</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="published" defaultChecked={item.published ?? false} className="rounded" />
              <span className="text-sm text-gray-700">{item.published ? 'Published (live)' : 'Draft (hidden)'}</span>
            </label>
          </div>
          <button type="submit" className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>Save item</button>
          <Link href={`/admin/gear/inventory?view=units&item=${item.id}`} className="block w-full rounded-lg border border-gray-200 py-2.5 text-center text-sm text-gray-600 hover:bg-gray-50">
            Manage {currentUnitCount} units →
          </Link>
        </div>
      </form>
    </div>
  );
}
