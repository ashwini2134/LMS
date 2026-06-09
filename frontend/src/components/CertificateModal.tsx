import { useEffect, useRef, useState } from "react";
import { X, Download, ShieldCheck, ExternalLink } from "lucide-react";
import { getEarnedCertificates, type Certificate } from "../api";

interface CertificateModalProps {
  courseSlug: string;
  courseTitle: string;
  studentName: string;
  onClose: () => void;
}

export function CertificateModal({ courseSlug, courseTitle, studentName, onClose }: CertificateModalProps) {
  const [cert, setCert] = useState<Certificate | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const all = getEarnedCertificates();
    const currentCert = all[courseSlug];
    if (currentCert) {
      setCert(currentCert);
    }
  }, [courseSlug]);

  const handleDownload = () => {
    if (!cert) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw high-resolution certificate on Canvas (1120 x 800)
    // Clear canvas
    ctx.clearRect(0, 0, 1120, 800);

    // 1. Background Gradient
    const bgGrad = ctx.createRadialGradient(560, 400, 50, 560, 400, 700);
    bgGrad.addColorStop(0, "#1e293b"); // slate-800
    bgGrad.addColorStop(1, "#0b0f19"); // slate-950
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1120, 800);

    // 2. Decorative Background Radial Rays/Stars (subtle lines)
    ctx.strokeStyle = "rgba(245, 158, 11, 0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 360; i += 5) {
      const angle = (i * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(560, 400);
      ctx.lineTo(560 + Math.cos(angle) * 800, 400 + Math.sin(angle) * 800);
      ctx.stroke();
    }

    // 3. Outer Gold Border
    const borderGrad = ctx.createLinearGradient(0, 0, 1120, 800);
    borderGrad.addColorStop(0, "#fbbf24"); // Amber-400
    borderGrad.addColorStop(0.5, "#d97706"); // Amber-600
    borderGrad.addColorStop(1, "#fbbf24");
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1060, 740);

    // 4. Inner Thin Gold Border
    ctx.strokeStyle = "rgba(251, 191, 36, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, 1036, 716);

    // 5. Corner Ornaments (four small golden rectangles)
    ctx.fillStyle = "#fbbf24";
    const corners = [
      { x: 38, y: 38 },
      { x: 1072, y: 38 },
      { x: 38, y: 752 },
      { x: 1072, y: 752 },
    ];
    corners.forEach((c) => {
      ctx.fillRect(c.x, c.y, 10, 10);
    });

    // 6. Header Logo
    ctx.fillStyle = "rgba(251, 191, 36, 0.85)";
    ctx.font = "bold 14px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("F R A Y L O N   A C A D E M Y", 560, 120);

    // Mini divider
    ctx.fillStyle = "rgba(251, 191, 36, 0.3)";
    ctx.fillRect(510, 140, 100, 2);

    // 7. Title "Certificate of Completion"
    const titleGrad = ctx.createLinearGradient(300, 200, 820, 200);
    titleGrad.addColorStop(0, "#fef3c7"); // Amber-100
    titleGrad.addColorStop(0.5, "#fbbf24"); // Amber-400
    titleGrad.addColorStop(1, "#fef3c7");
    ctx.fillStyle = titleGrad;
    ctx.font = "extrabold 38px 'Georgia', 'Times New Roman', serif";
    ctx.fillText("CERTIFICATE OF COMPLETION", 560, 210);

    // 8. Presentation Text
    ctx.fillStyle = "#94a3b8"; // Slate-400
    ctx.font = "italic 16px 'Georgia', serif";
    ctx.fillText("This is proudly presented to", 560, 275);

    // 9. Student Name
    ctx.fillStyle = "#f8fafc"; // Slate-50
    ctx.font = "bold 34px 'Georgia', serif";
    ctx.fillText(studentName, 560, 340);

    // underline effect on name
    ctx.fillStyle = "rgba(251, 191, 36, 0.4)";
    ctx.fillRect(360, 355, 400, 2);

    // 10. Completion Description
    ctx.fillStyle = "#94a3b8"; // Slate-400
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText("for successfully completing all curriculum requirements for", 560, 410);

    // 11. Course Title
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px 'Georgia', serif";
    ctx.fillText(courseTitle, 560, 460);

    // 12. Bottom Golden Seal (Left / Bottom-Center)
    ctx.beginPath();
    ctx.arc(560, 595, 42, 0, 2 * Math.PI);
    const sealGrad = ctx.createLinearGradient(520, 550, 600, 640);
    sealGrad.addColorStop(0, "#fbbf24");
    sealGrad.addColorStop(1, "#b45309");
    ctx.fillStyle = sealGrad;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ribbons under seal
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.moveTo(540, 630);
    ctx.lineTo(530, 690);
    ctx.lineTo(550, 680);
    ctx.lineTo(560, 630);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.moveTo(560, 630);
    ctx.lineTo(570, 680);
    ctx.lineTo(590, 690);
    ctx.lineTo(580, 630);
    ctx.closePath();
    ctx.fill();

    // Seal text/star
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px 'Inter', sans-serif";
    ctx.fillText("★", 560, 601);

    // 13. Signatures & Date
    // Date & Verification ID (Left)
    ctx.textAlign = "left";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px 'Inter', sans-serif";
    const dateFormatted = cert.completedAt
      ? new Date(cert.completedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(`Completed: ${dateFormatted}`, 100, 610);
    ctx.fillText(`ID: ${cert.certificateId}`, 100, 635);

    // Monospace verification link
    ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
    ctx.font = "10px monospace";
    ctx.fillText(cert.verificationUrl, 100, 660);

    // Instructor Signature (Right)
    ctx.textAlign = "right";
    ctx.fillStyle = "#fbbf24";
    // Handwritten mock font (Brush Script MT lookalike / custom script text styling)
    ctx.font = "italic 32px 'Brush Script MT', 'Georgia', 'Allura', cursive";
    ctx.fillText("Yuvaraj Dudukuru", 1020, 615);
    
    // Line under signature
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(820, 630, 200, 1.5);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText("Lead Instructor, Fraylon Academy", 1020, 655);

    // Trigger image download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Fraylon_Academy_Certificate_${courseSlug.toUpperCase()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!cert) return null;

  const formattedDate = new Date(cert.completedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Hidden Canvas for High-Resolution Exporter */}
      <canvas ref={canvasRef} width="1120" height="800" className="hidden" />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#0b0f19] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold text-slate-200">Earned Certificate Verified</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Certificate Preview */}
        <div className="p-6 md:p-8 flex-1 flex justify-center bg-[#070a10]">
          {/* Certificate Design Container */}
          <div className="relative w-full max-w-[700px] aspect-[1.4/1] bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-6 md:p-10 flex flex-col justify-between shadow-2xl overflow-hidden select-none">
            {/* Ambient gold glow in background */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />

            {/* Inner Border */}
            <div className="absolute inset-2 md:inset-3 border border-amber-500/10 rounded-xl pointer-events-none" />

            {/* Certificate Header */}
            <div className="text-center">
              <span className="text-[9px] md:text-[10px] tracking-[0.3em] font-bold text-amber-500/80">
                F R A Y L O N   A C A D E M Y
              </span>
              <div className="w-16 h-0.5 bg-amber-500/25 mx-auto mt-2 mb-3 md:mb-5" />
              <h2 className="text-xl md:text-3xl font-bold font-serif tracking-wide bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-transparent bg-clip-text">
                CERTIFICATE OF COMPLETION
              </h2>
            </div>

            {/* Presentation Statement */}
            <div className="text-center space-y-4 my-2">
              <p className="text-xs text-slate-400 italic">This certificate is proudly presented to</p>
              <h3 className="text-xl md:text-3xl font-extrabold text-white tracking-wide underline decoration-amber-500/30 decoration-wavy underline-offset-4 md:underline-offset-8">
                {studentName}
              </h3>
              <p className="text-xs text-slate-400 leading-normal max-w-md mx-auto">
                for successfully completing all curriculum requirements for
              </p>
              <h4 className="text-base md:text-xl font-bold text-amber-400 font-serif">
                {courseTitle}
              </h4>
            </div>

            {/* Footer with Seal and Signatures */}
            <div className="flex items-end justify-between border-t border-slate-800/60 pt-4 mt-2">
              {/* Left Column: ID & Date */}
              <div className="text-left space-y-1">
                <p className="text-[10px] text-slate-400">
                  Completed: <span className="font-semibold text-slate-200">{formattedDate}</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Certificate ID: <span className="font-semibold text-slate-200">{cert.certificateId}</span>
                </p>
                <div className="flex items-center gap-1 text-[9px] text-amber-500/70 font-mono">
                  <span>{cert.verificationUrl}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Center Column: Golden Seal */}
              <div className="flex flex-col items-center justify-center flex-shrink-0">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center border border-white/20 shadow-lg shadow-amber-500/10">
                  {/* Decorative ribbon legs */}
                  <div className="absolute top-[80%] left-[10%] w-3.5 h-10 md:w-5 md:h-14 bg-amber-700 -rotate-12 origin-top rounded-b-sm pointer-events-none" />
                  <div className="absolute top-[80%] right-[10%] w-3.5 h-10 md:w-5 md:h-14 bg-amber-800 rotate-12 origin-top rounded-b-sm pointer-events-none" />
                  <span className="text-base md:text-xl text-white">★</span>
                </div>
              </div>

              {/* Right Column: Instructor Sign */}
              <div className="text-right space-y-1">
                <p className="text-base md:text-2xl font-semibold italic text-amber-400 font-serif pr-2 select-none pointer-events-none">
                  Yuvaraj Dudukuru
                </p>
                <div className="w-28 md:w-44 h-0.5 bg-slate-800/80 ml-auto" />
                <p className="text-[9px] text-slate-400">Lead Instructor, Fraylon Academy</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">
            This official certificate is stored locally and digitally verified. You can download a high-resolution print-ready copy for your professional profile.
          </p>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/15 active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download PNG (1120x800)
          </button>
        </div>

      </div>
    </div>
  );
}
