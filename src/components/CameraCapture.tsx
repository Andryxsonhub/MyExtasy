// src/components/CameraCapture.tsx

import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';

interface CameraCaptureProps {
  onPhotoTaken: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoTaken }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCapturedImage(null);
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        onPhotoTaken(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="border border-border rounded-md overflow-hidden">
        {capturedImage ? (
          <img src={capturedImage} alt="Foto capturada" className="w-full h-auto" />
        ) : (
          <video ref={videoRef} autoPlay className="w-full h-auto" />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {!stream && !capturedImage && (
        <Button onClick={startCamera}>
          Iniciar Câmera
        </Button>
      )}
      {stream && !capturedImage && (
        <Button onClick={takePhoto}>
          Tirar Foto
        </Button>
      )}
      {capturedImage && (
        <Button onClick={startCamera}>
          Tirar Outra Foto
        </Button>
      )}
    </div>
  );
};

export default CameraCapture;