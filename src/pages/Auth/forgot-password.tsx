import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ForgotPassword } from "../../services/auth";
import { SyncLoader } from "react-spinners";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await ForgotPassword(email);

      if (res && res.data && res.data.success) {
        toast.success(res.data.message || "Reset link sent!");
        setSubmitted(true);
      }
    } catch (err) {
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

          {!submitted ? (
            <>
              {/* Title */}
              <h2
                className="
                  text-center font-semibold leading-tight
                 text-[clamp(18px,4vw,20px)]
                  text-[var(--text-primary)]
                  mb-[clamp(12px,2vw,16px)]
                  transition-colors duration-300
                "
              >
                Forgot Password
              </h2>

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
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Form */}
              <form
                className="
                  flex flex-col
                  gap-[clamp(16px,3vw,20px)]
                  mb-[clamp(18px,5vw,24px)]
                "
                onSubmit={handleSubmit}
              >
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
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

                {/* Submit */}
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
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-fade-in-scale">
               <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center animate-bounce-subtle">
                    <Mail className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Check your email</h3>
                <p className="text-[var(--text-secondary)] mb-8">
                  We have sent a password reset link to <span className="font-semibold text-[var(--text-primary)]">{email}</span>.
                </p>
            </div>
          )}

          {/* Back to sign in */}
          <div
            className="
              text-center
              transition-colors
              mt-4
            "
          >
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

export default ForgotPasswordPage;
