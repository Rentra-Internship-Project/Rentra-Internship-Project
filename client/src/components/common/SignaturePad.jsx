import React, { useRef, useState } from 'react';
import { FiEdit3, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

const SignaturePad = ({ onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSave = () => {
    if (!hasSigned) return;
    const dataUrl = canvasRef.current.toDataURL();
    onSave(dataUrl);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
          <FiEdit3 className="text-[#3B82F6]" /> Electronic Signature (Draw using mouse or touch)
        </label>
        {hasSigned && (
          <span className="text-[11px] font-semibold text-[#22C55E] flex items-center gap-1">
            <FiCheckCircle /> Signature Captured
          </span>
        )}
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={140}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-dashed border-[#E2E8F0] rounded-[16px] bg-[#F8FAFC] cursor-crosshair w-full shadow-inner"
        />
        {!hasSigned && (
          <p className="absolute inset-0 flex items-center justify-center text-xs text-[#94A3B8] pointer-events-none font-medium">
            Sign inside this box to verify inspection
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={clearCanvas}
          className="px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-[10px] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <FiRefreshCw className="text-xs" /> Clear
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasSigned}
          className="px-4 py-1.5 text-xs font-bold bg-[#CCCCFF] hover:bg-[#B8B8FF] disabled:opacity-40 text-[#0F172A] rounded-[10px] transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
        >
          <FiCheckCircle className="text-xs" /> Save & Confirm Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
