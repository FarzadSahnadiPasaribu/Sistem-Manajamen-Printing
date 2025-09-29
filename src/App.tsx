import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Printer, LogOut, User, Shield } from 'lucide-react';
import { PrintQueue } from './components/print-queue';
import { PrintForm } from './components/print-form';
import { PrinterIntegration } from './components/printer-integration';
import { AutoPrinterManager } from './components/auto-printer-manager';
import { AuthSystem } from './components/auth-system';
import { AdminManagement } from './components/admin-management';

export interface PrintFile {
  fileName: string;
  fileSize: string;
}

export interface PrintJob {
  id: string;
  ownerName: string;
  files: PrintFile[];
  notes?: string;
  timestamp: Date;
  status: 'waiting' | 'printing' | 'completed';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user';
  registrationDate: Date;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [showPrinterIntegration, setShowPrinterIntegration] = useState(false);
  const [showAutoPrinterManager, setShowAutoPrinterManager] = useState(false);
  const [showAdminManagement, setShowAdminManagement] = useState(false);
  const [selectedJobForPrint, setSelectedJobForPrint] = useState<PrintJob | null>(null);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([
    {
      id: '1',
      ownerName: 'Ahmad Rizki',
      files: [
        { fileName: 'Laporan_Keuangan_Q3.pdf', fileSize: '2.3 MB' },
        { fileName: 'Lampiran_Data.xlsx', fileSize: '1.1 MB' }
      ],
      notes: 'Print 3 rangkap, kertas A4',
      timestamp: new Date('2024-09-26T09:15:00'),
      status: 'printing'
    },
    {
      id: '2',
      ownerName: 'Siti Nurhaliza',
      files: [
        { fileName: 'Proposal_Bisnis.docx', fileSize: '1.8 MB' }
      ],
      notes: 'Warna, hard cover',
      timestamp: new Date('2024-09-26T09:20:00'),
      status: 'waiting'
    },
    {
      id: '3',
      ownerName: 'Budi Santoso',
      files: [
        { fileName: 'Skripsi_Final.pdf', fileSize: '5.2 MB' },
        { fileName: 'Cover_Skripsi.pdf', fileSize: '0.5 MB' },
        { fileName: 'Daftar_Pustaka.pdf', fileSize: '0.3 MB' }
      ],
      notes: 'Jilid spiral, print bolak-balik',
      timestamp: new Date('2024-09-26T09:25:00'),
      status: 'waiting'
    },
    {
      id: '4',
      ownerName: 'Maya Sari',
      files: [
        { fileName: 'Presentasi_Meeting.pptx', fileSize: '4.2 MB' }
      ],
      notes: 'Print slide notes juga',
      timestamp: new Date('2024-09-26T08:45:00'),
      status: 'completed'
    },
    {
      id: '5',
      ownerName: 'Dedi Kurniawan',
      files: [
        { fileName: 'CV_Terbaru.pdf', fileSize: '0.8 MB' },
        { fileName: 'Surat_Lamaran.docx', fileSize: '0.3 MB' }
      ],
      notes: 'Print di kertas foto untuk CV',
      timestamp: new Date('2024-09-26T10:15:00'),
      status: 'waiting'
    },
    {
      id: '6',
      ownerName: 'Rina Handayani',
      files: [
        { fileName: 'Tugas_Akhir.pdf', fileSize: '12.5 MB' }
      ],
      notes: 'Kertas A4, print 2 sisi',
      timestamp: new Date('2024-09-26T10:30:00'),
      status: 'waiting'
    },
    {
      id: '7',
      ownerName: 'Farid Rahman',
      files: [
        { fileName: 'Foto_Keluarga_1.jpg', fileSize: '2.1 MB' },
        { fileName: 'Foto_Keluarga_2.jpg', fileSize: '1.8 MB' },
        { fileName: 'Foto_Keluarga_3.jpg', fileSize: '2.3 MB' }
      ],
      notes: 'Print foto ukuran 4R, kertas glossy',
      timestamp: new Date('2024-09-26T08:30:00'),
      status: 'completed'
    },
    {
      id: '8',
      ownerName: 'Indra Wijaya',
      files: [
        { fileName: 'Kontrak_Kerja.pdf', fileSize: '1.2 MB' }
      ],
      notes: 'Print 3 rangkap untuk tanda tangan',
      timestamp: new Date('2024-09-26T09:45:00'),
      status: 'printing'
    },
    {
      id: '9',
      ownerName: 'Sari Wulandari',
      files: [
        { fileName: 'Makalah_Penelitian.docx', fileSize: '3.4 MB' },
        { fileName: 'Grafik_Data.xlsx', fileSize: '1.1 MB' },
        { fileName: 'Lampiran_Foto.pdf', fileSize: '5.2 MB' }
      ],
      notes: 'Jilid spiral, cover warna biru',
      timestamp: new Date('2024-09-26T11:00:00'),
      status: 'waiting'
    }
  ]);

