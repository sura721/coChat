import { useState } from "react";
import { useAuthStore } from "../store/useAuth.store";
import { Camera, Mail, User, Notebook, Edit, ArrowLeft, AtSign } from "lucide-react";
import { axiosInstance } from "../lib/axios.lib";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile,resendOTP,deleteAccount,showCodeConfirmation ,setShowCodeConfirmation} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [bio, setBio] = useState(authUser?.bio);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 

  const [confirmationCode, setConfirmationCode] = useState(""); 
  const navigate = useNavigate();

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveClick = async () => {
    try {
      if (bio.length > 200) {
        toast.error("Bio length cannot exceed 200 characters!");
        return; 
      }

      await updateProfile({ bio });
      setIsEditing(false); 
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleDeleteAccount = () => {
   
    setShowCodeConfirmation(true); 
    setShowDeleteConfirmation(false); 
  };

 

  return (
    <div className="h-screen pt-20">
      <button onClick={() => { navigate('/'); }}><ArrowLeft className="size-8 " /></button>
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {authUser && (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4 "
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-0 right-0 
                      bg-base-content hover:scale-105
                      p-2 rounded-full cursor-pointer 
                      transition-all duration-200
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                  >
                    <Camera className="w-5 h-5 text-base-200" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <p className="text-sm text-zinc-400">
                  {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullname}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <AtSign className="w-4 h-4" />
                    username
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.username}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Notebook className="w-4 h-4" />
                    Bio
                  </div>
                  <div>
                    <input
                      className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      readOnly={!isEditing}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={handleEditClick}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {isEditing && (
                        <button
                          onClick={handleSaveClick}
                          className="text-green-500 hover:text-green-700"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-base-300 rounded-xl p-6">
                <h2 className="text-lg font-medium mb-4">Account Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                    <span>Member Since</span>
                    <span>{authUser.createdAt?.split("T")[0]}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Account Status</span>
                    <span className="text-green-500">Active</span>
                  </div>
                </div>

                {/* Delete Account Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                    onClick={() => setShowDeleteConfirmation(true)} 
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </>
          )}


          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-red-900">Are you sure you want to delete your account?</h3>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={()=>{resendOTP({email:authUser.email});setShowCodeConfirmation(true)}}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirmation(false)} 
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

{showCodeConfirmation && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-blue-700">Enter the code we sent to {authUser?.email}</h3>
      <input
        type="text"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        className="px-4 py-2 w-full border border-gray-300 rounded-lg text-black font-bold text-center"
        placeholder="Enter code"
      />
      <div className="flex gap-4 justify-center">
        <button
          onClick={(e)=>{
            e.preventDefault()
            deleteAccount({confirmationCode,email:authUser.email},useNavigate);
          setShowDeleteConfirmation(false)
          }} 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Submit
        </button>

        <a
          onClick={()=>{resendOTP({email:authUser.email});}} 
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-300"
        >
          Resend Code
        </a>

        <button
          onClick={() => setShowCodeConfirmation(false)} 
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
