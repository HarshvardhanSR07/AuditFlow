import { useState } from 'react';
import { useAuditStore } from '@/store/auditStore';
import { Img2ThreeJsGen } from '../studio/Img2ThreeJsGen';

export function ChatPanel() {
  const { ir } = useAuditStore();
  const [msgs, setMsgs] = useState([{role:'assistant', content:'SYSTEM INITIALIZED. FORENSIC PROTOCOLS ACTIVE. AWAITING QUERY.'}]);
  const [input, setInput] = useState('');

  const send = async () => {
    if(!input.trim()) return;
    const newMsgs = [...msgs, {role:'user', content:input}];
    setMsgs(newMsgs); setInput('');
    try {
      const res = await fetch('/api/chat', { method:'POST', body: JSON.stringify({ ir, messages: newMsgs }) });
      const { reply } = await res.json();
      setMsgs([...newMsgs, {role:'assistant', content:reply || 'ERR: NO_RESPONSE'}]);
    } catch(e) {
      setMsgs([...newMsgs, {role:'assistant', content:'ERR: CONNECTION_REFUSED'}]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border-l border-[#1a1a1a] mono-text text-[11px] uppercase tracking-wider relative">
      <div className="p-4 border-b border-[#1a1a1a] bg-[#050505] flex justify-between items-center">
        <span className="text-[#888] font-bold">Terminal / Analysis</span>
        <span className="text-emerald-500">ONLINE</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {msgs.map((m,i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className={`text-[#555] ${m.role === 'user' ? 'text-blue-500' : 'text-emerald-500'}`}>
              {m.role === 'user' ? '> USER_INPUT' : '> AUDITFLOW_SYS'}
            </div>
            <div className="text-[#ccc] leading-relaxed break-words whitespace-pre-wrap">
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#1a1a1a] bg-[#050505]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-blue-500">{'>'}</span>
          <input 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            onKeyDown={e=>e.key==='Enter'&&send()} 
            className="flex-1 bg-transparent border-none outline-none text-[#ccc] placeholder:text-[#444] uppercase" 
            placeholder="EXECUTE QUERY..." 
          />
        </div>
        <div className="border-t border-[#1a1a1a] pt-4">
          <Img2ThreeJsGen />
        </div>
      </div>
    </div>
  );
}
