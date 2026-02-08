import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleIcon } from "../../components/GoogleIcon";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { Signup } from "../../services/auth";
import { SyncLoader } from "react-spinners";

const SignUp: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [signupLoading, setSignupLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSignupLoading(true);
      await Signup(fullName, email, password);
    } catch (err) {
      toast.error('Registration failed');
    } finally {
      setSignupLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      toast.success('Account created successfully');
      navigate('/');
    }
  }, [isAuthenticated, loading]);

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        px-[clamp(20px,4vw,40px)]
        bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]
        transition-colors duration-300
      "
    >
      <div className="w-full max-w-[480px]">
        <div
          className="
            bg-[var(--card-bg)]
            border border-[var(--border-color)]
            rounded-[20px]
            p-[clamp(32px,6vw,48px)]
            shadow-[0_20px_40px_var(--shadow-color)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_25px_50px_var(--shadow-color)]
          "
        >
          {/* Logo */}
          <Link
            to="/"
            className="
              block text-center no-underline
              mb-[clamp(24px,5vw,40px)]
              transition-transform duration-300
              hover:scale-105
            "
          >
            <img
              src="/logo.png"
              alt="SupFile"
              className="w-[clamp(120px,20vw,180px)] mx-auto object-contain"
            />
          </Link>

          {/* Title */}
          <h1
            className="
              text-center font-bold leading-tight
              text-[clamp(24px,5vw,32px)]
              text-[var(--text-primary)]
              mb-[clamp(12px,3vw,16px)]
              transition-colors duration-300
            "
          >
            Create an account
          </h1>

          <p
            className="
              text-center
              text-[clamp(14px,3vw,16px)]
              text-[var(--text-secondary)]
              mb-[clamp(24px,5vw,32px)]
              leading-relaxed
              transition-colors duration-300
            "
          >
            Enter your information to create your SupFile account
          </p>

          {/* Form */}
          <form
            className="
              flex flex-col
              gap-[clamp(16px,3vw,20px)]
              mb-[clamp(24px,5vw,32px)]
            "
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="
                  w-full
                  px-[clamp(16px,3vw,20px)]
                  py-[clamp(14px,3vw,16px)]
                  rounded-xl
                  border-2 border-[var(--border-color)]
                  bg-[var(--bg-primary)]
                  text-[var(--text-primary)]
                  text-[clamp(14px,3vw,16px)]
                  outline-none
                  transition-all duration-300
                  focus:border-[var(--accent-color)]
                  focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]
                  placeholder:text-[var(--text-tertiary)]
                "
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="user@example.com"
                required
                className="
                  w-full
                  px-[clamp(16px,3vw,20px)]
                  py-[clamp(14px,3vw,16px)]
                  rounded-xl
                  border-2 border-[var(--border-color)]
                  bg-[var(--bg-primary)]
                  text-[var(--text-primary)]
                  text-[clamp(14px,3vw,16px)]
                  outline-none
                  transition-all duration-300
                  focus:border-[var(--accent-color)]
                  focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]
                  placeholder:text-[var(--text-tertiary)]
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="
                  w-full
                  px-[clamp(16px,3vw,20px)]
                  py-[clamp(14px,3vw,16px)]
                  rounded-xl
                  border-2 border-[var(--border-color)]
                  bg-[var(--bg-primary)]
                  text-[var(--text-primary)]
                  text-[clamp(14px,3vw,16px)]
                  outline-none
                  transition-all duration-300
                  focus:border-[var(--accent-color)]
                  focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]
                  placeholder:text-[var(--text-tertiary)]
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Confirm your password"
                required
                className="
                  w-full
                  px-[clamp(16px,3vw,20px)]
                  py-[clamp(14px,3vw,16px)]
                  rounded-xl
                  border-2 border-[var(--border-color)]
                  bg-[var(--bg-primary)]
                  text-[var(--text-primary)]
                  text-[clamp(14px,3vw,16px)]
                  outline-none
                  transition-all duration-300
                  focus:border-[var(--accent-color)]
                  focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]
                  placeholder:text-[var(--text-tertiary)]
                "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`
                mt-[clamp(8px,2vw,12px)]
                rounded-xl
                bg-[var(--accent-color)]
                py-[clamp(14px,3vw,16px)]
                text-white font-semibold
                text-[clamp(14px,3vw,16px)]
                transition-all duration-300
                shadow-[0_4px_20px_rgba(59,130,246,0.3)]
                hover:-translate-y-0.5
                hover:bg-[var(--accent-hover)]
                hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)]
                active:translate-y-0
                ${signupLoading && "cursor-not-allowed"}
              `}
            >
              {signupLoading ? (
                <SyncLoader color="#fff" loading={signupLoading} />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            className="
              relative text-center
              my-[clamp(24px,5vw,32px)]
            "
          >
            <span
              className="
                relative z-10
                bg-[var(--card-bg)]
                px-[clamp(12px,3vw,16px)]
                text-[var(--text-tertiary)]
                text-[clamp(12px,2.5vw,14px)]
                font-medium
              "
            >
              OR CONTINUE WITH
            </span>
            <div className="absolute inset-0 top-1/2 h-px bg-[var(--border-color)]" />
          </div>

          {/* Social Buttons */}
          <div
            className="
              flex flex-wrap justify-center
              gap-[clamp(12px,3vw,16px)]
              mb-[clamp(24px,5vw,32px)]
              max-[480px]:gap-[clamp(8px,2vw,12px)]
            "
          >
            <button
              key="Google"
              className="
                  flex items-center justify-center space-x-1
                  px-[clamp(16px,3vw,20px)]
                  py-[clamp(12px,3vw,14px)]
                  min-w-[100px] flex-1
                  rounded-xl
                  border-2 border-[var(--shadow-color)]
                  bg-[var(--bg-primary)]
                  text-[var(--text-primary)]
                  text-[clamp(13px,2.5vw,14px)]
                  font-medium
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-[var(--accent-color)]
                  hover:shadow-[0_4px_20px_var(--shadow-color)]
                "
            >
              <GoogleIcon />
              <span>
                Google
              </span>
            </button>
          </div>

          {/* Sign in */}
          <div
            className="
              text-center
              text-[var(--text-secondary)]
              text-[clamp(13px,2.5vw,14px)]
              transition-colors
            "
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="
                font-semibold
                text-[var(--accent-color)]
                transition-colors
                hover:text-[var(--accent-hover)]
                hover:underline
              "
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
