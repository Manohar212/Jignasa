import React from 'react';
import { Calendar, Clock, Video, BookOpen, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClassSession {
  id: string;
  subject: string;
  faculty: string;
  time: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  room?: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dummy Data for Demo
  const classes: ClassSession[] = [
    {
      id: '1',
      subject: 'Data Structures & Algorithms',
      faculty: 'Prof. Alan Smith',
      time: '09:00 AM - 10:30 AM',
      status: 'LIVE',
      room: 'Virtual Room 1'
    },
    {
      id: '2',
      subject: 'Database Management Systems',
      faculty: 'Dr. Sarah Jenkins',
      time: '11:00 AM - 12:30 PM',
      status: 'UPCOMING',
      room: 'Virtual Room 3'
    },
    {
      id: '3',
      subject: 'Operating Systems',
      faculty: 'Prof. Rajesh Kumar',
      time: 'Yesterday',
      status: 'COMPLETED'
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome back, John.</h1>
        <p className="text-gray-500">Here are your scheduled classes for today.</p>
      </header>

      <div className="space-y-4">
        {classes.map((session) => (
          <div 
            key={session.id} 
            className={`
              relative overflow-hidden bg-white rounded-xl border transition-all duration-200
              ${session.status === 'LIVE' ? 'border-blue-200 shadow-lg shadow-blue-900/5' : 'border-gray-200 shadow-sm'}
            `}
          >
            {/* Live Indicator Strip */}
            {session.status === 'LIVE' && (
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
            )}

            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              {/* Icon / Time Column */}
              <div className="flex flex-col items-center justify-center w-full md:w-auto md:min-w-[120px] text-center gap-2">
                <div className={`
                  p-3 rounded-full 
                  ${session.status === 'LIVE' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}
                `}>
                  {session.status === 'LIVE' ? <Video className="w-6 h-6 animate-pulse" /> : <Calendar className="w-6 h-6" />}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{session.time}</span>
              </div>

              {/* Info Column */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 font-serif">{session.subject}</h3>
                  {session.status === 'LIVE' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                      Live
                    </span>
                  )}
                </div>
                <p className="text-gray-500 font-medium">{session.faculty}</p>
                {session.room && <p className="text-xs text-gray-400 mt-1">{session.room}</p>}
              </div>

              {/* Action Column */}
              <div className="w-full md:w-auto min-w-[160px]">
                {session.status === 'LIVE' ? (
                  <button 
                    onClick={() => navigate(`/student/lecture/${session.id}`)}
                    className="w-full py-3 px-6 bg-[#2C4C88] hover:bg-[#1B3B6F] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    Join Class <ChevronRight className="w-4 h-4" />
                  </button>
                ) : session.status === 'UPCOMING' ? (
                  <button disabled className="w-full py-3 px-6 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" /> Not Started
                  </button>
                ) : (
                  <button disabled className="w-full py-3 px-6 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Helper / Info Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
        <Lock className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900">Privacy Notice</h4>
          <p className="text-sm text-blue-700 mt-1">
            When you join a live class, Jignasa uses your camera to anonymously track engagement metrics. 
            No video is ever stored or streamed to the faculty. The faculty only sees aggregate class mood data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;