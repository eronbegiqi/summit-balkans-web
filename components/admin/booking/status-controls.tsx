'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateBookingStatus, cancelBooking, recordManualPayment } from '@/lib/actions/bookings';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { StatusBadge } from '@/components/admin/status-badge';

type BookingStatus = 'NEW' | 'CONFIRMED' | 'PRE_TRIP' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

const STATUS_FLOW: BookingStatus[] = ['NEW', 'CONFIRMED', 'PRE_TRIP', 'IN_PROGRESS', 'COMPLETED'];

type Props = {
  bookingId: number;
  currentStatus: BookingStatus;
  currentPaymentStatus: string;
  totalEur: number;
  paidAmountEur: number;
  depositAmountEur?: number | null;
};

export function BookingStatusControls({
  bookingId,
  currentStatus,
  currentPaymentStatus,
  totalEur,
  paidAmountEur,
  depositAmountEur,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'BANK_TRANSFER' | 'CASH' | 'OTHER'>('BANK_TRANSFER');
  const [payRef, setPayRef] = useState('');

  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const nextStatus = currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIndex + 1]
    : null;

  const remainingEur = totalEur - paidAmountEur;
  const isFullyPaid = remainingEur <= 0;

  function advance() {
    if (!nextStatus) return;
    startTransition(async () => {
      await updateBookingStatus(bookingId, nextStatus!);
      toast.success(`Status updated to ${nextStatus}`);
    });
  }

  function handleCancel() {
    startTransition(async () => {
      await cancelBooking(bookingId);
      setCancelOpen(false);
      toast.success('Booking cancelled');
    });
  }

  function handleManualPayment() {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    startTransition(async () => {
      await recordManualPayment(bookingId, amount, payMethod, payRef);
      setPaymentOpen(false);
      setPayAmount('');
      setPayRef('');
      toast.success(`€${amount.toLocaleString()} payment recorded`);
    });
  }

  return (
    <div className="space-y-4">
      {/* Payment box */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Payment</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Total due</span>
            <span className="font-semibold">€{totalEur.toLocaleString()}</span>
          </div>
          {depositAmountEur && (
            <div className="flex justify-between">
              <span className="text-gray-500">Deposit (20%)</span>
              <span>€{depositAmountEur.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Paid</span>
            <span className="font-semibold text-emerald-700">€{paidAmountEur.toLocaleString()}</span>
          </div>
          {!isFullyPaid && (
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-500">Remaining</span>
              <span className="font-bold text-orange-600">€{remainingEur.toLocaleString()}</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <StatusBadge status={currentPaymentStatus} />
        </div>
        <button
          onClick={() => setPaymentOpen(true)}
          className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Record manual payment
        </button>
      </div>

      {/* Status workflow */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Status workflow</h3>
        <div className="mb-4 flex gap-1">
          {STATUS_FLOW.map((s, i) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full"
              style={{
                backgroundColor: i <= currentIndex ? '#2e8a57' : '#e5e7eb',
              }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>NEW</span><span>COMPLETED</span>
        </div>
        {nextStatus && currentStatus !== 'CANCELLED' && (
          <button
            onClick={advance}
            disabled={pending}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: '#2e8a57' }}
          >
            {pending ? 'Updating…' : `Mark as ${nextStatus.replace('_', ' ')}`}
          </button>
        )}
        {currentStatus !== 'CANCELLED' && currentStatus !== 'COMPLETED' && (
          <button
            onClick={() => setCancelOpen(true)}
            className="mt-2 w-full rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Cancel booking
          </button>
        )}
      </div>

      {/* Confirm cancel */}
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel this booking?"
        description="This will mark the booking as CANCELLED. Gear reservations will need to be released manually."
        confirmLabel="Cancel Booking"
        variant="danger"
        onConfirm={handleCancel}
        loading={pending}
      />

      {/* Manual payment modal */}
      {paymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-semibold text-gray-900">Record Manual Payment</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Amount (€)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder={String(remainingEur)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as typeof payMethod)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Reference (optional)</label>
                <input
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Transaction ID, bank ref…"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setPaymentOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleManualPayment}
                disabled={pending}
                className="flex-1 rounded-lg py-2 text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: '#2e8a57' }}
              >
                {pending ? 'Saving…' : 'Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
