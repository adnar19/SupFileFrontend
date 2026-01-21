import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Folder, Share2, Globe } from "lucide-react";
import Navbar from '../../layouts/navbar';
import Footer from '../../layouts/footer';

const Home: React.FC = () => {
  
const features = [
  {
    title: "Secure Encryption",
    description: "Enterprise-grade security measures keeps your files completely private and secure. Your data, your rules.",
    icon: <ShieldCheck size={32} className="text-blue-500" />,
  },
  {
    title: "Smart Organization",
    description: "Intuitive folder system with powerful search. Find anything in seconds, not hours.",
    icon: <Folder size={32} className="text-blue-500" />,
  },
  {
    title: "Seamless Collaboration",
    description: "Share files with controlled permissions. Work together efficiently without compromising security.",
    icon: <Share2 size={32} className="text-blue-500" />,
  },
  {
    title: "Universal Access",
    description: "Your entire digital workspace in your pocket. Access, sync, and work from any device, anywhere.",
    icon: <Globe size={32} className="text-blue-500" />,
  },
];

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] transition-colors duration-300">

  <Navbar />

  <main className="flex-1 w-full py-[clamp(60px,10vw,100px)]">

    {/* Hero Section */}
    <section className="text-center mb-[clamp(100px,15vw,140px)] px-[clamp(20px,4vw,40px)]">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-[clamp(32px,6vw,56px)] font-bold text-[var(--text-primary)] leading-tight mb-[clamp(40px,6vw,48px)] transition-colors">
          Secure Cloud Storage For All Your Files
        </h1>

        <p className="text-[clamp(16px,3vw,20px)] text-[var(--text-secondary)] max-w-[600px] mx-auto mb-[clamp(60px,8vw,72px)] leading-relaxed transition-colors">
          Store, share, and organize your digital life seamlessly from anywhere.
          Access your documents, photos, and videos on any device with SupFile.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-[clamp(16px,3vw,24px)]">
          <Link
            to="/signup"
            className="bg-[var(--accent-color)] text-white font-semibold
                       text-[clamp(16px,3vw,20px)]
                       px-[clamp(32px,6vw,48px)]
                       py-[clamp(14px,3vw,18px)]
                       rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.3)]
                       transition-all duration-300
                       hover:-translate-y-0.5
                       hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)]
                       hover:bg-[var(--accent-hover)]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="px-[clamp(20px,4vw,40px)] mb-[clamp(100px,15vw,140px)]">
      <div className="text-center max-w-[800px] mx-auto mb-[clamp(80px,10vw,100px)]">
        <h2 className="text-[clamp(28px,5vw,40px)] font-bold text-[var(--text-primary)] leading-tight mb-[clamp(32px,4vw,40px)] transition-colors">
          Everything You Need, Nothing You Don't
        </h2>
        <p className="text-[clamp(16px,3vw,18px)] text-[var(--text-secondary)] max-w-[600px] mx-auto leading-relaxed transition-colors">
          Experience cloud storage that just works. Simple, secure, and accessible; exactly what modern productivity demands.
        </p>
      </div>
      
      <div
        className="grid gap-[clamp(40px,5vw,56px)]
                   grid-cols-1
                   sm:grid-cols-2
                   md:grid-cols-3
                   lg:grid-cols-4"
      >
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-[var(--card-bg)]
                     border border-[var(--border-color)]
                     rounded-2xl
                     p-[clamp(40px,5vw,56px)]
                     min-h-[360px]
                     flex flex-col justify-between
                     text-center
                     shadow-[0_10px_30px_var(--shadow-color)]
                     transition-all duration-300
                     hover:-translate-y-1
                     hover:border-[var(--accent-color)]
                     hover:shadow-[0_20px_40px_var(--shadow-color)]"
        >
          <div
            className="mx-auto mb-[clamp(24px,3vw,32px)]
                       flex items-center justify-center
                       w-[clamp(50px,8vw,70px)]
                       h-[clamp(50px,8vw,70px)]
                       rounded-full
                       bg-[rgba(59,130,246,0.1)]
                       transition-all duration-300
                       group-hover:scale-105"
          >
            {feature.icon}
          </div>

          <h3 className="text-[clamp(16px,2.5vw,20px)] font-semibold text-[var(--text-primary)] mb-[clamp(20px,3vw,24px)] transition-colors">
            {feature.title}
          </h3>

          <p className="text-[clamp(13px,2vw,15px)] text-[var(--text-secondary)] leading-relaxed transition-colors">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </section>
</main>

<Footer />
</div>

  );
};

export default Home;