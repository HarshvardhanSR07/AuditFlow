import { useAuditStore } from '@/store/auditStore';
import { useState, useEffect } from 'react';

export function GitDiagram() {
  const { ir } = useAuditStore();
  const [gitUrl, setGitUrl] = useState('');

  useEffect(() => {
    if (ir?.meta?.repoUrl) {
      let url = ir.meta.repoUrl;
      url = url.replace('github.com', 'gitdiagram.com');
      url = url.replace(/\.git$/, '');
      setGitUrl(url);
    }
  }, [ir]);

  if (!gitUrl) return <div className="p-4 text-[#555] mono-text text-[11px]">ERR: NO_GITHUB_URL</div>;

  return (
    <div className="w-full h-full bg-black">
      <iframe src={gitUrl} className="w-full h-full border-none" title="GitDiagram Workflow Chart" />
    </div>
  );
}
