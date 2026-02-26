import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface FacialRegistrationProps {
  userName: string;
  onComplete: (photoUrl: string) => void;
}

export default function FacialRegistration({ userName, onComplete }: FacialRegistrationProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (isCapturing && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCapturing, stream]);

  const startCamera = async () => {
    try {
      // Clean up previous stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCapturing(true);
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      setIsCapturing(false);
      alert("Não foi possível acessar a câmera. Verifique se o navegador tem permissão para usar a câmera.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPhoto(dataUrl);
        
        // Stop stream
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsCapturing(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl text-center space-y-8">
      <div className="space-y-2">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Registro de Identidade Biométrica</h2>
        <p className="text-slate-500">Olá, <strong>{userName}</strong>. Para garantir a integridade das certificações, precisamos criar seu template de reconhecimento facial.</p>
      </div>

      <div className="relative aspect-video bg-slate-100 rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
        {photo ? (
          <img src={photo} alt="Captura" className="w-full h-full object-cover" />
        ) : isCapturing ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-400 flex flex-col items-center gap-4">
            <Camera size={48} />
            <p className="text-sm font-medium">A câmera será ativada para capturar sua foto</p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-3 text-left">
        <AlertCircle className="text-amber-600 shrink-0" size={20} />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Atenção:</strong> Esta foto será utilizada para validar sua identidade durante as avaliações. Certifique-se de estar em um local iluminado e sem acessórios que cubram o rosto.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          {!photo ? (
            !isCapturing ? (
              <button 
                onClick={startCamera}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Ativar Câmera
              </button>
            ) : (
              <button 
                onClick={capturePhoto}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
              >
                Capturar Foto
              </button>
            )
          ) : (
            <>
              <button 
                onClick={() => { setPhoto(null); startCamera(); }}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Tirar Outra
              </button>
              <button 
                onClick={() => onComplete(photo)}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                Finalizar Registro
              </button>
            </>
          )}
        </div>
        
        {!photo && !isCapturing && (
          <button 
            onClick={() => onComplete('https://i.pravatar.cc/150?u=demo')}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
          >
            Pular Biometria (Apenas para Demonstração)
          </button>
        )}
      </div>
    </div>
  );
}
