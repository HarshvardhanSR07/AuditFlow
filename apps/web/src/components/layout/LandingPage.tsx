import Link from 'next/link';
export function LandingPage() {
  return ( <div className="min-h-screen bg-[#090b0f] text-[#fafafa] font-sans selection:bg-[#FFD700] selection:text-black"> <div className="max-w-4xl mx-auto pt-32 px-6"> <h1 className="text-6xl font-serif tracking-tight leading-tight mb-8"> Code audits as <br/> structured forensics. </h1> <p className="text-xl text-slate-400 max-w-2xl mb-12"> Architecture decoded deterministically. </p> <Link href="/demo" className="px-6 py-3 border border-[#30363d] hover:border-[#fafafa] transition-colors font-mono text-sm"> Run Demo </Link> </div> </div> );
}
