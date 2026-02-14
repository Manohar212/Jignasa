import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Video, Bell, Users, Clock, BookOpen } from 'lucide-react';

interface GroupDetails {
  id: number;
  name: string;
  faculty: string;
  total_students: number;
  description: string;
  schedule: string;
}

const StudentGroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch group details logic
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/groups/${id}`);
        if (response.ok) {
            const data = await response.json();
            setGroup(data);
        } else {
            // Mock Data if backend not found
            setGroup({
                id: Number(id),
                name: "Advanced Data Structures",
                faculty: "Prof. Amitabh Sharma",
                total_students: 128,
                description: "Deep dive into trees, graphs, and dynamic programming.",
                schedule: "Mon, Wed 10:00 AM"
            });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-8 text-gray-500">Loading class details...</div>;
  if (!group) return <div className="p-8 text-red-500">Class not found.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/student/groups')}
        className="flex items-center gap-2 text-gray-500 hover:text-[#1B3B6F] font-bold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Groups
      </button>

      {/* Header Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
        <div className="relative z-10">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{group.name}</h1>
            <p className="text-lg text-[#1B3B6F] font-medium mb-6">{group.faculty}</p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {group.total_students} Students</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {group.schedule}</span>
                <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {group.description}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Upcoming Session */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-[#1B3B6F] font-bold mb-4">
                      <Video className="w-5 h-5" />
                      <h3>Next Live Session</h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                      <div>
                          <h4 className="font-bold text-gray-900">Lecture 12: Graph Theory</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" /> Starts in 2 hours
                          </p>
                      </div>
                      <button 
                         onClick={() => navigate(`/student/lecture/${id}`)}
                         className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-sm transition-colors animate-pulse"
                      >
                          Join Now
                      </button>
                  </div>
              </div>

              {/* Announcements */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-[#1B3B6F] font-bold mb-4">
                      <Bell className="w-5 h-5" />
                      <h3>Recent Announcements</h3>
                  </div>
                  <div className="space-y-4">
                      {[1, 2].map((i) => (
                          <div key={i} className="p-4 border-b border-gray-50 last:border-0">
                              <h4 className="font-bold text-gray-900 text-sm">Mid-term Syllabus Update</h4>
                              <p className="text-xs text-gray-500 mt-1 mb-2">Posted 2 days ago</p>
                              <p className="text-sm text-gray-600">Please review the updated syllabus document in the resources folder before next week's exam.</p>
                          </div>
                      ))}
                  </div>
              </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-[#1B3B6F] mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                      <button className="w-full py-2 bg-white text-[#1B3B6F] rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                          View Syllabus
                      </button>
                      <button className="w-full py-2 bg-white text-[#1B3B6F] rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                          Assignment Portal
                      </button>
                      <button className="w-full py-2 bg-white text-[#1B3B6F] rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                          Class Resources
                      </button>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default StudentGroupDetails;
