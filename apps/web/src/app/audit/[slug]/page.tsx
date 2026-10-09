'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ThreePanelLayout } from '@/components/layout/ThreePanelLayout';
import { useAuditStore } from '@/store/auditStore';

export default function AuditPage() {
  const { slug } = useParams();
  const [status, setStatus] = useState('loading');
  const { setIR } = useAuditStore();
  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/audits/${slug}`);
      const data = await res.json();
      if (data.status === 'COMPLETED') { setIR(data.ir); setStatus('completed'); }
      else if (data.status === 'FAILED') { setStatus('failed'); }
      else { setStatus(data.status); setTimeout(poll, 2000); }
    };
    poll();
  }, [slug, setIR]);
  if (status === 'failed') return <div className="p-20 text-center font-serif">Audit Failed.</div>;
  if (status !== 'completed') return <div className="h-screen flex items-center justify-center font-mono">Analyzing... {status}</div>;
  return <ThreePanelLayout />;
}
