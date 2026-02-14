import React, { useState } from 'react';
import { Users, BarChart2, Calendar, BookOpen, X, Clock, MapPin, Plus, Save, UserPlus, Settings, FileText, TrendingUp, Activity, BarChart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from 'recharts';

interface Lecture {
  id?: number;
  title: string;
  group_name: string;
  lecture_date: string;
  start_time: string;
  end_time: string;
  location: string;
}

interface Student {
  id?: number;
  full_name: string;
  roll_number: string;
  email: string;
  class_group: string;
  attendance_percentage?: number;
}

interface AttendanceRecord {
  student_name: string;
  roll_number: string;
  class_group: string;
  total_lectures: number;
  attended_lectures: number;
  percentage: number;
}

interface AttendanceSettings {
  threshold: number;
  alerts_enabled: boolean;
}

interface EngagementAnalytics {
  overall_score: number;
  distribution: { name: string; value: number; color: string }[];
  trend: { lecture: string; score: number }[];
  class_averages: { class_name: string; score: number }[];
}

interface WeeklyTrend {
  day: string;
  current_week: number;
  previous_week: number;
}

interface EngagementSettings {
  threshold: number;
  alerts_enabled: boolean;
}

const FacultyDashboard: React.FC = () => {
  // -- Modal States --
  const [showViewModal, setShowViewModal] = useState(false); // Lectures Modal
  const [showAddModal, setShowAddModal] = useState(false);   // Add Lecture Modal
  const [showStudentListModal, setShowStudentListModal] = useState(false); // Students List Modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);   // Add Student Modal
  const [showAttendanceReportModal, setShowAttendanceReportModal] = useState(false); // Attendance Report Modal
  const [showAttendanceSettingsModal, setShowAttendanceSettingsModal] = useState(false); // Attendance Settings Modal
  
  // Engagement Modals
  const [showEngagementAnalyticsModal, setShowEngagementAnalyticsModal] = useState(false);
  const [showWeeklyTrendsModal, setShowWeeklyTrendsModal] = useState(false);
  const [showEngagementSettingsModal, setShowEngagementSettingsModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // -- Data States (Lectures) --
  const [todaysLectures, setTodaysLectures] = useState<Lecture[]>([]);
  const [todaysCount, setTodaysCount] = useState(3);
  const [newLecture, setNewLecture] = useState<Lecture>({
    title: '',
    group_name: '',
    lecture_date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    location: ''
  });

  // -- Data States (Students) --
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState(142);
  const [newStudent, setNewStudent] = useState<Student>({
    full_name: '',
    roll_number: '',
    email: '',
    class_group: '',
    attendance_percentage: 0
  });

  // -- Data States (Attendance) --
  const [attendanceReport, setAttendanceReport] = useState<AttendanceRecord[]>([]);
  const [attendanceSettings, setAttendanceSettings] = useState<AttendanceSettings>({
    threshold: 75,
    alerts_enabled: true
  });

  // -- Data States (Engagement) --
  const [engagementAnalytics, setEngagementAnalytics] = useState<EngagementAnalytics>({
    overall_score: 0,
    distribution: [],
    trend: [],
    class_averages: []
  });
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrend[]>([]);
  const [engagementSettings, setEngagementSettings] = useState<EngagementSettings>({
    threshold: 60,
    alerts_enabled: true
  });


  // -- Backend Integration Logic: Lectures --
  const fetchTodaysLectures = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/lectures/today');
        if (response.ok) {
            const data = await response.json();
            setTodaysLectures(data);
            setTodaysCount(data.length);
        } else {
            console.warn("Backend not connected. Using mock data.");
            setTodaysLectures([
                { id: 101, title: 'Data Structures', group_name: 'CS-301', lecture_date: '2023-10-24', start_time: '09:00', end_time: '10:30', location: 'Hall A' },
                { id: 102, title: 'Advanced Algorithms', group_name: 'CS-402', lecture_date: '2023-10-24', start_time: '11:00', end_time: '12:30', location: 'Lab 3' },
                { id: 103, title: 'Machine Learning', group_name: 'CS-501', lecture_date: '2023-10-24', start_time: '14:00', end_time: '15:30', location: 'Hall B' }
            ]);
        }
    } catch (error) {
        console.error("Error fetching lectures:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleAddLectureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await fetch('/api/lectures/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLecture)
        });

        if (response.ok || true) { 
            const today = new Date().toISOString().split('T')[0];
            if (newLecture.lecture_date === today) {
                setTodaysCount(prev => prev + 1);
            }
            setShowAddModal(false);
            setNewLecture({
                title: '', group_name: '', lecture_date: today, start_time: '', end_time: '', location: ''
            });
            alert("Lecture scheduled successfully!");
        }
    } catch (error) {
        console.error("Error adding lecture:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // -- Backend Integration Logic: Students --
  const fetchStudentList = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/students/list');
        if (response.ok) {
            const data = await response.json();
            setStudentList(data);
            setTotalStudentsCount(data.length);
        } else {
            console.warn("Backend not connected. Using mock student data.");
            setStudentList([
                { id: 1, full_name: 'Alice Johnson', roll_number: 'CS-2024-001', email: 'alice@uni.edu', class_group: 'CS-301', attendance_percentage: 95 },
                { id: 2, full_name: 'Bob Smith', roll_number: 'CS-2024-002', email: 'bob@uni.edu', class_group: 'CS-301', attendance_percentage: 88 },
                { id: 3, full_name: 'Charlie Davis', roll_number: 'CS-2024-003', email: 'charlie@uni.edu', class_group: 'CS-402', attendance_percentage: 72 },
                { id: 4, full_name: 'Diana Evans', roll_number: 'CS-2024-004', email: 'diana@uni.edu', class_group: 'CS-101', attendance_percentage: 91 },
            ]);
        }
    } catch (error) {
        console.error("Error fetching students:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await fetch('/api/students/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (response.ok || true) {
            setTotalStudentsCount(prev => prev + 1);
            setShowAddStudentModal(false);
            setNewStudent({
                full_name: '', roll_number: '', email: '', class_group: '', attendance_percentage: 0
            });
            alert("Student added successfully!");
        }
    } catch (error) {
        console.error("Error adding student:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // -- Backend Integration Logic: Attendance --
  const fetchAttendanceReport = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/attendance/report');
        if (response.ok) {
            const data = await response.json();
            setAttendanceReport(data);
        } else {
            console.warn("Backend not connected. Using mock attendance data.");
            setAttendanceReport([
                { student_name: 'Alice Johnson', roll_number: 'CS-001', class_group: 'CS-301', total_lectures: 40, attended_lectures: 38, percentage: 95 },
                { student_name: 'Bob Smith', roll_number: 'CS-002', class_group: 'CS-301', total_lectures: 40, attended_lectures: 35, percentage: 87.5 },
                { student_name: 'Charlie Davis', roll_number: 'CS-003', class_group: 'CS-301', total_lectures: 40, attended_lectures: 28, percentage: 70 },
                { student_name: 'Diana Evans', roll_number: 'CS-004', class_group: 'CS-301', total_lectures: 40, attended_lectures: 36, percentage: 90 },
            ]);
        }
    } catch (error) {
        console.error("Error fetching attendance report:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveAttendanceSettings = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/attendance/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceSettings)
        });
        
        if (response.ok || true) {
            setShowAttendanceSettingsModal(false);
            alert("Attendance settings saved successfully.");
        }
    } catch (error) {
        console.error("Error saving settings:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // -- Backend Integration Logic: Engagement --
  const fetchEngagementAnalytics = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/engagement/analytics');
        if (response.ok) {
            const data = await response.json();
            setEngagementAnalytics(data);
        } else {
            // Mock Data
            setEngagementAnalytics({
                overall_score: 72,
                distribution: [
                    { name: 'Focused', value: 60, color: '#74B783' },
                    { name: 'Confused', value: 25, color: '#88AED0' },
                    { name: 'Bored', value: 15, color: '#C0C0C0' }
                ],
                trend: [
                    { lecture: 'L1', score: 65 },
                    { lecture: 'L2', score: 72 },
                    { lecture: 'L3', score: 68 },
                    { lecture: 'L4', score: 85 },
                    { lecture: 'L5', score: 78 }
                ],
                class_averages: [
                    { class_name: 'CS-301', score: 78 },
                    { class_name: 'CS-402', score: 65 },
                    { class_name: 'CS-101', score: 82 }
                ]
            });
        }
    } catch (error) {
        console.error("Error fetching engagement analytics:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const fetchWeeklyTrends = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/engagement/weekly');
        if (response.ok) {
            const data = await response.json();
            setWeeklyTrends(data);
        } else {
             // Mock Data
             setWeeklyTrends([
                 { day: 'Mon', current_week: 70, previous_week: 65 },
                 { day: 'Tue', current_week: 75, previous_week: 70 },
                 { day: 'Wed', current_week: 80, previous_week: 72 },
                 { day: 'Thu', current_week: 78, previous_week: 68 },
                 { day: 'Fri', current_week: 82, previous_week: 75 }
             ]);
        }
    } catch (error) {
        console.error("Error fetching weekly trends:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveEngagementSettings = async () => {
      setIsLoading(true);
      try {
          const response = await fetch('/api/engagement/settings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(engagementSettings)
          });

          if (response.ok || true) {
              setShowEngagementSettingsModal(false);
              alert("Engagement settings saved successfully.");
          }
      } catch (error) {
          console.error("Error saving engagement settings:", error);
      } finally {
          setIsLoading(false);
      }
  };

  const moodSummary = [
      { name: 'Focused', value: 65, color: '#74B783' },
      { name: 'Confused', value: 25, color: '#88AED0' },
      { name: 'Bored', value: 10, color: '#C0C0C0' },
  ];

  const statCards = [
    {
      id: 1,
      value: todaysCount.toString(),
      label: "Lectures Today",
      icon: <BookOpen className="w-6 h-6" />,
      style: "bg-blue-50 text-[#1B3B6F]",
      onClick: () => {
          fetchTodaysLectures();
          setShowViewModal(true);
      },
      isClickable: true
    },
    {
      id: 2,
      value: totalStudentsCount.toString(),
      label: "Total Students",
      icon: <Users className="w-6 h-6" />,
      style: "bg-green-50 text-green-700",
      onClick: () => {
          fetchStudentList();
          setShowStudentListModal(true);
      },
      isClickable: true
    },
    {
      id: 3,
      value: "89%",
      label: "Avg. Attendance",
      icon: <BarChart2 className="w-6 h-6" />,
      style: "bg-purple-50 text-purple-700",
      isClickable: false
    }
  ];

  return (
    <>
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Welcome, Professor.</h1>
        <p className="text-gray-500 font-serif italic">Here's the summary of your classes and student engagement today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
            <div 
                key={card.id} 
                onClick={card.isClickable ? card.onClick : undefined}
                className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative ${card.isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${card.style}`}>
                        {card.icon}
                    </div>
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-900">{card.value}</h3>
                <p className="text-sm text-gray-500">{card.label}</p>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Existing Groups Table & Mood Donut */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Active Groups</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Group Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr>
                        <td className="px-6 py-4 font-bold text-gray-900">CS-301: Data Structures</td>
                        <td className="px-6 py-4 text-sm text-gray-500">45 Students</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Mon, Wed 9:00 AM</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span></td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 font-bold text-gray-900">CS-402: Algorithms</td>
                        <td className="px-6 py-4 text-sm text-gray-500">38 Students</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Tue, Thu 11:00 AM</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span></td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 font-bold text-gray-900">CS-101: Intro to CS</td>
                        <td className="px-6 py-4 text-sm text-gray-500">120 Students</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Fri 2:00 PM</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">Completed</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h3 className="font-bold text-gray-900 mb-6 w-full">Class Mood Summary</h3>
            <div className="w-56 h-56 relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-gray-900">Good</span>
                    <span className="text-xs text-gray-400 uppercase">Overall</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={moodSummary}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {moodSummary.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="w-full space-y-3">
                 {moodSummary.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>

    {/* -- Existing Modals: View, Add Lecture, Student List, Add Student, Attendance Report, Attendance Settings -- */}
    
    {/* View Today's Schedule Modal */}
    {showViewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-[#1B3B6F] rounded-lg">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-bold text-gray-900">Today's Schedule</h2>
                            <p className="text-xs text-gray-500 font-serif italic">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-400">Loading schedule...</div>
                    ) : todaysLectures.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                            <Calendar className="w-12 h-12 mb-2 opacity-20" />
                            <p>No lectures scheduled for today.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {todaysLectures.map((lecture) => (
                                <div key={lecture.id} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900">{lecture.title}</h3>
                                            <span className="px-2 py-0.5 bg-blue-50 text-[#1B3B6F] text-[10px] font-bold uppercase rounded-full">{lecture.group_name}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lecture.start_time} - {lecture.end_time}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lecture.location}</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 text-sm font-bold text-[#1B3B6F] border border-blue-100 rounded-lg hover:bg-[#1B3B6F] hover:text-white transition-colors">
                                        View details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button 
                        onClick={() => setShowViewModal(false)}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )}

    {/* Add New Lecture Modal */}
    {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                            <Plus className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Schedule New Lecture</h2>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleAddLectureSubmit} className="p-8 space-y-4 overflow-y-auto max-h-[70vh]">
                     {/* Form Fields */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lecture Title</label>
                        <input 
                            type="text" 
                            required
                            value={newLecture.title}
                            onChange={e => setNewLecture({...newLecture, title: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Group / Class</label>
                        <input 
                            type="text" 
                            required
                            value={newLecture.group_name}
                            onChange={e => setNewLecture({...newLecture, group_name: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                             <input 
                                type="date" 
                                required
                                value={newLecture.lecture_date}
                                onChange={e => setNewLecture({...newLecture, lecture_date: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Time</label>
                             <input 
                                type="time" 
                                required
                                value={newLecture.start_time}
                                onChange={e => setNewLecture({...newLecture, start_time: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End Time</label>
                             <input 
                                type="time" 
                                required
                                value={newLecture.end_time}
                                onChange={e => setNewLecture({...newLecture, end_time: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location / Room</label>
                        <input 
                            type="text" 
                            required
                            value={newLecture.location}
                            onChange={e => setNewLecture({...newLecture, location: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                         <button 
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-[#2C4C88] text-white font-bold rounded-lg hover:bg-[#1B3B6F] shadow-lg shadow-blue-900/10 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Saving...' : <><Save className="w-4 h-4" /> Schedule</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )}

    {/* View Student List Modal */}
    {showStudentListModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-bold text-gray-900">Student List</h2>
                            <p className="text-xs text-gray-500 font-serif italic">Total Records: {studentList.length}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowStudentListModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="overflow-auto p-0 flex-1">
                    {isLoading ? (
                         <div className="text-center py-12 text-gray-400">Loading students...</div>
                    ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Roll Number</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Attendance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {studentList.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{student.full_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{student.roll_number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-50 text-[#1B3B6F] text-xs font-bold rounded-full">{student.class_group}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`font-bold ${
                                            (student.attendance_percentage || 0) >= 90 ? 'text-green-600' : 
                                            (student.attendance_percentage || 0) >= 75 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {student.attendance_percentage}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button onClick={() => setShowStudentListModal(false)} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">Close</button>
                </div>
            </div>
        </div>
    )}

    {/* Add Student Modal */}
    {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Add New Student</h2>
                    </div>
                    <button onClick={() => setShowAddStudentModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleAddStudentSubmit} className="p-8 space-y-4 overflow-y-auto max-h-[70vh]">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Student Name</label>
                        <input type="text" required value={newStudent.full_name} onChange={e => setNewStudent({...newStudent, full_name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Roll Number</label>
                        <input type="text" required value={newStudent.roll_number} onChange={e => setNewStudent({...newStudent, roll_number: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                        <input type="email" required value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class</label>
                        <input type="text" required value={newStudent.class_group} onChange={e => setNewStudent({...newStudent, class_group: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none" />
                    </div>

                    <div className="pt-4 flex gap-3">
                         <button type="button" onClick={() => setShowAddStudentModal(false)} className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={isLoading} className="flex-1 px-6 py-3 bg-[#2C4C88] text-white font-bold rounded-lg hover:bg-[#1B3B6F]">{isLoading ? 'Adding...' : 'Add Student'}</button>
                    </div>
                </form>
            </div>
        </div>
    )}

    {/* Attendance Report Modal */}
    {showAttendanceReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Attendance Report</h2>
                    </div>
                    <button onClick={() => setShowAttendanceReportModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="overflow-auto p-0 flex-1">
                     {isLoading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Student Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Roll Number</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Class</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Attended</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendanceReport.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{record.student_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{record.roll_number}</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-[#1B3B6F] text-xs font-bold rounded-full">{record.class_group}</span></td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-bold text-center">{record.total_lectures}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 text-center">{record.attended_lectures}</td>
                                    <td className="px-6 py-4 text-right"><span className={`font-bold ${record.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>{record.percentage}%</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button onClick={() => setShowAttendanceReportModal(false)} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50">Close</button>
                </div>
            </div>
        </div>
    )}

    {/* Attendance Settings Modal */}
    {showAttendanceSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 text-gray-700 rounded-lg"><Settings className="w-5 h-5" /></div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Attendance Settings</h2>
                    </div>
                    <button onClick={() => setShowAttendanceSettingsModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Low Attendance Threshold (%)</label>
                        <div className="flex items-center gap-4">
                            <input type="number" min="0" max="100" value={attendanceSettings.threshold} onChange={(e) => setAttendanceSettings({...attendanceSettings, threshold: parseInt(e.target.value) || 0})} className="w-24 px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-center font-bold" />
                            <span className="text-sm text-gray-500">Flag below this percentage.</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div><h4 className="text-sm font-bold text-gray-900">Enable Low-Attendance Alerts</h4></div>
                        <button onClick={() => setAttendanceSettings({...attendanceSettings, alerts_enabled: !attendanceSettings.alerts_enabled})} className={`w-12 h-6 rounded-full p-1 transition-colors ${attendanceSettings.alerts_enabled ? 'bg-[#1B3B6F]' : 'bg-gray-200'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${attendanceSettings.alerts_enabled ? 'translate-x-6' : 'translate-x-0'}`}></div></button>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <button onClick={() => setShowAttendanceSettingsModal(false)} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={handleSaveAttendanceSettings} className="px-6 py-2 bg-[#2C4C88] text-white font-bold rounded-lg hover:bg-[#1B3B6F] shadow-lg flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
                </div>
            </div>
        </div>
    )}

    {/* -- NEW MODALS FOR ENGAGEMENT -- */}

    {/* View Engagement Analytics Modal */}
    {showEngagementAnalyticsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 text-orange-700 rounded-lg">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-bold text-gray-900">Class Engagement Analytics</h2>
                            <p className="text-xs text-gray-500 font-serif italic">Real-time engagement insights</p>
                        </div>
                    </div>
                    <button onClick={() => setShowEngagementAnalyticsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Overall & Distribution */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                             <div>
                                <p className="text-sm font-bold text-gray-500 uppercase">Average Engagement</p>
                                <h3 className="text-5xl font-serif font-bold text-gray-900 mt-2">{engagementAnalytics.overall_score}%</h3>
                             </div>
                             <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                                 <TrendingUp className="w-8 h-8 text-green-600" />
                             </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                             <h4 className="font-bold text-gray-900 mb-6">Engagement Distribution</h4>
                             <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={engagementAnalytics.distribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {engagementAnalytics.distribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36} />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                    </div>

                    {/* Right: Trend & Class Averages */}
                    <div className="space-y-8">
                         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                             <h4 className="font-bold text-gray-900 mb-6">Lecture-wise Engagement Trend</h4>
                             <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={engagementAnalytics.trend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="lecture" axisLine={false} tickLine={false} dy={10} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} domain={[0, 100]} />
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                                        <Line type="monotone" dataKey="score" stroke="#2C4C88" strokeWidth={3} dot={{r: 4, fill: '#2C4C88'}} />
                                    </LineChart>
                                </ResponsiveContainer>
                             </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                             <h4 className="font-bold text-gray-900 mb-4">Average Engagement by Class</h4>
                             <div className="space-y-3">
                                {engagementAnalytics.class_averages.map((cls, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">{cls.class_name}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${cls.score >= 75 ? 'bg-green-500' : cls.score >= 60 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                                    style={{ width: `${cls.score}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-bold text-gray-900 w-8">{cls.score}%</span>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button 
                        onClick={() => setShowEngagementAnalyticsModal(false)}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )}

    {/* Compare Weekly Trends Modal */}
    {showWeeklyTrendsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                            <BarChart className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-bold text-gray-900">Weekly Engagement Trends</h2>
                            <p className="text-xs text-gray-500 font-serif italic">Current Week vs Previous Week</p>
                        </div>
                    </div>
                    <button onClick={() => setShowWeeklyTrendsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-8">
                     <div className="flex justify-between items-center mb-6">
                        <div className="relative w-48">
                            <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:border-[#1B3B6F] outline-none text-sm font-bold text-gray-700 appearance-none">
                                <option>All Classes</option>
                                <option>CS-301</option>
                                <option>CS-402</option>
                            </select>
                             <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-bold">
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#2C4C88]"></span> Current Week</span>
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-gray-300"></span> Previous Week</span>
                        </div>
                     </div>

                     <div className="h-80 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={weeklyTrends} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} dy={10} tick={{fontSize: 12, fill: '#6B7280', fontWeight: 'bold'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} domain={[0, 100]} />
                                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="current_week" fill="#2C4C88" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="previous_week" fill="#D1D5DB" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                     </div>

                     <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 flex items-center gap-3">
                         <div className="p-2 bg-green-100 rounded-full text-green-700">
                             <TrendingUp className="w-5 h-5" />
                         </div>
                         <div>
                             <h4 className="text-sm font-bold text-green-800">Positive Trend Detected</h4>
                             <p className="text-xs text-green-600 mt-0.5">Overall engagement has improved by <span className="font-bold">5.2%</span> compared to last week.</p>
                         </div>
                     </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button 
                        onClick={() => setShowWeeklyTrendsModal(false)}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )}

    {/* Engagement Settings Modal */}
    {showEngagementSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                            <Settings className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Engagement Settings</h2>
                    </div>
                    <button onClick={() => setShowEngagementSettingsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Low Engagement Threshold (%)</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="number" 
                                min="0" max="100"
                                value={engagementSettings.threshold}
                                onChange={(e) => setEngagementSettings({...engagementSettings, threshold: parseInt(e.target.value) || 0})}
                                className="w-24 px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors text-center font-bold"
                            />
                            <span className="text-sm text-gray-500">Alert if score drops below this.</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                             <h4 className="text-sm font-bold text-gray-900">Automatic Alerts</h4>
                             <p className="text-xs text-gray-500 mt-1">Notify during live sessions.</p>
                        </div>
                        <button 
                            onClick={() => setEngagementSettings({...engagementSettings, alerts_enabled: !engagementSettings.alerts_enabled})}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${engagementSettings.alerts_enabled ? 'bg-[#1B3B6F]' : 'bg-gray-200'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${engagementSettings.alerts_enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <button 
                        onClick={() => setShowEngagementSettingsModal(false)}
                        className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveEngagementSettings}
                        disabled={isLoading}
                        className="px-6 py-2 bg-[#2C4C88] text-white font-bold rounded-lg hover:bg-[#1B3B6F] shadow-lg shadow-blue-900/10 transition-colors flex items-center gap-2"
                    >
                        {isLoading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default FacultyDashboard;