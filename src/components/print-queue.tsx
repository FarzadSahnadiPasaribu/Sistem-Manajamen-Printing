import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  List, 
  FileText, 
  User, 
  Clock, 
  Trash2, 
  Play, 
  CheckCircle,
  Pause,
  Files,
  Activity,
  Timer,
  CircleCheck,
  Printer
} from 'lucide-react';
import { PrintJob } from '../App';

interface PrintQueueProps {
  jobs: PrintJob[];
  onRemoveJob?: (id: string) => void;
  onUpdateStatus?: (id: string, status: PrintJob['status']) => void;
  onShowPrinterIntegration?: (job: PrintJob) => void;
  userRole?: 'super-admin' | 'admin' | 'user';
}

export function PrintQueue({ jobs, onRemoveJob, onUpdateStatus, onShowPrinterIntegration, userRole = 'user' }: PrintQueueProps) {
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: PrintJob['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md';
      case 'printing':
        return 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md';
      case 'completed':
        return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md';
      default:
        return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-md';
    }
  };

  const getStatusIcon = (status: PrintJob['status']) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-3 w-3" />;
      case 'printing':
        return <Play className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Pause className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: PrintJob['status']) => {
    switch (status) {
      case 'waiting':
        return 'Menunggu';
      case 'printing':
        return 'Sedang Print';
      case 'completed':
        return 'Selesai';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const waitingJobs = jobs.filter(job => job.status === 'waiting');
  const printingJobs = jobs.filter(job => job.status === 'printing');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  const getFilteredJobs = () => {
    switch (activeTab) {
      case 'waiting': return waitingJobs;
      case 'printing': return printingJobs;
      case 'completed': return completedJobs;
      default: return jobs;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white/95 backdrop-blur-lg border-b border-teal-200/50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="flex items-center gap-2 mb-0.5">
              <div className={`p-1.5 rounded-xl shadow-md ${
                userRole === 'super-admin' 
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600' :
                userRole === 'admin' 
                  ? 'bg-gradient-to-br from-red-500 to-pink-600' 
                  : 'bg-gradient-to-br from-teal-500 to-cyan-600'
              }`}>
                <List className="h-4 w-4 text-white" />
              </div>
              <span className={`text-lg font-bold bg-clip-text text-transparent ${
                userRole === 'super-admin'
                  ? 'bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600' :
                userRole === 'admin'
                  ? 'bg-gradient-to-r from-gray-800 via-red-600 to-pink-600'
                  : 'bg-gradient-to-r from-gray-800 via-teal-600 to-cyan-600'
              }`}>
                {userRole === 'super-admin' ? 'Super Admin: Antrian Print' :
                 userRole === 'admin' ? 'Admin: Antrian Print' : 'Antrian Print'}
              </span>
            </h2>
            <p className="text-gray-600 ml-10 font-medium text-xs">
              {userRole === 'admin' 
                ? 'Kelola semua job print dengan kontrol penuh 👑' 
                : 'Daftar semua file yang akan di-print 🚀'
              }
            </p>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-md px-2 py-1 text-xs font-bold">
            {jobs.length} Total Job ⚡
          </Badge>
        </div>

        {/* Statistics Cards - Extra Compact */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Card className="shadow-sm border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 hover:scale-105 transition-all duration-300">
            <CardContent className="p-1.5 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-0.5 rounded-md shadow-sm">
                  <Timer className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-orange-600 text-base font-bold">{waitingJobs.length}</span>
              </div>
              <div className="text-orange-600 font-semibold text-[10px]">Menunggu</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 hover:scale-105 transition-all duration-300">
            <CardContent className="p-1.5 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-0.5 rounded-md shadow-sm">
                  <Activity className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-teal-600 text-base font-bold">{printingJobs.length}</span>
              </div>
              <div className="text-teal-600 font-semibold text-[10px]">Print</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:scale-105 transition-all duration-300">
            <CardContent className="p-1.5 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-0.5 rounded-md shadow-sm">
                  <CircleCheck className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-emerald-600 text-base font-bold">{completedJobs.length}</span>
              </div>
              <div className="text-emerald-600 font-semibold text-[10px]">Selesai</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different status */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-lg border border-teal-200/50 shadow-md rounded-xl p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-teal-50 transition-all duration-300 rounded-lg font-semibold text-xs py-1.5">
              <Files className="h-2.5 w-2.5 mr-1" />
              Semua ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="waiting" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-teal-50 transition-all duration-300 rounded-lg font-semibold text-xs py-1.5">
              <Timer className="h-2.5 w-2.5 mr-1" />
              Menunggu ({waitingJobs.length})
            </TabsTrigger>
            <TabsTrigger value="printing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-teal-50 transition-all duration-300 rounded-lg font-semibold text-xs py-1.5">
              <Activity className="h-2.5 w-2.5 mr-1" />
              Print ({printingJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-teal-50 transition-all duration-300 rounded-lg font-semibold text-xs py-1.5">
              <CircleCheck className="h-2.5 w-2.5 mr-1" />
              Selesai ({completedJobs.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
          <TabsContent value={activeTab} className="flex-1 mt-0">
            <div className="p-4 pt-2">
              <Card className="shadow-lg border border-teal-200/50 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  {/* Job List */}
                  <div className="pb-4">
                    {getFilteredJobs().length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                          <List className="h-12 w-12 text-gray-500" />
                        </div>
                        <p className="text-xl font-semibold mb-3 text-gray-600">
                          {activeTab === 'all' ? 'Belum ada job print dalam antrian 📝' :
                           activeTab === 'waiting' ? 'Tidak ada job yang menunggu ⏳' :
                           activeTab === 'printing' ? 'Tidak ada job yang sedang diprint 🖨️' :
                           'Tidak ada job yang selesai ✅'}
                        </p>
                        <p className="text-gray-500 font-medium">
                          {activeTab === 'all' ? 'Tambahkan job baru menggunakan form di sebelah kiri ✨🚀' : 
                           'Pilih tab "Semua" untuk melihat semua job 👁️✨'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {getFilteredJobs().map((job, index) => (
                          <div
                            key={job.id}
                            className="p-4 border border-gray-200/50 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 hover:-translate-y-1 hover:scale-[1.01] hover:bg-white w-full"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-2 rounded-lg min-w-[2.5rem] text-center shadow-md">
                                  <span className="text-white font-bold text-sm">#{jobs.indexOf(job) + 1}</span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <User className="h-4 w-4 text-teal-600" />
                                    <span className="font-bold text-gray-800 text-base">{job.ownerName}</span>
                                  </div>
                                  <Badge className={`${getStatusColor(job.status)} text-xs font-semibold border-0`}>
                                    {getStatusIcon(job.status)}
                                    <span className="ml-1">{getStatusText(job.status)}</span>
                                  </Badge>
                                </div>
                              </div>
                              {onRemoveJob && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onRemoveJob(job.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 h-auto transition-all duration-300 hover:scale-110"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="space-y-2">
                              {/* Files List - Compact */}
                              <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                  <Files className="h-4 w-4 text-teal-600" />
                                  <span className="font-semibold">{job.files.length} file{job.files.length > 1 ? 's' : ''} 📄</span>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatTime(job.timestamp)}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {job.files.map((file, fileIndex) => (
                                    <div key={fileIndex} className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/50 rounded-md text-xs font-medium hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 transition-all duration-300">
                                      <FileText className="h-3 w-3 text-teal-600" />
                                      <span className="font-semibold text-gray-700 max-w-[100px] truncate">{file.fileName}</span>
                                      <span className="text-gray-500">({file.fileSize})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {job.notes && (
                                <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200/50">
                                  <span className="font-bold text-orange-600 text-sm">📝 Catatan: </span>
                                  <span className="text-gray-700 text-sm font-medium">{job.notes}</span>
                                </div>
                              )}
                            </div>

                            {/* Status Control Buttons - Admin Only */}
                            {job.status === 'waiting' && onUpdateStatus && (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => onUpdateStatus(job.id, 'printing')}
                                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all duration-300 text-xs px-3 py-2 h-auto rounded-lg font-semibold hover:scale-105"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Mulai Print 🚀
                                </Button>
                                {onShowPrinterIntegration && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onShowPrinterIntegration(job)}
                                    className="border-purple-300 text-purple-600 hover:bg-purple-50 shadow-md text-xs px-3 py-2 h-auto rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                                  >
                                    <Printer className="h-3 w-3 mr-1" />
                                    Print 🖨️
                                  </Button>
                                )}
                              </div>
                            )}

                            {job.status === 'printing' && onUpdateStatus && (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => onUpdateStatus(job.id, 'completed')}
                                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 text-xs px-3 py-2 h-auto rounded-lg font-semibold hover:scale-105"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Selesai ✅
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onUpdateStatus(job.id, 'waiting')}
                                  className="border-orange-300 text-orange-600 hover:bg-orange-50 shadow-md text-xs px-3 py-2 h-auto rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                                >
                                  <Pause className="h-3 w-3 mr-1" />
                                  Pause ⏸️
                                </Button>
                                {onShowPrinterIntegration && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onShowPrinterIntegration(job)}
                                    className="border-purple-300 text-purple-600 hover:bg-purple-50 shadow-md text-xs px-3 py-2 h-auto rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                                  >
                                    <Printer className="h-3 w-3 mr-1" />
                                    Monitor Print 📊
                                  </Button>
                                )}
                              </div>
                            )}

                            {/* User View - Read Only Info */}
                            {userRole === 'user' && job.status !== 'completed' && (
                              <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="text-xs text-blue-700 font-medium">
                                  👁️ Status: {getStatusText(job.status)} | Tracking ID: #{job.id}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}