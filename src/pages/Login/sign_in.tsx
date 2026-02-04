import React from "react";
import { Link } from "react-router-dom";

const SignIn: React.FC = () => {
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
              src="./../logo.png"
              alt="SupFile"
              className="w-[clamp(120px,20vw,180px)] mx-auto object-contain"
            />
          </Link>

          {/* Title */}
          <h2
            className="
              text-center font-bold leading-tight
              text-[clamp(20px,4vw,28px)]
              text-[var(--text-primary)]
              mb-[clamp(24px,5vw,32px)]
              transition-colors duration-300
            "
          >
            Sign in to your account to access your files
          </h2>

          {/* Form */}
          <form
            className="
              flex flex-col
              gap-[clamp(16px,3vw,20px)]
              mb-[clamp(24px,5vw,32px)]
            "
          >
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
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="
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
              "
            >
              Sign In
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
              max-[480px]:flex-col
            "
          >
            {[
              { label: "Google", icon: GoogleIcon },
              { label: "GitHub", icon: GitHubIcon },
              { label: "Microsoft", icon: MicrosoftIcon },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="
                  flex items-center justify-center gap-[clamp(8px,2vw,12px)]
                  px-[clamp(16px,3vw,20px)]
                  py-[clamp(12px,3vw,14px)]
                  min-w-[100px] flex-1
                  rounded-xl
                  border-2 border-[var(--border-color)]
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
                <Icon />
                {label}
              </button>
            ))}
          </div>

          {/* Signup */}
          <div
            className="
              text-center
              text-[var(--text-secondary)]
              text-[clamp(13px,2.5vw,14px)]
              transition-colors
            "
          >
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="
                font-semibold
                text-[var(--accent-color)]
                transition-colors
                hover:text-[var(--accent-hover)]
                hover:underline
              "
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

/* Inline icon components below */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <rect x="2" y="2" width="9" height="9" fill="#F25022" />
    <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
    <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
    <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
  </svg>
);
