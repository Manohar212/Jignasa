import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface FacultyProfileData {
  name: string;
  email: string;
  faculty_id: string;
}

const FacultyProfile: React.FC = () => {
  const [profile, setProfile] = useState<FacultyProfileData>({
    name: '',
    email: '',
    faculty_id: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<FacultyProfileData>({ name: '', email: '', faculty_id: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
        const response = await fetch('/api/faculty/profile/current');
        if (response.ok) {
            const data = await response.json();
            setProfile(data);
        } else {
            // Fallback Mock
            setProfile({
                name: 'Dr. Robert Chen',
                email: 'robert.chen@university.edu',
                faculty_id: 'FAC-10234'
            });
        }
    } catch (error) {
        console.error("Failed to fetch profile", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleEditClick = () => {
      setEditForm(profile);
      setIsEditing(true);
      setNotification(null);
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      
      try {
          const response = await fetch('/api/faculty/profile/update', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  faculty_id: editForm.faculty_id, // Identity key
                  name: editForm.name,
                  email: editForm.email
              })
          });

          if (response.ok) {
              const updatedData = await response.json();
              setProfile(updatedData.profile);
              setIsEditing(false);
              setNotification({ type: 'success', message: 'Profile updated successfully!' });
              
              // Clear notification after 3s
              setTimeout(() => setNotification(null), 3000);
          } else {
              setNotification({ type: 'error', message: 'Failed to update profile.' });
          }
      } catch (error) {
          setNotification({ type: 'error', message: 'Network error occurred.' });
      } finally {
          setIsSaving(false);
      }
  };

  const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
              <Loader className="w-8 h-8 animate-spin text-[#1B3B6F]" />
          </div>
      );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`absolute top-0 right-0 m-6 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center">
        
        {/* Profile Avatar */}
        <div className="w-32 h-32 bg-[#EEF2F6] rounded-full flex items-center justify-center mb-6 text-[#1B3B6F] shadow-inner">
            <span className="text-4xl font-serif font-bold">{getInitials(profile.name)}</span>
        </div>

        {/* Header Info - Simplified */}
        <div className="text-center mb-12">
            <h1 className="text-3xl font-serif font-bold text-gray-900">{profile.name}</h1>
        </div>

        {/* Details List */}
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Full Name</span>
                <span className="text-gray-900 font-bold">{profile.name}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Email Address</span>
                <span className="text-gray-900 font-bold">{profile.email}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Faculty ID</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 font-mono text-sm font-bold rounded">
                    {profile.faculty_id}
                </span>
            </div>
        </div>

        {/* Edit Button */}
        <button 
            onClick={handleEditClick}
            className="mt-12 px-8 py-3 bg-[#3B5D95] text-white rounded-lg font-bold flex items-center gap-2 hover:bg-[#2C4C88] transition-colors shadow-lg shadow-blue-900/10"
        >
            <Edit2 className="w-4 h-4" />
            Edit Profile
        </button>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Edit Profile</h2>
                    <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B3B6F] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Faculty ID <span className="text-gray-300 font-normal">(Read Only)</span></label>
                        <input 
                            type="text" 
                            value={editForm.faculty_id}
                            readOnly
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 font-mono cursor-not-allowed"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-3 bg-[#2C4C88] text-white font-bold rounded-lg hover:bg-[#1B3B6F] shadow-lg shadow-blue-900/10 transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Backdrop Click */}
            <div className="absolute inset-0 -z-10" onClick={() => setIsEditing(false)}></div>
        </div>
      )}

    </div>
  );
};

export default FacultyProfile;