'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { replyToInquiry } from '@/lib/actions/inquiries';
import { updateInquiryStatus } from '@/lib/actions/inquiries';
import { useRouter } from 'next/navigation';

type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'REPLIED' | 'CLOSED' | 'SPAM';

type Props = {
  inquiryId: number;
  customerEmail: string;
  currentStatus: string;
};

export function InquiryControls({ inquiryId, customerEmail, currentStatus }: Props) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function setStatus(status: InquiryStatus) {
    startTransition(async () => {
      await updateInquiryStatus(inquiryId, status);
      toast.success(`Status → ${status}`);
    });
  }

  function sendReply() {
    if (!replyBody.trim()) { toast.error('Reply cannot be empty'); return; }
    startTransition(async () => {
      await replyToInquiry(inquiryId, replyBody);
      setReplyOpen(false);
      setReplyBody('');
      toast.success('Reply sent via email');
    });
  }

  const statuses: InquiryStatus[] = ['NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED', 'SPAM'];

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              disabled={pending || currentStatus === s}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                currentStatus === s
                  ? 'text-white'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              style={currentStatus === s ? { backgroundColor: '#2e8a57' } : undefined}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Reply */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Reply</h3>
        <p className="mb-3 text-xs text-gray-400">To: {customerEmail}</p>
        <button
          onClick={() => setReplyOpen(!replyOpen)}
          className="w-full rounded-lg py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: '#2e8a57' }}
        >
          {replyOpen ? 'Close compose' : 'Compose reply'}
        </button>

        {replyOpen && (
          <div className="mt-3 space-y-3">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={8}
              placeholder="Write your reply…"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <button
              onClick={sendReply}
              disabled={pending}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: '#2e8a57' }}
            >
              {pending ? 'Sending…' : 'Send via email'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
