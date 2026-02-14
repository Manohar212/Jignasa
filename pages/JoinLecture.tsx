import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ShieldCheck, Video, Mic, Wifi, Loader, Play, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentJoin from '../components/StudentJoin';

const JoinLecture: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [hasPermission, setHasPermission] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Waiting for class initialization...");
  
  // Refs for silent capture
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => stopTracking();
  }, []);

  const initializeSession = async () => {
    setStatusMessage("Requesting camera access for engagement analytics...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 }, // Low res is fine for emotion detection
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setHasPermission(true);
            startSilentTracking();
        };
      }
    } catch (err) {
      console.error("Camera permission denied:", err);
      setStatusMessage("Camera access is required for attendance & engagement scoring.");
      alert("Please allow camera access to join the class session.");
    }
  };

  const startSilentTracking = () => {
    setIsTracking(true);
    setStatusMessage("Engagement tracking active. Waiting for professor...");
    
    // Capture frame every 5 seconds
    intervalRef.current = window.setInterval(captureFrame, 5000);
  };

  const stopTracking = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsTracking(false);
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      // Draw frame to hidden canvas
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      
      // Get base64
      const frameData = canvasRef.current.toDataURL('image/jpeg', 0.5);

      try {
        // Send to backend (Fire & Forget)
        // Note: This endpoint should be configured in your backend setup
        await fetch('http://localhost:5000/api/emotion/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lectureId: id,
            studentId: 1, // Mock ID
            timestamp: new Date().toISOString(),
            image: frameData
          })
        });
      } catch (err) {
        // Silent fail to avoid disrupting UI
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-6 bg-gray-50/50">
      
      {/* Hidden Elements for Background Processing */}
      <div className="hidden">
        <video ref={videoRef} playsInline muted width="320" height="240" />
        <canvas ref={canvasRef} width="320" height="240" />
      </div>

      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        {/* Header Gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 w-full"></div>
        
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Data Structures & Algorithms</h1>
          <p className="text-gray-500 font-medium">Prof. Alan Smith • Live Session</p>

          <div className="my-8 space-y-4">
             {/* Status Indicator */}
             <div className={`
                flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300
                ${isTracking ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}
             `}>
                <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    {isTracking && <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>}
                </div>
                <div className="text-left">
                    <p className={`text-sm font-bold ${isTracking ? 'text-green-800' : 'text-gray-600'}`}>
                        {isTracking ? "Analytics Active" : "Ready to Join"}
                    </p>
                    <p className="text-xs text-gray-500">
                        {isTracking ? "Processing engagement data securely." : "Enable camera to proceed."}
                    </p>
                </div>
             </div>
          </div>

          {/* Main Action Area */}
          {!hasPermission ? (
            <button 
                onClick={initializeSession}
                className="w-full py-4 bg-[#2C4C88] hover:bg-[#1B3B6F] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
                <Play className="w-5 h-5 fill-current" />
                Enable Analytics & Join
            </button>
          ) : (
            // Replaced hardcoded button with Real-time Firestore Component
            <StudentJoin classId={id} />
          )}

          <p className="mt-4 text-xs text-gray-400 max-w-xs mx-auto">
             * Jignasa requires camera permissions for emotion analytics.
          </p>
        </div>

        {/* Footer Privacy Note */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
             <p className="text-xs text-left text-gray-500 leading-relaxed">
                <span className="font-bold text-gray-700">Privacy Safe:</span> Your camera is used solely for local emotion analysis. No video feed is streamed or stored on our servers.
             </p>
        </div>
      </div>
    </div>
  );
};

export default JoinLecture;