  const addPrintJob = (jobData: Omit<PrintJob, 'id' | 'timestamp' | 'status'>) => {
    const newJob: PrintJob = {
      ...jobData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'waiting'
    };
    setPrintJobs(prev => [...prev, newJob]);
  };

  const removePrintJob = (id: string) => {
    setPrintJobs(prev => prev.filter(job => job.id !== id));
  };

  const updateJobStatus = (id: string, status: PrintJob['status']) => {
    setPrintJobs(prev => 
      prev.map(job => job.id === id ? { ...job, status } : job)
    );
  };

  const handleShowPrinterIntegration = (job: PrintJob) => {
    setSelectedJobForPrint(job);
    setShowPrinterIntegration(true);
  };

  const handlePrintComplete = (jobId: string) => {
    updateJobStatus(jobId, 'completed');
    setTimeout(() => {
      setShowPrinterIntegration(false);
      setSelectedJobForPrint(null);
    }, 2000);
  };

  const handlePrintError = (jobId: string, error: string) => {
    console.error(`Print error for job ${jobId}:`, error);
    // Bisa tambahkan logic error handling di sini
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowPrinterIntegration(false);
    setShowAutoPrinterManager(false);
    setShowAdminManagement(false);
    setSelectedJobForPrint(null);
  };

  // Show auth system if user not logged in
  if (!currentUser) {
    return <AuthSystem onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-teal-50/50 to-cyan-50">
      {/* Animated Particles Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-teal-400/60 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-cyan-400/50 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 left-1/4 w-1 h-1 bg-orange-400/70 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-teal-300/60 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-amber-400/50 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-cyan-500/70 rounded-full animate-float" style={{animationDelay: '5s'}}></div>
        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-teal-500/60 rounded-full animate-float" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-orange-500/70 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tl from-white/80 via-transparent to-teal-100/30"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-teal-100/20 to-cyan-100/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-100/20 to-amber-100/30 rounded-full filter blur-2xl"></div>
      </div>
      
      {/* Enhanced Header - Sticky */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-teal-200/50 shadow-lg">
        <div className="max-w-full px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-3xl shadow-xl ${
                currentUser.role === 'super-admin' 
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                  : currentUser.role === 'admin'
                    ? 'bg-gradient-to-br from-red-500 to-pink-600' 
                    : 'bg-gradient-to-br from-teal-500 to-cyan-600'
              }`}>
                <Printer className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-bold bg-clip-text text-transparent ${
                  currentUser.role === 'super-admin'
                    ? 'bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600'
                    : currentUser.role === 'admin'
                      ? 'bg-gradient-to-r from-gray-800 via-red-600 to-pink-600'
                      : 'bg-gradient-to-r from-gray-800 via-teal-600 to-cyan-600'
                }`}>
                  CopyXpress
                </h1>
                <p className="text-gray-600 font-medium">Layanan Print Online Premium ⚡</p>
              </div>
            </div>

