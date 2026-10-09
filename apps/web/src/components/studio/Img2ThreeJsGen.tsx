import { useState } from 'react';
import { Upload, Box, Wand2 } from 'lucide-react';

export function Img2ThreeJsGen() {
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] mono-text text-[#555] uppercase tracking-widest flex items-center gap-2">
        <Box size={14} className="text-blue-500" /> IMG_2_THREEJS_MODULE
      </h3>
      
      {!file ? (
        <div className="border border-dashed border-[#333] p-6 flex flex-col items-center justify-center text-[#555] hover:border-blue-500/50 hover:bg-[#0a0a0a] transition-colors cursor-pointer" onClick={() => document.getElementById('img-upload')?.click()}>
          <Upload size={16} className="mb-2" />
          <span className="text-[10px] uppercase mono-text tracking-wider">UPLOAD_TARGET_SPEC</span>
          <input id="img-upload" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-[#050505] border border-[#1a1a1a] p-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black border border-[#333] flex items-center justify-center">
              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="text-[10px] mono-text text-[#ccc] truncate">{file.name}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-blue-900 border border-[#333] hover:border-blue-500 text-[#ccc] hover:text-white px-3 py-2 text-[10px] mono-text uppercase tracking-wider transition-colors disabled:opacity-50">
            {isGenerating ? <Wand2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
            {isGenerating ? 'GENERATING_3D...' : 'EXECUTE_GENERATION'}
          </button>
        </div>
      )}
    </div>
  );
}
