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
  Eye
} from 'lucide-react';
import { PrintJob } from '../App';

interface RealPrinter {
  id: string;
  name: string;
  type: 'system' | 'usb' | 'network';
  status: 'available' | 'busy' | 'offline' | 'error';
  isDefault?: boolean;
  description?: string;
}

interface RealPrinterControlProps {
  currentJob?: PrintJob;
  onPrintComplete?: (jobId: string) => void;
  onPrintError?: (jobId: string, error: string) => void;
}

export function RealPrinterControl({ currentJob, onPrintComplete, onPrintError }: RealPrinterControlProps) {
  const [realPrinters, setRealPrinters] = useState<RealPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [systemPrintersList, setSystemPrintersList] = useState<any[]>([]);

  // Deteksi printer sistem menggunakan Browser Print API
  const detectSystemPrinters = async () => {
    try {
      // Try to access system printers through print dialog
      const printers: RealPrinter[] = [];
      
      // Add default system printer
      printers.push({
        id: 'system-default',
        name: 'Default System Printer',
        type: 'system',
        status: 'available',
        isDefault: true,
        description: 'Printer default sistem'
      });

      // Check if we can get printer info from navigator
      if ('printing' in navigator) {
        console.log('Printing API detected');
      }

      return printers;
    } catch (error) {
      console.log('System printer detection failed:', error);
      return [];
    }
  };

  // Deteksi USB printer menggunakan WebUSB
  const detectUSBPrinters = async () => {
    try {
      if ('usb' in navigator) {
        console.log('WebUSB supported - scanning for USB printers...');
        
        // Request USB devices (user needs to grant permission)
        const devices = await (navigator as any).usb.getDevices();
        console.log('USB devices found:', devices);
        
        const usbPrinters: RealPrinter[] = [];
        
        devices.forEach((device: any, index: number) => {
          // Check if device might be a printer (common vendor IDs)
          const printerVendorIds = [0x04b8, 0x03f0, 0x04a9, 0x067b]; // Epson, HP, Canon, Prolific
          
          if (printerVendorIds.includes(device.vendorId) || 
              device.productName?.toLowerCase().includes('printer')) {
            usbPrinters.push({
              id: `usb-${device.vendorId}-${device.productId}`,
              name: device.productName || `USB Printer ${index + 1}`,
              type: 'usb',
              status: 'available',
              description: `Vendor ID: ${device.vendorId}, Product ID: ${device.productId}`
            });
          }
        });
        
        return usbPrinters;
      }
    } catch (error) {
      console.log('USB printer detection failed:', error);
    }
    return [];
  };

  // Scan untuk network printer (simulasi discovery)
  const detectNetworkPrinters = async () => {
    try {
      // Simulasi network printer discovery
      // In real implementation, this would scan local network for IPP/Socket printers
      const networkPrinters: RealPrinter[] = [];
      
      // Common network printer IPs to check
      const commonIPs = ['192.168.1.100', '192.168.1.101', '192.168.0.100'];
      
      for (const ip of commonIPs) {
        try {
          // Simulasi ping/connection test
          console.log(`Checking network printer at ${ip}...`);
          
          // In real implementation, you would:
          // - Send IPP discovery request
          // - Check for open port 9100 (Raw printing)
          // - Check for port 631 (IPP)
          
          // Simulate found network printer
          if (Math.random() > 0.7) { // 30% chance to "find" a printer
            networkPrinters.push({
              id: `network-${ip}`,
              name: `Network Printer (${ip})`,
              type: 'network',
              status: 'available',
              description: `IPP printer at ${ip}:631`
            });
          }
        } catch (error) {
          console.log(`No printer found at ${ip}`);
        }
      }
      
      return networkPrinters;
    } catch (error) {
      console.log('Network printer detection failed:', error);
      return [];
    }
  };

  // Request USB device permission
  const requestUSBPermission = async () => {
    try {
      if ('usb' in navigator) {
        const device = await (navigator as any).usb.requestDevice({
          filters: [
            { classCode: 7 }, // Printer class
            { vendorId: 0x04b8 }, // Epson
            { vendorId: 0x03f0 }, // HP
            { vendorId: 0x04a9 }, // Canon
          ]
        });
        console.log('USB device granted:', device);
        
        // Re-scan after permission granted
        scanAllPrinters();
      }
    } catch (error) {
      console.log('USB permission denied or error:', error);
    }
  };

  // Scan semua jenis printer
  const scanAllPrinters = async () => {
    setIsScanning(true);
    
    try {
      const [systemPrinters, usbPrinters, networkPrinters] = await Promise.all([
        detectSystemPrinters(),
        detectUSBPrinters(),
        detectNetworkPrinters()
      ]);
      
      const allPrinters = [...systemPrinters, ...usbPrinters, ...networkPrinters];
      setRealPrinters(allPrinters);
      
      // Auto-select default printer
      const defaultPrinter = allPrinters.find(p => p.isDefault) || allPrinters[0];
      if (defaultPrinter) {
        setSelectedPrinter(defaultPrinter.id);
      }
      
    } catch (error) {
      console.error('Printer scanning error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Print menggunakan browser print dialog
  const printWithBrowser = async () => {
    if (!currentJob) return;
    
    setIsPrinting(true);
    setPrintProgress(0);
    
    try {
      // Create print content
      const printContent = `
        <html>
          <head>
            <title>CopyXpress - Print Job</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .no-print { display: none; }
                .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                .job-info { margin-bottom: 20px; }
                .job-info h2 { color: #333; margin-bottom: 10px; }
                .job-details { background: #f5f5f5; padding: 15px; border-radius: 8px; }
                .files-list { margin-top: 20px; }
                .file-item { padding: 10px; border: 1px solid #ddd; margin: 5px 0; border-radius: 4px; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>🖨️ CopyXpress - Print Job</h1>
              <p>Layanan Print Online Premium</p>
            </div>
            
            <div class="job-info">
              <h2>📋 Job Details</h2>
              <div class="job-details">
                <p><strong>Job ID:</strong> #${currentJob.id}</p>
                <p><strong>Pemilik:</strong> ${currentJob.ownerName}</p>
                <p><strong>Tanggal:</strong> ${currentJob.timestamp.toLocaleDateString('id-ID')}</p>
                <p><strong>Waktu:</strong> ${currentJob.timestamp.toLocaleTimeString('id-ID')}</p>
                <p><strong>Status:</strong> ${currentJob.status}</p>
                ${currentJob.notes ? `<p><strong>Catatan:</strong> ${currentJob.notes}</p>` : ''}
              </div>
            </div>
            
            <div class="files-list">
              <h3>📁 File yang akan di-print:</h3>
              ${currentJob.files.map((file, index) => `
                <div class="file-item">
                  <strong>${index + 1}. ${file.fileName}</strong>
                  <br><small>📦 Ukuran: ${file.fileSize}</small>
                </div>
              `).join('')}
            </div>
            
            <div class="footer">
              <p>Dicetak melalui CopyXpress • ${new Date().toLocaleString('id-ID')}</p>
              <p>Terima kasih telah menggunakan layanan kami! ✨</p>
            </div>
          </body>
        </html>
      `;

      // Open print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setPrintProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 20;
          });
        }, 200);
        
        // Focus and print
        printWindow.focus();
        
        // Wait a bit then trigger print
        setTimeout(() => {
          printWindow.print();
          
          // Handle print completion
          printWindow.onafterprint = () => {
            setPrintProgress(100);
            setIsPrinting(false);
            onPrintComplete?.(currentJob.id);
            printWindow.close();
          };
          
          // Fallback for print completion
          setTimeout(() => {
            if (isPrinting) {
              setPrintProgress(100);
              setIsPrinting(false);
              onPrintComplete?.(currentJob.id);
              printWindow.close();
            }
          }, 5000);
          
        }, 1000);
      }
    } catch (error) {
      console.error('Print error:', error);
      setIsPrinting(false);
      onPrintError?.(currentJob.id, error.toString());
    }
  };

  // Auto scan on component mount
  useEffect(() => {
    scanAllPrinters();
  }, []);

  const getTypeIcon = (type: RealPrinter['type']) => {
    switch (type) {
      case 'system': return <Monitor className="h-4 w-4 text-blue-600" />;
      case 'usb': return <Usb className="h-4 w-4 text-purple-600" />;
      case 'network': return <Wifi className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusIcon = (status: RealPrinter['status']) => {
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
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Printer Control
            </h2>
            <p className="text-gray-600 font-medium">Kontrol printer yang terhubung secara langsung 🖨️</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={requestUSBPermission}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Usb className="h-4 w-4 mr-2" />
            Izinkan USB
          </Button>
          <Button
            onClick={scanAllPrinters}
            disabled={isScanning}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Printer'}
          </Button>
        </div>
      </div>

      {/* Printer Status */}
      <Card className="shadow-lg border border-indigo-200/50 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-600" />
            Printer Terdeteksi ({realPrinters.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {realPrinters.length === 0 ? (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                Tidak ada printer terdeteksi. Pastikan printer terhubung dan klik "Scan Printer".
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {realPrinters.map((printer) => (
                <Card 
                  key={printer.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    selectedPrinter === printer.id 
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-300 border-2' 
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

      {/* Print Current Job */}
      {currentJob && (
        <Card className="shadow-lg border border-teal-200/50 bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-teal-600" />
              Print Job: {currentJob.ownerName}
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
                <div className="mt-2 text-sm">
                  <strong>Notes:</strong> {currentJob.notes}
                </div>
              )}
            </div>

            {isPrinting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>🖨️ Sedang mencetak...</span>
                  <span>{Math.round(printProgress)}%</span>
                </div>
                <Progress value={printProgress} className="h-3" />
              </div>
            )}

            <Button
              onClick={printWithBrowser}
              disabled={!selectedPrinter || isPrinting || realPrinters.length === 0}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-md"
            >
              <Printer className="h-4 w-4 mr-2" />
              {isPrinting ? 'Mencetak...' : 'Print Sekarang'}
            </Button>

            {isPrinting && (
              <Alert className="bg-blue-50 border-blue-200">
                <Zap className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Job sedang dikirim ke printer. Dialog print akan muncul... ⚡
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technical Info */}
      <Card className="shadow-lg border border-gray-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-blue-800">🔧 Informasi Teknis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-700">
          <div><strong>• System Printer:</strong> Menggunakan dialog print browser default</div>
          <div><strong>• USB Detection:</strong> WebUSB API untuk deteksi printer USB langsung</div>
          <div><strong>• Network Scan:</strong> Simulasi discovery printer jaringan (IPP/Socket)</div>
          <div><strong>• Real Testing:</strong> Gunakan printer fisik yang terhubung untuk testing</div>
        </CardContent>
      </Card>
    </div>
  );
}