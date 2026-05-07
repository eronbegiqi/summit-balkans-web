import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getInquiryById } from '@/lib/db/queries/inquiries';
import { StatusBadge } from '@/components/admin/status-badge';
import { InquiryControls } from '@/components/admin/inquiry/reply-modal';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

const TYPE_LABELS: Record<string, string> = {
  CONTACT: 'Contact Form',
  PRIVATE_TRIP: 'Private Trip Request',
  TRIP_ALERT: 'Trip Alert',
  GEAR_RENTAL: 'Gear Rental Enquiry',
  PRESS: 'Press Enquiry',
};

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params;
  const inquiry = await getInquiryById(parseInt(id));
  if (!inquiry) notFound();

  const fields: Array<[string, string | number | null | undefined]> = [
    ['Type', TYPE_LABELS[inquiry.type] ?? inquiry.type],
    ['Name', inquiry.name],
    ['Email', inquiry.email],
    ...(inquiry.phone ? [['Phone', inquiry.phone] as [string, string]] : []),
    ...(inquiry.groupSize ? [['Group Size', inquiry.groupSize] as [string, number]] : []),
    ...(inquiry.preferredDatesStart ? [['Preferred Dates', `${inquiry.preferredDatesStart}${inquiry.preferredDatesEnd ? ` → ${inquiry.preferredDatesEnd}` : ''}`] as [string, string]] : []),
    ...((inquiry.countriesOfInterest as string[] | null)?.length ? [['Countries of Interest', (inquiry.countriesOfInterest as string[]).join(', ')] as [string, string]] : []),
    ...(inquiry.budgetEur ? [['Budget', `€${parseFloat(inquiry.budgetEur).toLocaleString()}`] as [string, string]] : []),
    ...(inquiry.sourcePage ? [['Source Page', inquiry.sourcePage] as [string, string]] : []),
    ['Submitted', new Date(inquiry.createdAt).toLocaleString('en-GB')],
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/inquiries" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to inquiries
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">Inquiry #{inquiry.id}</h1>
              <StatusBadge status={inquiry.status ?? 'NEW'} />
            </div>
            <p className="mt-1 text-sm text-gray-500">{TYPE_LABELS[inquiry.type] ?? inquiry.type} from {inquiry.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {/* Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Enquiry Details</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
                  <dd className="mt-0.5 text-gray-800">{value ?? '—'}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Message */}
          {inquiry.message && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">Message</h2>
              <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed">
                {inquiry.message}
              </div>
            </div>
          )}

          {/* Previous reply */}
          {inquiry.replyNotes && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="mb-3 text-sm font-semibold text-emerald-800">Reply Sent</h2>
              {inquiry.repliedAt && (
                <p className="mb-2 text-xs text-emerald-600">{new Date(inquiry.repliedAt).toLocaleString('en-GB')}</p>
              )}
              <div className="whitespace-pre-wrap text-sm text-emerald-900 leading-relaxed">
                {inquiry.replyNotes}
              </div>
            </div>
          )}
        </div>

        <div>
          <InquiryControls
            inquiryId={inquiry.id}
            customerEmail={inquiry.email}
            currentStatus={inquiry.status ?? 'NEW'}
          />
        </div>
      </div>
    </div>
  );
}