            {/* Right - User Info & Controls */}
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  currentUser.role === 'super-admin' ? 'bg-purple-100' :
                  currentUser.role === 'admin' ? 'bg-red-100' : 'bg-teal-100'
                }`}>
                  {currentUser.role === 'super-admin' ? 
                    <Shield className="h-5 w-5 text-purple-600" /> :
                    currentUser.role === 'admin' ? 
                      <Shield className="h-5 w-5 text-red-600" /> : 
                      <User className="h-5 w-5 text-teal-600" />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{currentUser.name}</span>
                    <Badge className={
                      currentUser.role === 'super-admin' 
                        ? 'bg-purple-100 text-purple-700 border-purple-200' :
                      currentUser.role === 'admin' 
                        ? 'bg-red-100 text-red-700 border-red-200' 
                        : 'bg-teal-100 text-teal-700 border-teal-200'
                    }>
                      {currentUser.role === 'super-admin' ? '👑 Super Admin' : 
                       currentUser.role === 'admin' ? '🔧 Admin' : '👤 User'}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">{currentUser.email}</div>
                </div>
              </div>

              {/* Super Admin Controls */}
              {currentUser.role === 'super-admin' && (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowAdminManagement(true)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md"
                  >
                    👥 Kelola Admin
                  </Button>
                  <Button
                    onClick={() => setShowAutoPrinterManager(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md"
                  >
                    🚀 Auto Print
                  </Button>
                </div>
              )}

              {/* Admin Controls */}
              {currentUser.role === 'admin' && (
                <Button
                  onClick={() => setShowAutoPrinterManager(true)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md"
                >
                  🚀 Auto Print
                </Button>
              )}

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
          <p className={`text-lg mt-2 text-center ${
            currentUser.role === 'super-admin' ? 'text-purple-600' :
            currentUser.role === 'admin' ? 'text-red-600' : 'text-teal-600'
          }`}>
            {currentUser.role === 'super-admin' 
              ? 'Dashboard Super Admin - Kelola admin dan semua operasi sistem 👑' :
             currentUser.role === 'admin' 
              ? 'Dashboard Admin - Kelola antrian print dan operasi 🔧' 
              : 'Dashboard User - Submit dan track job print Anda 🚀'
            }
          </p>
        </div>
      </div>



      {/* Main Content - Scrollable Layout */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row">
          {/* Left Column - Form */}
          <div className="w-full lg:w-[400px] lg:flex-shrink-0">
            <div className="p-6 bg-white/85 backdrop-blur-xl border-r lg:border-r border-teal-200/30">
              <PrintForm onAddJob={addPrintJob} userRole={currentUser.role} />
            </div>
          </div>

          {/* Visual Separator - Hidden on mobile */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-teal-300/40 to-transparent shadow-lg">
            <div className="w-full h-full bg-gradient-to-b from-teal-200/30 via-cyan-300/50 to-teal-200/30"></div>
          </div>

          {/* Right Column - Queue, Printer Integration, Auto Manager, atau Admin Management */}
          <div className="flex-1 bg-white/70 backdrop-blur-sm min-w-0">
            <div className="min-h-[800px]">
              {showAdminManagement ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Manajemen Admin</h2>
                    <Button
                      variant="outline"
                      onClick={() => setShowAdminManagement(false)}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      ← Kembali ke Antrian
                    </Button>
                  </div>
                  <AdminManagement />
                </div>
              ) : showAutoPrinterManager ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Auto Printer Manager</h2>
                    <Button
                      variant="outline"
                      onClick={() => setShowAutoPrinterManager(false)}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      ← Kembali ke Antrian
                    </Button>
                  </div>
                  <AutoPrinterManager
                    jobs={printJobs}
                    onUpdateJobStatus={updateJobStatus}
                  />
                </div>
              ) : showPrinterIntegration ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Printer Integration</h2>
                    <Button
                      variant="outline"
                      onClick={() => setShowPrinterIntegration(false)}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      ← Kembali ke Antrian
                    </Button>
                  </div>
                  <PrinterIntegration
                    currentJob={selectedJobForPrint || undefined}
                    onPrintComplete={handlePrintComplete}
                    onPrintError={handlePrintError}
                  />
                </div>
              ) : (
                <PrintQueue 
                  jobs={printJobs}
                  onRemoveJob={(currentUser.role === 'admin' || currentUser.role === 'super-admin') ? removePrintJob : undefined}
                  onUpdateStatus={(currentUser.role === 'admin' || currentUser.role === 'super-admin') ? updateJobStatus : undefined}
                  onShowPrinterIntegration={(currentUser.role === 'admin' || currentUser.role === 'super-admin') ? handleShowPrinterIntegration : undefined}
                  userRole={currentUser.role}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl border-t border-teal-200/50 px-8 py-6 text-center shadow-lg mt-8">
        <p className="text-gray-600 font-medium">© 2024 CopyXpress. Semua hak dilindungi. ✨🚀</p>
      </div>
    </div>
  );
}