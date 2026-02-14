import React from 'react';
import { User, Lock, Save, Mail, Briefcase } from 'lucide-react';

const StudentProfile: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-12">
         <div className="relative">
             <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gray-200 overflow-hidden mb-4">
                 <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" />
             </div>
             <button className="absolute bottom-4 right-0 p-2 bg-[#2C4C88] text-white rounded-full hover:bg-[#1B3B6F] shadow-md border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
             </button>
         </div>
         <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">John Doe</h1>
         <p className="text-gray-500 font-serif italic mb-4">Roll No: CS-2024-042</p>
         
         <div className="flex gap-6 text-sm text-gray-500">
             <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> john.doe@university.edu</span>
             <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Institute of Advanced Technology</span>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
         <div className="max-w-2xl mx-auto">
            
            {/* Personal Info */}
            <div>
                <div className="flex items-center gap-2 text-[#1B3B6F] font-bold mb-6 border-b border-gray-100 pb-2">
                    <User className="w-5 h-5" />
                    <h3>Personal Information</h3>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                            type="text" 
                            defaultValue="John Doe"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#1B3B6F] outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                            type="email" 
                            defaultValue="john.doe@university.edu"
                            readOnly
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#1B3B6F] outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

         </div>

         <div className="mt-12 flex flex-col items-center">
             <button className="px-8 py-3 bg-[#2C4C88] text-white rounded-lg font-bold flex items-center gap-2 hover:bg-[#1B3B6F] shadow-lg shadow-blue-900/10 transition-all">
                <Save className="w-5 h-5" />
                Save Changes
             </button>
             <p className="mt-4 text-xs text-gray-400 italic">Changes will be reflected across your academic record immediately.</p>
         </div>
      </div>
    </div>
  );
};

export default StudentProfile;