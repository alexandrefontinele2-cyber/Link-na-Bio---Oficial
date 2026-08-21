import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Check, FileCode2, Package, Sparkles } from 'lucide-react';

interface AssetPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const AssetPackModal: React.FC<AssetPackModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setCompleted(true);
          onSuccessToast('Jack_3D_Starter_Kit_v2.zip downloaded successfully!');
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const assetList = [
    { name: 'Abstract_Geometric_Set.blend', size: '124 MB', type: 'Blender 4.2+' },
    { name: 'Futuristic_Kits_C4D.c4d', size: '98 MB', type: 'Cinema 4D + Octane' },
    { name: '4K_PBR_Procedural_Textures.zip', size: '210 MB', type: 'ACES / Normal / Rough' },
    { name: 'Universal_Asset_Library.fbx', size: '85 MB', type: 'FBX / OBJ / GLTF' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl text-[#D7E2EA] z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#1F1F1F] text-[#D7E2EA]/70 hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                <Package className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-lg uppercase tracking-tight text-white">
                Free 3D Asset Starter Pack
              </h3>
            </div>
            <p className="text-xs text-[#D7E2EA]/60 mb-4">
              Curated by Jack. Free for personal &amp; commercial client projects.
            </p>

            {/* Included Files List */}
            <div className="flex flex-col gap-2 mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D7E2EA]/60">
                Package Contents (517 MB Total)
              </span>
              {assetList.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0C0C0C] border border-[#262626]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white truncate">
                        {file.name}
                      </div>
                      <div className="text-[10px] text-[#D7E2EA]/50">
                        {file.type}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#D7E2EA]/60 shrink-0 ml-2">
                    {file.size}
                  </span>
                </div>
              ))}
            </div>

            {/* Download Button / Progress */}
            {completed ? (
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Download Ready
                </span>
                <p className="text-[11px] text-[#D7E2EA]/70">
                  Your asset archive has been saved to your downloads.
                </p>
              </div>
            ) : downloading ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-[#D7E2EA]/70 font-mono">
                  <span>Downloading archive...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#262626] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B600A8] via-[#7621B0] to-[#BE4C00] transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="w-full rounded-full py-3.5 px-6 font-medium uppercase tracking-widest text-xs text-white text-center flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 contact-btn-glow"
              >
                <Download className="w-4 h-4" />
                <span>Download Free Pack (.ZIP)</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
