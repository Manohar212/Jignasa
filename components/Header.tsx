import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Settings, 
  Calendar, 
  Users, 
  FileText, 
  AlertTriangle, 
  Info, 
  Check,
  HelpCircle,
  LogOut,
  X,
  BookOpen,
  BarChart2
} from 'lucide-react';
import { UserRole } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  userRole: UserRole;
  userName: string;
}

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  color: string;
  unread: boolean;
}

const Header: React.FC<HeaderProps> = ({ userRole, userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for dropdown visibility
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  // Animation States
  const [isClearing, setIsClearing] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  // Refs for click outside detection
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Notification Data State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Initial Data Definitions
  const initialStudentNotifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Lecture Scheduled',
      description: 'Data Structures scheduled for tomorrow at 9:00 AM',
      time: 'Today',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      unread: true
    },
    {
      id: 2,
      title: 'Assignment Deadline',
      description: 'Lab 4: Linked Lists due in 2 hours',
      time: 'Today',
      icon: AlertTriangle,
      color: 'bg-orange-50 text-orange-600',
      unread: true
    },
    {
      id: 3,
      title: 'Attendance Update',
      description: 'Your attendance in Algorithms is now 92%',
      time: 'Yesterday',
      icon: Check,
      color: 'bg-green-50 text-green-600',
      unread: false
    },
    {
      id: 4,
      title: 'New Announcement',
      description: 'Prof. Smith posted a new announcement in CS-301',
      time: 'Yesterday',
      icon: Info,
      color: 'bg-purple-50 text-purple-600',
      unread: true
    },
    {
      id: 5,
      title: 'Faculty Feedback',
      description: 'New feedback: Algorithm Quiz',
      time: '2 days ago',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      unread: false
    }
  ];

  const initialFacultyNotifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Lecture Reminder',
      description: 'Your Data Structures lecture starts at 9:00 AM',
      time: 'Today',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      unread: true
    },
    {
      id: 2,
      title: 'Report Ready',
      description: 'Attendance report for Algorithms is ready to download',
      time: 'Today',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      unread: true
    },
    {
      id: 3,
      title: 'Engagement Alert',
      description: 'Engagement dropped below 70% in CS-301',
      time: 'Yesterday',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
      unread: true
    },
    {
      id: 4,
      title: 'New Students',
      description: '5 new students joined CS-301',
      time: 'Yesterday',
      icon: Users,
      color: 'bg-green-50 text-green-600',
      unread: false
    },
    {
      id: 5,
      title: 'Submission Summary',
      description: '45/50 students submitted Lab 3',
      time: '2 days ago',
      icon: Check,
      color: 'bg-orange-50 text-orange-600',
      unread: false
    }
  ];

  // Initialize notifications based on role
  useEffect(() => {
    if (userRole === UserRole.STUDENT) {
      setNotifications(initialStudentNotifications);
    } else {
      setNotifications(initialFacultyNotifications);
    }
  }, [userRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getBreadcrumb = () => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return 'Portal';
    
    // Capitalize and format
    const formatted = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');
    return `${userRole === UserRole.STUDENT ? 'Student Portal' : 'Faculty Portal'} / ${formatted.split(' / ')[1] || 'Dashboard'}`;
  };

  const handleProfileClick = () => {
    if (userRole === UserRole.STUDENT) {
        navigate('/student/profile');
    } else {
        navigate('/faculty/profile');
    }
  };

  const handleMarkAllRead = () => {
    setIsClearing(true);
    // Wait for animation to finish before updating state
    setTimeout(() => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        setIsClearing(false);
    }, 300);
  };

  const handleViewAll = () => {
    setShowAllModal(true);
    setShowNotifications(false);
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
        setShowAllModal(false);
        setIsModalClosing(false);
    }, 250);
  };

  // Filter for dropdown: Only show unread notifications
  const dropdownNotifications = notifications.filter(n => n.unread);
  const unreadCount = dropdownNotifications.length;

  // Additional Data for Modal
  const additionalStudentData: NotificationItem[] = [
    {
        id: 101,
        title: 'Assignment Feedback',
        description: 'Assignment feedback available for Database Systems',
        time: '3 days ago',
        icon: FileText,
        color: 'bg-indigo-50 text-indigo-600',
        unread: false
    },
    {
        id: 102,
        title: 'Class Material',
        description: 'New class material uploaded for Operating Systems',
        time: '4 days ago',
        icon: BookOpen,
        color: 'bg-teal-50 text-teal-600',
        unread: false
    }
  ];

  const additionalFacultyData: NotificationItem[] = [
    {
        id: 201,
        title: 'Grading Completed',
        description: 'Assignment grading completed for CS-101',
        time: '3 days ago',
        icon: Check,
        color: 'bg-green-50 text-green-600',
        unread: false
    },
    {
        id: 202,
        title: 'Analytics Report',
        description: 'Lecture analytics report generated for last week',
        time: '4 days ago',
        icon: BarChart2,
        color: 'bg-blue-50 text-blue-600',
        unread: false
    }
  ];

  const modalNotifications = [
    ...notifications,
    ...(userRole === UserRole.STUDENT ? additionalStudentData : additionalFacultyData)
  ];

  return (
    <>
    <style>{`
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOutUp {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes modalOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
        }
        @keyframes dropdownIn {
            from { opacity: 0; transform: scale(0.95) translateY(-5px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .animate-slide-in {
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-out-up {
            animation: fadeOutUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-in {
            animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-out {
            animation: modalOut 0.2s ease-in forwards;
        }
        .animate-dropdown-in {
            animation: dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
    `}</style>

    <header className="h-16 bg-[#F9F7F2] border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="text-sm text-gray-500 font-serif italic">
        {getBreadcrumb()}
      </div>

      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
            className={`relative p-2 transition-colors ${showNotifications ? 'text-[#1B3B6F] bg-gray-100 rounded-full' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
                <span className={`absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F9F7F2] transition-opacity duration-300 ${isClearing ? 'opacity-0' : 'opacity-100'}`}></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-dropdown-in origin-top-right">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 font-serif">Notifications</h3>
                    <button 
                        onClick={handleMarkAllRead}
                        className="text-xs font-bold text-[#1B3B6F] hover:underline flex items-center gap-1"
                    >
                        <Check className="w-3 h-3" /> Mark all as read
                    </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {dropdownNotifications.length === 0 && !isClearing ? (
                        <div className="p-8 text-center text-gray-400 text-sm italic font-serif animate-slide-in">
                            No new notifications.
                        </div>
                    ) : (
                        dropdownNotifications.map((notif, index) => (
                            <div 
                                key={notif.id} 
                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 bg-blue-50/30 ${isClearing ? 'animate-fade-out-up' : 'animate-slide-in'}`}
                                style={{ animationDelay: isClearing ? '0s' : `${index * 0.05}s` }}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                                    <notif.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">{notif.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">{notif.description}</p>
                                </div>
                                { /* Hide blue dot during clearing animation */ }
                                {!isClearing && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                            </div>
                        ))
                    )}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                    <button 
                        onClick={handleViewAll}
                        className="text-xs font-bold text-[#1B3B6F] hover:text-[#2C4C88]"
                    >
                        View all notifications
                    </button>
                </div>
            </div>
          )}
        </div>

        {/* Settings Gear */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
            className={`p-2 transition-colors ${showSettings ? 'text-[#1B3B6F] bg-gray-100 rounded-full' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-dropdown-in origin-top-right">
                <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                        <HelpCircle className="w-4 h-4 text-gray-400" /> Help & Support
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>

                    <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>
          )}
        </div>

        <div 
            className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileClick}
            title="Go to Profile"
        >
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userRole === UserRole.STUDENT ? 'Student' : 'Professor'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#2C4C88] text-white flex items-center justify-center font-bold text-sm">
                {userName.charAt(0)}
            </div>
        </div>
      </div>
    </header>

    {/* View All Notifications Modal */}
    {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with Fade */}
            <div 
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isModalClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleCloseModal}
            ></div>
            
            {/* Modal Content with Scale/Fade */}
            <div 
                className={`bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[80vh] flex flex-col relative z-10 ${isModalClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-serif">All Notifications</h2>
                        <p className="text-xs text-gray-500 font-serif italic">History of your alerts and updates</p>
                    </div>
                    <button 
                        onClick={handleCloseModal}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-2">
                    {modalNotifications.map((notif, index) => (
                        <div 
                            key={notif.id} 
                            className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors flex gap-4 animate-slide-in"
                            style={{ animationDelay: `${index * 0.03}s` }}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                                <notif.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-bold ${notif.unread ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{notif.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{notif.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-right">
                    <button 
                        onClick={handleCloseModal}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default Header;