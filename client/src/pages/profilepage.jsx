import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuth.store";
import { Camera, Mail, User, Notebook, Edit, ArrowLeft, AtSign, Save, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, resendOTP, deleteAccount, showCodeConfirmation, setShowCodeConfirmation } = useAuthStore();
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [localFullname, setLocalFullname] = useState("");
  const [localUsername, setLocalUsername] = useState("");
  const [localBio, setLocalBio] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  useEffect(() => {
    if (authUser && !isEditing) {
      setLocalFullname(authUser.fullname);
      setLocalUsername(authUser.username);
      setLocalBio(authUser.bio || "");
    }
  }, [authUser, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      if (authUser) {
        setLocalFullname(authUser.fullname);
        setLocalUsername(authUser.username);
        setLocalBio(authUser.bio || "");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveTextChanges = async () => {
    try {
      if (localBio.length > 200) {
        toast.error("Bio length cannot exceed 200 characters!");
        return;
      }
      if (!localFullname.trim()) {
        toast.error("Fullname cannot be empty!");
        return;
      }
      const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
      if (!usernameRegex.test(localUsername)) {
        toast.error("Invalid username format (4-16 chars, letters, numbers, _).");
        return;
      }

      const dataToUpdate = {};
      if (localFullname !== authUser.fullname) dataToUpdate.fullname = localFullname;
      if (localUsername !== authUser.username) dataToUpdate.username = localUsername;
      if (localBio !== (authUser.bio || "")) dataToUpdate.bio = localBio;

      if (Object.keys(dataToUpdate).length === 0) {
        toast.info("No textual changes to save.");
        setIsEditing(false);
        return;
      }

      await updateProfile(dataToUpdate);
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred while updating profile.");
      if (err?.response?.data?.field === 'username' && authUser) {
          setLocalUsername(authUser.username);
      }
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
      try {
        await updateProfile({ profilePic: base64Image });
        setSelectedImg(null);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to upload image.");
        setSelectedImg(null);
      }
    };
  };

  const handleDeleteAccountSubmit = async (e) => {
    e.preventDefault();
    if (!confirmationCode.trim()) {
        toast.error("Please enter the confirmation code.");
        return;
    }
    try {
      await deleteAccount({ confirmationCode, email: authUser.email });
      setShowCodeConfirmation(false);
      setShowDeleteConfirmation(false);
      setConfirmationCode("");
      navigate("/login");
    } catch (err) {
    }
  };

  const handleResendDeleteOTP = async () => {
    try {
      await resendOTP({ email: authUser.email });
    } catch (err) {
    }
  };

  const openDeleteConfirmation = async () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDeletionAndRequestOTP = async () => {
    try {
        await resendOTP({email: authUser.email});
        setShowDeleteConfirmation(false);
        setShowCodeConfirmation(true);
    } catch (err) {
        setShowDeleteConfirmation(false);
    }
  }

  useEffect(() => {
    if (authUser && localFullname === "" && localUsername === "" && localBio === "") {
        setLocalFullname(authUser.fullname);
        setLocalUsername(authUser.username);
        setLocalBio(authUser.bio || "");
    }
  }, [authUser, localBio, localFullname, localUsername]);


  if (!authUser) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-10">
      <div className="max-w-2xl mx-auto p-4">
        <button onClick={() => { navigate(-1); }} className="mb-4 p-2 rounded-full hover:bg-base-200">
          <ArrowLeft className="size-7" />
        </button>
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-1 text-sm text-gray-400">Manage your account settings.</p>
          </div>

          <>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-primary"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile && selectedImg ? "animate-pulse pointer-events-none" : ""}`}
                >
                  <Camera className="w-5 h-5 text-base-100" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile && selectedImg}
                  />
                </label>
              </div>
              <p className="text-xs text-zinc-400">
                {isUpdatingProfile && selectedImg ? "Uploading..." : "Click camera to change photo"}
              </p>
            </div>

            <div className="space-y-6">
                <div className="flex justify-end gap-2 mb-2">
                    {isEditing && (
                        <button
                            onClick={handleSaveTextChanges}
                            className="btn btn-sm btn-success"
                            disabled={isUpdatingProfile}
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    )}
                    <button
                        onClick={handleEditToggle}
                        className={`btn btn-sm ${isEditing ? 'btn-ghost' : 'btn-outline btn-primary'}`}
                        disabled={isUpdatingProfile && !isEditing}
                    >
                        {isEditing ? <><XCircle size={16}/> Cancel</> : <><Edit size={16}/> Edit Profile</>}
                    </button>
                </div>

              <div className="space-y-1.5">
                <label htmlFor="fullname" className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  className={`input input-bordered w-full ${!isEditing ? 'input-disabled !bg-base-200/70 !text-current !border-opacity-50 cursor-default' : 'bg-base-100'}`}
                  value={localFullname}
                  onChange={(e) => setLocalFullname(e.target.value)}
                  readOnly={!isEditing || (isUpdatingProfile && !selectedImg)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="username" className="text-sm text-zinc-400 flex items-center gap-2">
                  <AtSign className="w-4 h-4" /> Username
                </label>
                <input
                  id="username"
                  type="text"
                  className={`input input-bordered w-full ${!isEditing ? 'input-disabled !bg-base-200/70 !text-current !border-opacity-50 cursor-default' : 'bg-base-100'}`}
                  value={localUsername}
                  onChange={(e) => setLocalUsername(e.target.value)}
                  readOnly={!isEditing || (isUpdatingProfile && !selectedImg)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <p className="px-4 py-2.5 bg-base-200/70 rounded-lg border border-base-content/20 border-opacity-50">{authUser?.email}</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="bio" className="text-sm text-zinc-400 flex items-center gap-2">
                  <Notebook className="w-4 h-4" /> Bio
                </label>
                <textarea
                  id="bio"
                  className={`textarea textarea-bordered w-full min-h-24 ${!isEditing ? 'textarea-disabled !bg-base-200/70 !text-current !border-opacity-50 cursor-default' : 'bg-base-100'}`}
                  value={localBio}
                  onChange={(e) => setLocalBio(e.target.value)}
                  readOnly={!isEditing || (isUpdatingProfile && !selectedImg)}
                  maxLength={200}
                  rows={3}
                />
                 {isEditing && <p className="text-xs text-right text-zinc-400">{localBio.length}/200</p>}
              </div>
            </div>

            <div className="mt-8 bg-base-200/50 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-base-content/20">
                  <span>Member Since</span>
                  <span>{new Date(authUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500 font-semibold">Active</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  className="btn btn-error btn-outline"
                  onClick={openDeleteConfirmation}
                  disabled={isUpdatingProfile}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </>

          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
              <div className="bg-base-100 p-6 rounded-lg space-y-4 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-semibold text-error">Delete Account Confirmation</h3>
                <p className="text-sm">Are you sure you want to delete your account? This action is irreversible. We will send a confirmation code to your email <span className="font-semibold">{authUser?.email}</span>.</p>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeletionAndRequestOTP}
                    className="btn btn-error"
                  >
                    Yes, Send Code & Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCodeConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
              <div className="bg-base-100 p-6 rounded-lg space-y-4 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-semibold">Enter Confirmation Code</h3>
                <p className="text-sm">We sent a code to {authUser?.email}. Enter it below to confirm account deletion.</p>
                <form onSubmit={handleDeleteAccountSubmit}>
                  <input
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value.trim())}
                    className="input input-bordered w-full text-center tracking-widest text-lg"
                    placeholder="Enter 5-digit code"
                    maxLength={5}
                    pattern="\d{5}"
                    title="Enter the 5-digit code"
                    required
                  />
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {setShowCodeConfirmation(false); setConfirmationCode("");}}
                      className="btn btn-ghost flex-1 order-3 sm:order-1"
                    >
                      Cancel
                    </button>
                     <button
                      type="button"
                      onClick={handleResendDeleteOTP}
                      className="btn btn-outline btn-warning flex-1 order-2"
                    >
                      Resend Code
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success flex-1 order-1 sm:order-3"
                      disabled={confirmationCode.length !== 5}
                    >
                      Submit & Delete
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;