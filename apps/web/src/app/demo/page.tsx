'use client';
import { useEffect } from 'react';
import { useAuditStore } from '@/store/auditStore';
import { ThreePanelLayout } from '@/components/layout/ThreePanelLayout';
import { demoIR } from '@/lib/demo/ai-chatbot-ir';
export default function DemoPage() {
  const { setIR } = useAuditStore();
  useEffect(() => { setIR(demoIR as any); }, [setIR]);
  return <ThreePanelLayout />;
}
