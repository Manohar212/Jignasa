import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Terminal, Database, Cloud, X, RefreshCw, BookOpen, Calendar, Clock, Mail, Hash, Search, MapPin } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  students_count: number;
  code: string;
  icon?: any;
  iconColor?: string;
  bgColor?: string;
  description?: string;
}

interface Student {
  id: number;
  full_name: string;
  roll_number: string;
  email: string;
}

interface Lecture {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

const FacultyGroups: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data States
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupStudents, setGroupStudents] = useState<Student[]>([]);
  const [groupLectures, setGroupLectures] = useState<Lecture[]>([]);
  
  // Create Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCode, setNewGroupCode] = useState('JIG-' + Math.floor(1000 + Math.random() * 9000));

  // Initial Load
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
        const response = await fetch('/api/groups');
        if (response.ok) {
            const data = await response.json();
            setGroups(data);
        } else {
            // Mock Data if backend not connected
            setGroups([
                { id: 1, name: "CS-2024-A (Sophomores)", students_count: 42, code: "JIG-4421-A", icon: Terminal, iconColor: "text-blue-600", bgColor: "bg-blue-50" },
                { id: 2, name: "CS-2024-B (Freshmen)", students_count: 38, code: "JIG-8820-B", icon: Database, iconColor: "text-green-600", bgColor: "bg-green-50" },
                { id: 3, name: "CS-Elective-Cloud", students_count: 31, code: "JIG-9912-C", icon: Cloud, iconColor: "text-indigo-600", bgColor: "bg-indigo-50" }
            ]);
        }
    } catch (error) {
        console.error("Error fetching groups:", error);
    }
  };

  const handleViewGroup = async (group: Group) => {
    setSelectedGroup(group);
    setShowViewModal(true);
    setIsLoading(true);

    try {
        // Fetch Students
        const studentsRes = await fetch(`/api/groups/${group.id}/students`);
        if (studentsRes.ok) {
            setGroupStudents(await studentsRes.json());
        } else {
            // Mock Students
            setGroupStudents([
                { id: 101, full_name: "Alice Johnson", roll_number: "CS-001", email: "alice@uni.edu" },
                { id: 102, full_name: "Bob Smith", roll_number: "CS-002", email: "bob@uni.edu" },
                { id: 103, full_name: "Charlie Brown", roll_number: "CS-003", email: "charlie@uni.edu" },
                { id: 104, full_name: "Diana Prince", roll_number: "CS-004", email: "diana@uni.edu" },
            ]);
        }

        // Fetch Lectures (Even if not shown in this specific modal version, might be needed later or for caching)
        const lecturesRes = await fetch(`/api/groups/${group.id}/lectures`);
        if (lecturesRes.ok) {
            setGroupLectures(await lecturesRes.json());
        } else {
            // Mock Lectures
            setGroupLectures([
                { id: 501, title: "Intro to Algorithms", date: "2023-10-25", time: "09:00 AM", location: "Hall A" },
                { id: 502, title: "Data Structures II", date: "2023-10-27", time: "11:00 AM", location: "Lab 3" },
            ]);
        }
    } catch (error) {
        console.error("Error fetching group details:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
      // Logic to create group via API would go here
      // For now, just close modal
      setShowCreateModal(false);
      alert("Group created successfully (Mock)");
  };

  const getIcon = (group: Group) => {
      // Fallback for mock data icons which are components
      if (group.icon) {
          const Icon = group.icon;
          return <Icon className="w-8 h-8" />;
      }
      return <Users className="w-8 h-8" />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#1B3B6F]">Manage Groups</h1>
        <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 bg-[#2C4C88] text-white rounded-lg font-bold flex items-center gap-2 hover:bg-[#1B3B6F] shadow-sm transition-colors"
             >
                <Plus className="w-5 h-5" />
                Create New Group
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
            <div key={group.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${group.bgColor || 'bg-gray-50'} ${group.iconColor || 'text-gray-600'}`}>
                    {getIcon(group)}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-serif font-bold text-gray-900">{group.name}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-1">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Users className="w-4 h-4" /> {group.students_count} Students
                        </span>
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded text-xs font-mono font-bold text-gray-600">
                            <span className="text-gray-400">CODE:</span> {group.code}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => handleViewGroup(group)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-[#2C4C88] text-white rounded-lg font-bold hover:bg-[#1B3B6F] transition-colors"
                    >
                        View Group
                    </button>
                    <button className="p-2.5 border border-gray-200 text-gray-400 rounded-lg hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Create New Group</h2>
                    <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Group Name</label>
                        <input 
                            type="text" 
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="e.g., Advanced AI - Spring 2024"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Join Code</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newGroupCode}
                                readOnly
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 font-mono text-center font-bold text-[#1B3B6F] tracking-widest"
                            />
                            <button 
                                onClick={() => setNewGroupCode('JIG-' + Math.floor(1000 + Math.random() * 9000))}
                                className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" /> Generate
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-400 italic">This code will be used by students to enroll in the group.</p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <button 
                        onClick={() => setShowCreateModal(false)}
                        className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateGroup}
                        className="px-6 py-2 bg-[#2C4C88] text-white font-bold rounded-lg hover:bg-[#1B3B6F] shadow-lg shadow-blue-900/10 transition-colors"
                    >
                        Save Group
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* View Group Details Modal */}
      {showViewModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${selectedGroup.bgColor || 'bg-gray-100'} ${selectedGroup.iconColor || 'text-gray-600'}`}>
                            {getIcon(selectedGroup)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900">{selectedGroup.name}</h2>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                    {selectedGroup.code}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {selectedGroup.students_count} Students
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                             <RefreshCw className="w-8 h-8 animate-spin mb-2 opacity-50" />
                             <p>Loading details...</p>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                    <Users className="w-5 h-5 text-[#1B3B6F]" /> 
                                    Enrolled Students
                                </h3>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex-1">
                                <div className="overflow-x-auto h-full">
                                    <table className="w-full text-left min-w-[600px] sm:min-w-full">
                                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Roll Number</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {groupStudents.map((student) => (
                                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{student.full_name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{student.roll_number}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                                                </tr>
                                            ))}
                                            {groupStudents.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                                                        No students enrolled yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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

    </div>
  );
};

export default FacultyGroups;