import React from 'react';
import { RefreshCw, Users, BookOpen, Smile } from 'lucide-react';

const FacultyAnalytics: React.FC = () => {

  const lectureHistory = [
      { topic: "Introduction to Neural Networks", date: "Oct 22, 2023", time: "10:30 AM", room: "Hall B", module: "Module 4", participation: 88, status: "Highly Active Discussion", statusColor: "bg-green-100 text-green-700" },
      { topic: "Cloud Infrastructure Setup", date: "Oct 20, 2023", time: "02:00 PM", room: "Virtual", module: "Module 3", participation: 45, status: "Complex Topic • Support Needed", statusColor: "bg-yellow-100 text-yellow-700" },
      { topic: "Database Indexing Deep Dive", date: "Oct 18, 2023", time: "09:00 AM", room: "Hall A", module: "Module 2", participation: 92, status: "Peak Focus Session", statusColor: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Filter Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Group</label>
                <div className="relative">
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-[#1B3B6F] outline-none appearance-none text-gray-700 font-medium">
                        <option>CS-2024-A (Sophomores)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Student</label>
                <div className="relative">
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-[#1B3B6F] outline-none appearance-none text-gray-700 font-medium">
                        <option>All Students</option>
                        <option>John Doe</option>
                        <option>Jane Smith</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>
            <button className="px-6 py-3 bg-[#2C4C88] text-white font-bold rounded-lg hover:bg-[#1B3B6F] shadow-md flex items-center justify-center gap-2 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Generate Analytics
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <Users className="w-8 h-8" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-serif italic mb-1">Attendance Rate</p>
                <h3 className="text-4xl font-serif font-bold text-gray-900">94.2%</h3>
            </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                <Smile className="w-8 h-8" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-serif italic mb-1">Dominant Mood</p>
                <h3 className="text-4xl font-serif font-bold text-gray-900">Focused</h3>
            </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1B3B6F]">
                <BookOpen className="w-8 h-8" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-serif italic mb-1">Lecture Count</p>
                <h3 className="text-4xl font-serif font-bold text-gray-900">34 <span className="text-xl text-gray-400">/ 36</span></h3>
            </div>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[#1B3B6F] font-bold">
                <BookOpen className="w-5 h-5" />
                <h3>Lecture History Log</h3>
            </div>
         </div>

         <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[800px]">
                 <thead className="bg-gray-50 border-b border-gray-100">
                     <tr>
                         <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Topic / Session</th>
                         <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
                         <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-48">Participation</th>
                         <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Engagement Insight</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {lectureHistory.map((row, idx) => (
                         <tr key={idx} className="hover:bg-gray-50 transition-colors">
                             <td className="px-8 py-6">
                                 <p className="font-bold text-gray-900">{row.topic}</p>
                                 <p className="text-xs text-gray-500 mt-1">{row.room} • {row.module}</p>
                             </td>
                             <td className="px-6 py-6 text-sm text-gray-500 font-mono">
                                 {row.date} • {row.time}
                             </td>
                             <td className="px-6 py-6">
                                 <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                     <div 
                                        className={`h-2 rounded-full ${row.participation > 90 ? 'bg-green-600' : row.participation > 80 ? 'bg-[#3B5D95]' : 'bg-yellow-500'}`}
                                        style={{ width: `${row.participation}%` }}
                                     ></div>
                                 </div>
                                 <span className="text-xs font-bold text-gray-500">{row.participation}% {row.participation > 85 ? 'High' : row.participation > 60 ? 'Moderate' : 'Low'}</span>
                             </td>
                             <td className="px-6 py-6">
                                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${row.statusColor}`}>
                                     ● {row.status}
                                 </span>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>

    </div>
  );
};

export default FacultyAnalytics;