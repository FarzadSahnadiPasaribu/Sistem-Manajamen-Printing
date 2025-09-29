import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Printer, 
  Wifi, 
  Usb, 
  Monitor,
  CheckCircle, 
  AlertTriangle,
  Zap,
  RefreshCw,
  Settings,
  Play,
  Eye,
  Activity
} from 'lucide-react';
import { PrintJob } from '../App';

interface PrinterDevice {
  id: string;
  name: string;
  type: 'system' | 'usb' | 'network';
  status: 'available' | 'busy' | 'offline' | 'error';
  isDefault?: boolean;
  description?: string;
}

interface PrinterIntegrationProps {
  currentJob?: PrintJob;
  onPrintComplete?: (jobId: string) => void;
  onPrintError?: (jobId: string, error: string) => void;
}

export function PrinterIntegration({ currentJob, onPrintComplete, onPrintError }: PrinterIntegrationProps) {
  const [printers, setPrinters] = useState<PrinterDevice[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  // Mock printer detection
  const scanPrinters = async () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPrinters: PrinterDevice[] = [
      {
        id: 'system-default',
        name: 'Default System Printer',
        type: 'system',
        status: 'available',
        isDefault: true,
        description: 'Printer default sistem'
      },
      {
        id: 'hp-printer-01',
        name: 'HP LaserJet Pro M404dn',
        type: 'network',
        status: 'available',
        description: 'Network printer di 192.168.1.100'
      },
      {
        id: 'canon-usb-01',
        name: 'Canon PIXMA G7020',
        type: 'usb',
        status: 'available',
        description: 'USB printer terhubung langsung'
      }
    ];
    
    setPrinters(mockPrinters);
    setSelectedPrinter(mockPrinters[0].id);
    setIsScanning(false);
  };

  // Print function using browser print dialog
  const handlePrint = async () => {
    if (!currentJob || !selectedPrinter) return;
    
    setIsPrinting(true);
    setPrintProgress(0);
    
    try {
      // Create print content
      const printContent = `
        <html>
          <head>
            <title>CopyXpress - Print Job #${currentJob.id}</title>
            <style>
              @media print {
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  color: #333;
                }
                .print-header { 
                  text-align: center; 
                  margin-bottom: 30px; 
                  border-bottom: 2px solid #14B8A6; 
                  padding-bottom: 15px; 
                }
                .job-info { 
                  margin-bottom: 25px; 
                  background: #f8fafc;
                  padding: 20px;
                  border-radius: 8px;
                  border: 1px solid #e2e8f0;
                }
                .files-list { 
                  margin-top: 20px; 
                }
                .file-item { 
                  padding: 12px; 
                  border: 1px solid #cbd5e1; 
                  margin: 8px 0; 
                  border-radius: 6px; 
                  background: #ffffff;
                }
                .footer { 
                  margin-top: 40px; 
                  text-align: center; 
                  font-size: 12px; 
                  color: #64748b; 
                  border-top: 1px solid #e2e8f0;
                  padding-top: 15px;
                }
                h1 { color: #14B8A6; margin-bottom: 5px; }
                h2 { color: #0f766e; margin-bottom: 15px; }
                h3 { color: #0f766e; margin-bottom: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>🖨️ CopyXpress Print Service</h1>
              <p style="margin: 0; color: #64748b;">Layanan Print Online Premium</p>
            </div>
            
            <div class="job-info">
              <h2>📋 Detail Job Print</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold; width: 30%;">Job ID:</td>
                  <td style="padding: 8px 0;">#${currentJob.id}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold;">Pemilik:</td>
                  <td style="padding: 8px 0;">${currentJob.ownerName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold;">Tanggal:</td>
                  <td style="padding: 8px 0;">${currentJob.timestamp.toLocaleDateString('id-ID')}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold;">Waktu:</td>
                  <td style="padding: 8px 0;">${currentJob.timestamp.toLocaleTimeString('id-ID')}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                  <td style="padding: 8px 0;">${currentJob.status}</td>
                </tr>
                ${currentJob.notes ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Catatan:</td>
                  <td style="padding: 8px 0;">${currentJob.notes}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div class="files-list">
              <h3>📁 Daftar File untuk di-print:</h3>
              ${currentJob.files.map((file, index) => `
                <div class="file-item">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>${index + 1}. ${file.fileName}</strong>
                      <div style="color: #64748b; font-size: 12px; margin-top: 4px;">
                        📦 Ukuran: ${file.fileSize}
                      </div>
                    </div>
                    <div style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                      ✅ READY
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="footer">
              <p><strong>Printer:</strong> ${printers.find(p => p.id === selectedPrinter)?.name || 'Unknown'}</p>
              <p>Dicetak melalui CopyXpress • ${new Date().toLocaleString('id-ID')}</p>
              <p>Terima kasih telah menggunakan layanan kami! ✨🚀</p>
            </div>
          </body>
        </html>
      `;

      // Progress simulation
      const progressInterval = setInterval(() => {
        setPrintProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 25;
        });
      }, 300);

      // Open print dialog
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Small delay then trigger print
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          
          // Handle completion
          const handleAfterPrint = () => {
            setPrintProgress(100);
            setTimeout(() => {
              setIsPrinting(false);
              onPrintComplete?.(currentJob.id);
              printWindow.close();
            }, 1000);
          };

          printWindow.onafterprint = handleAfterPrint;
          
          // Fallback
          setTimeout(handleAfterPrint, 8000);
          
        }, 1500);
      }
    } catch (error) {
      console.error('Print error:', error);
      setIsPrinting(false);
      onPrintError?.(currentJob.id, error.toString());
    }
  };

  // Auto scan on mount
  useEffect(() => {
    scanPrinters();
  }, []);

  const getTypeIcon = (type: PrinterDevice['type']) => {
    switch (type) {
      case 'system': return <Monitor className="h-4 w-4 text-blue-600" />;
      case 'usb': return <Usb className="h-4 w-4 text-purple-600" />;
      case 'network': return <Wifi className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusIcon = (status: PrinterDevice['status']) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'busy': return <Zap className="h-4 w-4 text-orange-600" />;
      case 'offline': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Printer Integration
            </h2>
            <p className="text-gray-600 font-medium">Kontrol printer terpadu untuk printing 🖨️</p>
          </div>
        </div>
        
        <Button
          onClick={scanPrinters}
          disabled={isScanning}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Printer'}
        </Button>
      </div>

      {/* Printer List */}
      <Card className="shadow-lg border border-purple-200/50 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Printer Tersedia ({printers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {printers.length === 0 ? (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                Sedang mencari printer... Pastikan printer terhubung dan siap digunakan.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {printers.map((printer) => (
                <Card 
                  key={printer.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    selectedPrinter === printer.id 
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-300 border-2' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPrinter(printer.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(printer.type)}
                        <div>
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            {printer.name}
                            {printer.isDefault && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">Default</Badge>
                            )}
                          </h4>
                          {printer.description && (
                            <p className="text-sm text-gray-600">{printer.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(printer.status)}
                        <Badge className={`
                          ${printer.status === 'available' ? 'bg-green-100 text-green-700' : ''}
                          ${printer.status === 'busy' ? 'bg-orange-100 text-orange-700' : ''}
                          ${printer.status === 'offline' ? 'bg-red-100 text-red-700' : ''}
                          ${printer.status === 'error' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                          {printer.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Job Info */}
      {currentJob && (
        <Card className="shadow-lg border border-teal-200/50 bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-teal-600" />
              Job Print: {currentJob.ownerName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Job ID:</strong> #{currentJob.id}</div>
                <div><strong>Files:</strong> {currentJob.files.length} file(s)</div>
                <div><strong>Status:</strong> {currentJob.status}</div>
                <div><strong>Time:</strong> {currentJob.timestamp.toLocaleTimeString('id-ID')}</div>
              </div>
              {currentJob.notes && (
                <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-sm">
                    <strong className="text-orange-700">📝 Catatan:</strong>
                    <span className="text-gray-700 ml-2">{currentJob.notes}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Files Preview */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">📁 File yang akan di-print:</h4>
              <div className="space-y-2">
                {currentJob.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                      <span className="font-medium text-gray-800">{file.fileName}</span>
                    </div>
                    <div className="text-sm text-gray-500">({file.fileSize})</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Print Progress */}
            {isPrinting && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600 animate-pulse" />
                    🖨️ Sedang mencetak ke {printers.find(p => p.id === selectedPrinter)?.name}...
                  </span>
                  <span className="font-semibold">{Math.round(printProgress)}%</span>
                </div>
                <Progress value={printProgress} className="h-3" />
                <Alert className="bg-blue-50 border-blue-200">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Job sedang dikirim ke printer. Dialog print browser akan muncul... ⚡
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Print Button */}
            <Button
              onClick={handlePrint}
              disabled={!selectedPrinter || isPrinting || printers.length === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg text-lg py-6"
            >
              <Printer className="h-5 w-5 mr-2" />
              {isPrinting ? 'Sedang Mencetak...' : 'Print Sekarang 🚀'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* System Info */}
      <Card className="shadow-lg border border-gray-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-blue-800">🔧 Informasi Sistem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-700">
          <div><strong>• Browser Print:</strong> Menggunakan dialog print browser default</div>
          <div><strong>• Auto Detection:</strong> Mendeteksi printer sistem, USB, dan network</div>
          <div><strong>• Format Print:</strong> HTML dengan styling khusus untuk hasil terbaik</div>
          <div><strong>• Compatibility:</strong> Semua browser modern dan printer standar</div>
        </CardContent>
      </Card>
    </div>
  );
}