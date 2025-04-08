import { useState } from "react";
import { MessageSquare, Lock, Eye, Mail, User, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";
import AuthImagePattern from "../components/authImagePatter";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { validateForm } from "../lib/utils";
import GoogleIcon from "../components/GoogleIcon";

const Signup = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });
  const {
    isSigningUping,
    signUP,
    verifyOTP,
    authUser,
    isVerified,
    setIsVerified,
    isCodeValid,
    resendOTP,
  } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm(formData,toast);
    if (success === true) {
      try {
        const response = await signUP(formData);
        if (response.success) {
          setIsVerified(true);
        } else {
          toast.error(response.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        toast.error("Signup failed. Please try again.");
      }
    }
  };



  return (
    <>
      {!isVerified ? (
        <div className="min-h-screen grid lg:grid-cols-2">
          <div className="flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div
                    className="size-12 rounded-xl bg-primary/10 flex items-center justify-center
              group-hover:bg-primary/20 transition-colors"
                  >
                    <MessageSquare className="size-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                  <p className="text-base-content/60">
                    Get started with your free account
                  </p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <User className="size-5 text-gray-600" />
                    </div>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) =>
                        setFormData({ ...formData, fullname: e.target.value })
                      }
                      className={`input input-bordered w-full pl-10`}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Username</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <User className="size-5 text-gray-600" />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className={`input input-bordered w-full pl-10`}
                      placeholder="johndoe123"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <Mail className="size-5 text-gray-600" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`input input-bordered w-full pl-10`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <Lock className="size-5 text-gray-600" />
                    </div>
                    <input
                      type={showPwd ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                    />
                    <button
                      onClick={() => setShowPwd(!showPwd)}
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPwd ? (
                        <Eye className="size-5 text-gray-600" />
                      ) : (
                        <EyeOff className="size-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSigningUping}
                >
                  {isSigningUping ? (
                    <>
                      <Loader className="size-5 animate-spin" /> Loading ...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="divider my-4">OR</div>

              <button
                type="button"
                className="btn btn-outline w-full flex items-center justify-center gap-2"
                onClick={()=>window.open("https://cochat-4vrg.onrender.com/auth/google", "_self")}
                 disabled={isSigningUping}
              >
                <GoogleIcon className="size-5"/>
                Continue with Google
              </button>


              <div className="text-center">
                <p className="text-base-content/60">
                  Already have an account?{" "}
                  <Link to="/login" className="link link-primary">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <AuthImagePattern
            title="Join our community"
            subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 space-y-4 w-full max-w-md mx-auto min-h-screen">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 text-center">
            Enter code we sent for to {formData.email}
          </h2>

          <form
            className="flex flex-col sm:flex-row items-center gap-3 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              verifyOTP({ code, email: formData.email }, navigate);
            }}
          >
            <input
              type="text"
              maxLength="5"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              placeholder="Enter OTP"
            />
            <button
              type="submit"
              className="w-full sm:w-32 h-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Verify
            </button>
          </form>

          <p
            className={`text-sm text-red-500 text-center ${
              isCodeValid === false ? "" : "hidden"
            }`}
          >
            Invalid OTP. Please try again.
          </p>
          <p
            className={`text-sm text-green-500 text-center ${
              isCodeValid === true ? "" : "hidden"
            }`}
          >
            OTP verified successfully!
          </p>
          <h3 className="text-center">
            Didn't get the code?
            <button
              onClick={() => resendOTP({ email: formData.email })}
              className="text-blue-500 hover:text-blue-700 focus:outline-none ml-1"
            >
              Resend
            </button>
          </h3>
        </div>
      )}
    </>
  );
};
export default Signup;