import React, { useState } from 'react'
import useAuthStore from '../store/useAuthStore';
import { Calendar, Camera, Mail, Shield, User } from 'lucide-react';

const ProfilePage = () => {

  const [selectedImg, setSelectedImg] = useState(null);

  const {authUser , updateProfile , isUpdatingProfile} = useAuthStore();

  const handleImageUpload = async(e) =>{
    const file = e.target.files[0];
    if(!file) return; 
    const reader = new FileReader();  //read file as a string
    reader.readAsDataURL(file); 
    reader.onload = async(e) =>{
      const base64 = e.target.result;
      setSelectedImg(base64);
      await updateProfile({profilepic:base64}); //profilepic name took from db
    }
  };

  return (
  <div className="min-h-screen pt-20 pb-10">
    <div className="max-w-2xl mx-auto px-4">

      {/* Banner + Card */}
      <div className="rounded-2xl overflow-hidden border border-base-300 shadow-sm">
        
        {/* Gradient Banner */}
        <div className="h-36 bg-gradient-to-r from-primary via-secondary to-accent" />

        {/* Card Body */}
        <div className="bg-base-200 px-8 pb-8">

          {/* Avatar Row */}
          <div className="flex items-end justify-between -mt-14 mb-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilepic || "/avatar.png"}
                alt="Profile"
                className="size-28 rounded-full object-cover border-4 border-base-200 shadow-md"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-1 right-1 bg-primary hover:bg-primary/80 p-2 rounded-full cursor-pointer transition-all duration-200 shadow
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-4 h-4 text-primary-content" />
                <input type="file" id="avatar-upload" className="hidden"
                  accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
              </label>
            </div>

            <div className="mb-2 text-right">
              <h2 className="text-2xl font-semibold">{authUser?.fullname}</h2>
              <p className="text-base-content/50 text-sm">{authUser?.email}</p>
              <span className="badge badge-success badge-sm mt-1 gap-1">
                <span className="size-1.5 rounded-full bg-success-content"></span>
                Active
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="divider my-4" />

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              <p className="text-xs text-base-content/50 flex items-center gap-1 mb-1">
                <User className="w-3 h-3" /> Full name
              </p>
              <p className="font-medium">{authUser?.fullname}</p>
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              <p className="text-xs text-base-content/50 flex items-center gap-1 mb-1">
                <Mail className="w-3 h-3" /> Email
              </p>
              <p className="font-medium text-sm truncate">{authUser?.email}</p>
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              <p className="text-xs text-base-content/50 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" /> Member since
              </p>
              <p className="font-medium text-primary">{authUser.createdAt?.split("T")[0]}</p>
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              <p className="text-xs text-base-content/50 flex items-center gap-1 mb-1">
                <Shield className="w-3 h-3" /> Account status
              </p>
              <p className="font-medium text-success">Active</p>
            </div>
          </div>

          {/* Upload status */}
          {isUpdatingProfile && (
            <p className="text-center text-sm text-base-content/50 mt-4">Uploading...</p>
          )}

        </div>
      </div>
    </div>
  </div>
)
}

export default ProfilePage
