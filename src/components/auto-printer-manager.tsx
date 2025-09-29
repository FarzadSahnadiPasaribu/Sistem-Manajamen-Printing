import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { 
  Printer, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Wifi,
  Usb,
  Monitor
} from 'lucide-react';
import { PrintJob } from '../App';

interface PrinterDevice {
  id: string;
  name: string;
  type: 'network' | 'usb' | 'bluetooth';
  status: 'online' | 'offline' | 'busy' | 'error';
  paperLevel: number;
  inkLevel: number;
  location?: string;
  priority: number;
}

interface AutoPrinterManagerProps {
  jobs: PrintJob[];
  onUpdateJobStatus: (id: string, status: PrintJob['status']) => void;
}

export function AutoPrinterManager({ jobs, onUpdateJobStatus }: AutoPrinterManagerProps) {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedJobs, setProcessedJobs] = useState<string[]>([]);
  
  const [printers] = useState<PrinterDevice[]>([
    {
      id: 'hp-laser-01',
      name: 'HP LaserJet Pro M404dn',
      type: 'network',
      status: 'online',
      paperLevel: 85,
      inkLevel: 92,
      location: 'Lantai 1 - Admin',
      priority: 1
    },
    {
      id: 'canon-color-02',
      name: 'Canon PIXMA G7020',
      type: 'usb',
      status: 'online',
      paperLevel: 60,
      inkLevel: 45,
      location: 'Lantai 2 - Print Room',
      priority: 2
    },
    {
      id: 'epson-photo-03',
      name: 'Epson EcoTank L3250',
      type: 'network',
      status: 'online',
      paperLevel: 25,
      inkLevel: 78,
      location: 'Counter Foto',
      priority: 3
    }
  ]);

  const waitingJobs = jobs.filter(job => job.status === 'waiting');
  const printingJobs = jobs.filter(job => job.status === 'printing');
  const onlinePrinters = printers.filter(p => p.status === 'online');

  // Auto-assign printer berdasarkan priority dan availability
  const getAvailablePrinter = () => {
    return printers
      .filter(p => p.status === 'online' && p.paperLevel > 10 && p.inkLevel > 10)
      .sort((a, b) => a.priority - b.priority)[0];
  };

  // Auto print semua waiting jobs
  const startAutoPrint = async () => {
    if (waitingJobs.length === 0) {
      alert('Tidak ada job yang menunggu!');
      return;
    }

    setIsProcessing(true);
    
    // Process jobs satu per satu dengan delay
    for (const job of waitingJobs) {
      const availablePrinter = getAvailablePrinter();
      
      if (availablePrinter) {
        console.log(`Auto-printing job ${job.id} on printer ${availablePrinter.name}`);
        
        // Update status ke printing
        onUpdateJobStatus(job.id, 'printing');
        
        // Simulasi printing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulasi progress dan completion
        setTimeout(() => {
          onUpdateJobStatus(job.id, 'completed');
          setProcessedJobs(prev => [...prev, job.id]);
        }, Math.random() * 3000 + 2000);
      }
      
      // Delay antar job
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsProcessing(false);
  };

  // Auto print mode - otomatis print job baru
  useEffect(() => {
    if (isAutoMode && waitingJobs.length > 0 && !isProcessing) {
      const timer = setTimeout(() => {
        const availablePrinter = getAvailablePrinter();
        if (availablePrinter && printingJobs.length < 3) { // Max 3 concurrent prints
          const nextJob = waitingJobs[0];
          console.log(`Auto mode: printing job ${nextJob.id}`);
          onUpdateJobStatus(nextJob.id, 'printing');
          
          // Auto complete after simulation
          setTimeout(() => {
            onUpdateJobStatus(nextJob.id, 'completed');
            setProcessedJobs(prev => [...prev, nextJob.id]);
          }, Math.random() * 5000 + 3000);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [waitingJobs, isAutoMode, isProcessing, printingJobs.length, onUpdateJobStatus]);

  const getTypeIcon = (type: PrinterDevice['type']) => {
    switch (type) {
      case 'network': return <Wifi className="h-4 w-4 text-blue-600" />;
      case 'usb': return <Usb className="h-4 w-4 text-purple-600" />;
      case 'bluetooth': return <Monitor className="h-4 w-4 text-teal-600" />;
    }
  };

  const getStatusIcon = (status: PrinterDevice['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'offline': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'busy': return <Activity className="h-4 w-4 text-orange-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Auto Printer Manager
            </h2>
            <p className="text-gray-600 font-medium">Sistem otomatis untuk semua job print 🚀</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Auto Mode</label>
            <Switch
              checked={isAutoMode}
              onCheckedChange={setIsAutoMode}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-600"
            />
          </div>
          <Badge className={isAutoMode ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
            {isAutoMode ? '🟢 AUTO ON' : '🔴 MANUAL'}
          </Badge>
        </div>
      </div>

      {/* Auto Print Status */}
      <Card className="shadow-lg border border-indigo-200/50 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            Status Print Otomatis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{waitingJobs.length}</div>
              <div className="text-sm text-gray-600">Menunggu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{printingJobs.length}</div>
              <div className="text-sm text-gray-600">Sedang Print</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{onlinePrinters.length}</div>
              <div className="text-sm text-gray-600">Printer Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{processedJobs.length}</div>
              <div className="text-sm text-gray-600">Total Processed</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={startAutoPrint}
              disabled={waitingJobs.length === 0 || isProcessing}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : `Auto Print Semua (${waitingJobs.length} Jobs)`}
            </Button>
            
            <Button
              onClick={() => setProcessedJobs([])}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Counter
            </Button>
          </div>

          {isProcessing && (
            <Alert className="bg-blue-50 border-blue-200">
              <Activity className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Sedang memproses {waitingJobs.length} job secara otomatis... ⚡
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Printer Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {printers.map((printer) => (
          <Card key={printer.id} className="shadow-lg border border-gray-200/50 bg-white/95">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(printer.type)}
                  <h4 className="font-semibold text-gray-800 text-sm">{printer.name}</h4>
                </div>
                <Badge className={`
                  ${printer.status === 'online' ? 'bg-green-100 text-green-700' : ''}
                  ${printer.status === 'offline' ? 'bg-red-100 text-red-700' : ''}
                  ${printer.status === 'busy' ? 'bg-orange-100 text-orange-700' : ''}
                  ${printer.status === 'error' ? 'bg-red-100 text-red-700' : ''}
                `}>
                  {getStatusIcon(printer.status)}
                  <span className="ml-1 text-xs capitalize">{printer.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-gray-600">
                📍 {printer.location} | Priority: #{printer.priority}
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Kertas</span>
                    <span>{printer.paperLevel}%</span>
                  </div>
                  <Progress value={printer.paperLevel} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Tinta</span>
                    <span>{printer.inkLevel}%</span>
                  </div>
                  <Progress value={printer.inkLevel} className="h-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auto Mode Info */}
      {isAutoMode && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>Mode Auto Aktif!</strong> Semua job baru akan otomatis dikirim ke printer yang tersedia.
            Sistem akan memilih printer berdasarkan priority dan availability. ✨
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}