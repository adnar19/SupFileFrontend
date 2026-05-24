import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ResetPassword } from "../../services/auth";
import { SyncLoader } from "react-spinners";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    try {
      setLoading(true);
      const res = await ResetPassword(token, password, confirmPassword);
      if (res && res.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        h-full overflow-y-auto flex items-center justify-center
        px-[clamp(20px,4vw,40px)]
        bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]
        transition-colors duration-300
      "
    >
      <div className="w-full h-full max-w-[480px] flex items-center justify-center">
        <div
          className="
            my-[clamp(20px,4vw,40px)]
            bg-[var(--card-bg)]
            border border-[var(--border-color)]
            rounded-[20px]
            px-[clamp(32px,6vw,48px)]
            py-[clamp(32px,6vw,48px)]
            shadow-[0_20px_40px_var(--shadow-color)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_25px_50px_var(--shadow-color)]
            w-full
          "
        >
          {/* Logo */}
          <Link
            to="/home"
            className="
              block text-center no-underline
              mb-[clamp(24px,5vw,40px)]
              transition-transform duration-300
              hover:scale-105
            "
          >
            <img
              src="./../logo.jpg"
              alt="SupFile"
              className="w-[clamp(120px,20vw,180px)] mx-auto object-contain"
            />
          </Link>

          <h2
            className="
              text-center font-semibold leading-tight
              text-[clamp(18px,4vw,20px)]
              text-[var(--text-primary)]
              mb-[clamp(12px,2vw,16px)]
              transition-colors duration-300
            "
          >
            Reset your password
          </h2>

          <p
            className="
              text-center
              text-[clamp(14px,3vw,16px)]
              text-[var(--text-secondary)]
              mb-[clamp(24px,5vw,32px)]
              leading-relaxed
            "
          >
            Enter your new password below.
          </p>

          <form
            className="flex flex-col gap-[clamp(16px,3vw,20px)] mb-[clamp(18px,5vw,24px)]"
            onSubmit={handleSubmit}
          >
            {/* New password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                required
                className="
                  w-full
                  px-[clamp(16px,3vw,20px)] pr-12
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
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                required
                className="
                  w-full
                  px-[clamp(16px,3vw,20px)] pr-12
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
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
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
                ${loading && "cursor-not-allowed opacity-80"}
              `}
            >
              {loading ? (
                <SyncLoader color="#fff" loading={loading} size={8} />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="
                inline-flex items-center gap-2
                font-semibold
                text-[var(--text-secondary)] hover:text-[var(--accent-color)]
                text-[clamp(13px,2.5vw,14px)]
                transition-colors
              "
            >
              <ArrowLeft size={16} />
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
