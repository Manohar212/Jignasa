import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, ExternalLink, Users, 
  Activity, Zap, 
  CheckCircle, Brain, Info, Wifi, WifiOff,
  TrendingUp, TrendingDown, Minus, ShieldAlert, Lightbulb,
  X, Calendar
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface MoodData {
  name: string;
  value: number;
  color: string;
}

interface StudentStatus {
  id: string;
  name: string;
  rollNo: string;
  emotion: 'Focused' | 'Happy' | 'Neutral' | 'Bored' | 'Confused' | 'Distracted' | 'Disengaged';
}

type Momentum = 'Improving' | 'Declining' | 'Stable';
type RiskLevel = 'Low' | 'Medium' | 'High';

const LiveLecture: React.FC = () => {
  const navigate = useNavigate();
  
  // --- State Management ---
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isConnected, setIsConnected] = useState(true); 
  const [showStartModal, setShowStartModal] = useState(false);
  
  // Live Data States
  const [studentCount, setStudentCount] = useState(42);
  const [engagementScore, setEngagementScore] = useState(78);
  const [prevEngagementScore, setPrevEngagementScore] = useState(78);
  
  // Derived Pulse Metrics
  const [momentum, setMomentum] = useState<Momentum>('Stable');
  
  // Analytics State
  const [moodData, setMoodData] = useState<MoodData[]>([
    { name: 'Focused', value: 55, color: '#10B981' }, // Emerald 500
    { name: 'Confused', value: 15, color: '#F59E0B' }, // Amber 500
    { name: 'Bored', value: 20, color: '#94A3B8' },   // Slate 400
    { name: 'Distracted', value: 10, color: '#EF4444' }, // Red 500
  ]);

  // Initial Student Data
  const initialStudents: StudentStatus[] = [
    { id: '1', name: 'Alice Johnson', rollNo: 'CS-001', emotion: 'Focused' },
    { id: '2', name: 'Bob Smith', rollNo: 'CS-002', emotion: 'Neutral' },
    { id: '3', name: 'Charlie Davis', rollNo: 'CS-003', emotion: 'Confused' },
    { id: '4', name: 'Diana Evans', rollNo: 'CS-004', emotion: 'Focused' },
    { id: '5', name: 'Evan Wright', rollNo: 'CS-005', emotion: 'Bored' },
    { id: '6', name: 'Fiona Green', rollNo: 'CS-006', emotion: 'Distracted' },
    { id: '7', name: 'George Hall', rollNo: 'CS-007', emotion: 'Focused' },
    { id: '8', name: 'Hannah Lee', rollNo: 'CS-008', emotion: 'Disengaged' },
    { id: '9', name: 'Ian Clark', rollNo: 'CS-009', emotion: 'Happy' },
    { id: '10', name: 'Jane Doe', rollNo: 'CS-010', emotion: 'Focused' },
  ];

  const [students, setStudents] = useState<StudentStatus[]>(initialStudents);

  // --- Effects ---

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Data Simulation & Polling Logic
  useEffect(() => {
    if (!isActive) return;

    const dataInterval = setInterval(() => {
      // 1. Simulate Fluctuation in Engagement
      const fluctuation = Math.floor(Math.random() * 10) - 5;
      const nextScore = Math.min(100, Math.max(0, engagementScore + fluctuation));
      
      setEngagementScore(prev => {
        setPrevEngagementScore(prev); // Store previous for momentum
        return nextScore;
      });

      // 2. Simulate Student Join/Leave
      if (Math.random() > 0.8) {
        setStudentCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }

      // 3. Simulate Mood Shifts & Update Derived Metrics
      setMoodData(prev => {
        const focused = Math.max(20, Math.min(80, prev[0].value + (Math.random() * 10 - 5)));
        const remaining = 100 - focused;
        const confused = remaining * 0.4; 
        const bored = remaining * 0.4;
        const distracted = remaining * 0.2;

        const newData = [
            { ...prev[0], value: Math.round(focused) },
            { ...prev[1], value: Math.round(confused) },
            { ...prev[2], value: Math.round(bored) },
            { ...prev[3], value: Math.round(distracted) },
        ];

        // Recalculate Logic based on new data
        calculateSmartMetrics(nextScore);

        return newData;
      });

      // 4. Simulate Individual Student Emotion Changes
      setStudents(prev => prev.map(s => {
        if (Math.random() > 0.7) { // 30% chance to change emotion
            const emotions: StudentStatus['emotion'][] = ['Focused', 'Happy', 'Neutral', 'Bored', 'Confused', 'Distracted', 'Disengaged'];
            // Weighted randomness for realism (more focused than disengaged)
            const weightedEmotions = [
                ...Array(5).fill('Focused'), 
                ...Array(3).fill('Neutral'), 
                ...Array(2).fill('Happy'),
                ...Array(2).fill('Bored'),
                'Confused', 'Distracted', 'Disengaged'
            ];
            const newEmotion = weightedEmotions[Math.floor(Math.random() * weightedEmotions.length)] as StudentStatus['emotion'];
            return { ...s, emotion: newEmotion };
        }
        return s;
      }));

    }, 3000); // Update every 3 seconds

    return () => clearInterval(dataInterval);
  }, [isActive, engagementScore]);

  // --- Helper Functions ---

  const calculateSmartMetrics = (currentScore: number) => {
      // 1. Momentum
      const diff = currentScore - prevEngagementScore;
      if (diff > 2) setMomentum('Improving');
      else if (diff < -2) setMomentum('Declining');
      else setMomentum('Stable');
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openGoogleMeet = () => {
    window.open('https://meet.google.com/new', '_blank');
  };

  const getDominantMood = () => {
      return moodData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  };

  const getEmojiForMood = (moodName: string) => {
      switch(moodName) {
          case 'Focused': return '🎯';
          case 'Confused': return '🤔';
          case 'Bored': return '🥱';
          case 'Distracted': return '👀';
          default: return '😐';
      }
  };

  // Priority Logic for Sorting: Lower number = Higher priority (Top of list)
  const getPriority = (emotion: string) => {
      switch (emotion) {
          case 'Disengaged': return 0;
          case 'Distracted': return 1;
          case 'Confused': return 1;
          case 'Bored': return 2;
          case 'Neutral': return 3;
          case 'Happy': return 4;
          case 'Focused': return 4;
          default: return 5;
      }
  };

  const getEmotionBadgeStyle = (emotion: string) => {
    switch (emotion) {
        case 'Disengaged':
        case 'Distracted': 
        case 'Confused': return 'bg-red-100 text-red-700 border-red-200';
        case 'Bored': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'Neutral': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  // Sort students: Negative emotions first
  const sortedStudents = [...students].sort((a, b) => getPriority(a.emotion) - getPriority(b.emotion));

  // --- UI Sub-Components ---

  const StatCard = ({ icon: Icon, label, value, subtext, colorClass }: any) => (
    <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900 font-serif">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-4rem)] bg-gray-50 text-gray-900 overflow-hidden font-sans relative">
      
      {/* --- LEFT PANEL: Command Center --- */}
      <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto scrollbar-hide">
        
        {/* 1. Header & Connectivity */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">Live Command Center</h1>
                <p className="text-gray-500 text-sm">Real-time emotion analytics & classroom monitoring</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isConnected ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-xs font-bold">{isConnected ? 'System Online' : 'Reconnecting...'}</span>
            </div>
        </div>

        {/* 2. Hero: Class Status Panel */}
        <div className={`relative rounded-2xl p-8 overflow-hidden shadow-sm transition-all duration-500 border border-gray-200 bg-white`}>
            {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 animate-pulse"></div>}
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left space-y-2">
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                        {isActive ? (
                             <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase rounded-md shadow-sm">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> Live Session
                             </span>
                        ) : (
                             <span className="px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold uppercase rounded-md">
                                Session Paused
                             </span>
                        )}
                        <span className="text-gray-400 text-xs font-mono font-bold uppercase tracking-wider">ID: CS-301</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">Data Structures</h2>
                    <p className="text-xl text-gray-500 font-light">Prof. Amitabh Sharma</p>
                </div>

                {/* Big Timer */}
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-5xl md:text-6xl font-mono font-bold text-[#1B3B6F] tabular-nums tracking-tighter">
                        {formatTime(timer)}
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Duration</p>
                </div>
            </div>
        </div>

        {/* 3. Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard 
                icon={Users} 
                label="Students Joined" 
                value={studentCount} 
                subtext={isActive ? "+3 in last 5m" : "Waiting to start..."}
                colorClass="text-blue-600" 
            />
            <StatCard 
                icon={Brain} 
                label="Avg. Engagement" 
                value={`${engagementScore}%`} 
                subtext="Last 30 seconds"
                colorClass={engagementScore > 70 ? "text-emerald-600" : engagementScore > 50 ? "text-amber-600" : "text-red-600"} 
            />
        </div>

        {/* 4. Live Student Emotion Monitor Table (Replaced Pulse Section) */}
        <div className="bg-white border border-gray-200 rounded-xl p-0 shadow-sm flex-1 min-h-[300px] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#1B3B6F]" /> 
                    Live Student Emotion Monitor
                 </h3>
                 <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                    {studentCount} Active
                 </span>
            </div>

            <div className="overflow-y-auto flex-1 p-0">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Current Emotion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sortedStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-3 font-bold text-gray-900 text-sm">{student.name}</td>
                                <td className="px-6 py-3 text-sm text-gray-500 font-mono">{student.rollNo}</td>
                                <td className="px-6 py-3 text-right">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getEmotionBadgeStyle(student.emotion)}`}>
                                        {student.emotion}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-center text-gray-400 font-medium">
                List automatically prioritizes students requiring attention
            </div>
        </div>

      </div>

      {/* --- RIGHT PANEL: Analytics & Controls --- */}
      <div className="w-full xl:w-[400px] bg-white border-l border-gray-200 flex flex-col p-6 gap-6 overflow-y-auto z-10 shadow-lg">
        
        {/* Removed Alerts Section */}

        {/* 1. Mood Distribution Chart (Flexible Layout) */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex-1 flex flex-col min-h-[320px]">
            <h3 className="text-center text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Real-time Emotion Distribution</h3>
            
            <div className="flex-1 w-full relative min-h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={moodData}
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {moodData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-900 font-serif">{getDominantMood().value}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{getDominantMood().name}</span>
                </div>
            </div>
            
            {/* Compact 2x2 Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                {moodData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-gray-600 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-400">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>

        {/* 2. Session Controls */}
        <div className="mt-auto space-y-3 pb-2">
            <div className="grid grid-cols-2 gap-3">
                {!isActive ? (
                    <button 
                        onClick={() => setShowStartModal(true)}
                        className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        <Play className="w-4 h-4 fill-current" /> START SESSION
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={() => setIsActive(false)}
                            className="py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                        >
                            <Pause className="w-4 h-4 fill-current" /> PAUSE
                        </button>
                        <button 
                            onClick={() => { setIsActive(false); setTimer(0); navigate('/faculty/dashboard'); }}
                            className="py-3 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Square className="w-4 h-4 fill-current" /> END
                        </button>
                    </>
                )}
            </div>

            <button 
                onClick={openGoogleMeet}
                className="w-full py-3 bg-[#2C4C88] hover:bg-[#1B3B6F] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md group border border-blue-800"
            >
                <div className="p-1 bg-white rounded-full">
                    <img src="https://www.gstatic.com/meet/google_meet_primary_horizontal_2020q4_865efcdb92d67c50402b8b90740954b3.svg" className="w-3 h-3" alt="GMeet" /> 
                </div>
                Open Google Meet
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>

      </div>

      {/* Start Session Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 relative z-10">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Start Live Session</h2>
                    <button 
                        onClick={() => setShowStartModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Pre-Scheduled */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pre-Scheduled Lectures</h3>
                        <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group bg-white">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">Data Structures & Algorithms</h4>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Today, 10:00 AM - 11:30 AM
                                </p>
                            </div>
                            <button 
                                onClick={() => { setIsActive(true); setShowStartModal(false); }}
                                className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition-all transform active:scale-95"
                            >
                                Start This
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Instant */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Start Instant Lecture</h3>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Enter new topic name..." 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                            />
                            <button 
                                onClick={() => { setIsActive(true); setShowStartModal(false); }}
                                className="w-full py-3 bg-[#2C4C88] text-white font-bold rounded-lg hover:bg-[#1B3B6F] shadow-lg shadow-blue-900/10 transition-colors flex items-center justify-center gap-2 transform active:scale-95"
                            >
                                <Zap className="w-4 h-4 fill-current" /> Go Live Instantly
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <button 
                        onClick={() => setShowStartModal(false)}
                        className="text-gray-500 font-bold hover:text-gray-800 text-sm transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            
            {/* Backdrop Click */}
            <div className="absolute inset-0 -z-10" onClick={() => setShowStartModal(false)}></div>
        </div>
      )}

    </div>
  );
};

export default LiveLecture;