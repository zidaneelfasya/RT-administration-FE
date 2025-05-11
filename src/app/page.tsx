import { FaHome, FaUsers, FaMoneyBillWave, FaChartBar, FaHandsHelping } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <a href='/login' className="header text-white text-8xl font-bold relative group md:text-6xl sm:text-4xl">
        Mulai RT-Management app
        <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
      </a>
    </div>
  );
}

