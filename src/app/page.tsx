import { FaHome, FaUsers, FaMoneyBillWave, FaChartBar, FaHandsHelping } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-[#2C3E50] text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaHome className="text-2xl" />
            <span className="text-xl font-bold">RT Management</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-[#3498DB] transition">Beranda</a>
            <a href="#" className="hover:text-[#3498DB] transition">Fitur</a>
            <a href="#" className="hover:text-[#3498DB] transition">Tentang</a>
            <a href="#" className="hover:text-[#3498DB] transition">Kontak</a>
          </div>
          <button className="bg-[#3498DB] hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
            Masuk
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Kelola Administrasi RT dengan Mudah</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sistem manajemen iuran bulanan dan pendataan warga yang sederhana untuk RT Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-[#2C3E50] hover:bg-gray-100 px-6 py-3 rounded-md font-semibold transition">
              Mulai Sekarang
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-[#2C3E50] px-6 py-3 rounded-md font-semibold transition">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">Fitur Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaUsers className="text-4xl mb-4 text-[#3498DB]" />}
              title="Manajemen Warga"
              description="Kelola data penghuni tetap dan sementara dengan mudah."
            />
            <FeatureCard 
              icon={<FaMoneyBillWave className="text-4xl mb-4 text-[#3498DB]" />}
              title="Iuran Bulanan"
              description="Tagihan otomatis untuk iuran satpam dan kebersihan."
            />
            <FeatureCard 
              icon={<FaChartBar className="text-4xl mb-4 text-[#3498DB]" />}
              title="Laporan Keuangan"
              description="Pantau pengeluaran RT seperti perbaikan jalan dan gaji satpam."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">Cara Kerja Sistem</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard 
              step="1"
              title="Pendataan Warga"
              description="Masukkan data penghuni tetap dan sementara."
            />
            <StepCard 
              step="2"
              title="Tagihan Otomatis"
              description="Sistem membuat tagihan bulanan secara otomatis."
            />
            <StepCard 
              step="3"
              title="Pembayaran"
              description="Warga membayar melalui sistem atau langsung ke RT."
            />
            <StepCard 
              step="4"
              title="Laporan"
              description="Dapatkan laporan keuangan bulanan secara detail."
            />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">Apa Kata Mereka</h2>
          <div className="max-w-3xl mx-auto bg-[#2C3E50] text-white p-8 rounded-lg shadow-lg">
            <p className="text-lg italic mb-4">
              "Sebagai RT, sistem ini sangat membantu saya mengelola iuran bulanan dan pendataan warga. Sekarang tidak perlu lagi mencatat manual di buku besar."
            </p>
            <div className="flex items-center">
              <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
              <div className="ml-4">
                <p className="font-semibold">Bapak Budi</p>
                <p className="text-gray-300">RT 05 Perumahan Elite</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#3498DB] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Mengelola RT Anda dengan Lebih Baik?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Mulai gunakan sistem kami sekarang dan rasakan kemudahan dalam mengelola administrasi RT.
          </p>
          <button className="bg-white text-[#2C3E50] hover:bg-gray-100 px-8 py-3 rounded-md font-semibold text-lg transition">
            Daftar Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C3E50] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FaHome className="text-xl" />
              <span className="text-lg font-bold">RT Management</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#3498DB] transition">Tentang Kami</a>
              <a href="#" className="hover:text-[#3498DB] transition">Kebijakan Privasi</a>
              <a href="#" className="hover:text-[#3498DB] transition">Kontak</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} RT Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
      {icon}
      <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Step Card Component
interface StepCardProps {
  step: string;
  title: string;
  description: string;
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
      <div className="bg-[#3498DB] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}