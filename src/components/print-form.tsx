import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, FileText, User, MessageSquare, X, Plus } from 'lucide-react';
import { PrintJob, PrintFile } from '../App';

interface PrintFormProps {
  onAddJob: (jobData: Omit<PrintJob, 'id' | 'timestamp' | 'status'>) => void;
  userRole?: 'super-admin' | 'admin' | 'user';
}

export function PrintForm({ onAddJob, userRole = 'user' }: PrintFormProps) {
  const [formData, setFormData] = useState({
    ownerName: '',
    notes: ''
  });
  const [files, setFiles] = useState<PrintFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newFiles: PrintFile[] = selectedFiles.map(file => ({
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
    // Reset file input
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ownerName || files.length === 0) {
      alert('Mohon isi nama pemilik dan pilih minimal satu file yang akan di-print');
      return;
    }

    onAddJob({
      ownerName: formData.ownerName,
      files: files,
      notes: formData.notes
    });

    // Reset form
    setFormData({
      ownerName: '',
      notes: ''
    });
    setFiles([]);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-3 mb-3">
          <div className={`p-3 rounded-2xl shadow-lg ${
            userRole === 'super-admin' 
              ? 'bg-gradient-to-br from-purple-500 to-indigo-600' :
            userRole === 'admin' 
              ? 'bg-gradient-to-br from-red-500 to-pink-600' 
              : 'bg-gradient-to-br from-teal-500 to-cyan-600'
          }`}>
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className={`text-2xl font-bold bg-clip-text text-transparent ${
            userRole === 'super-admin'
              ? 'bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600' :
            userRole === 'admin'
              ? 'bg-gradient-to-r from-gray-800 via-red-600 to-pink-600'
              : 'bg-gradient-to-r from-gray-800 via-teal-600 to-cyan-600'
          }`}>
            {userRole === 'super-admin' ? 'Super Admin: Tambah Job Print' :
             userRole === 'admin' ? 'Admin: Tambah Job Print' : 'Tambah Job Print'}
          </span>
        </h2>
        <p className="text-gray-600 ml-16 font-medium">
          {userRole === 'super-admin' 
            ? 'Super Admin dapat menambahkan job dan mengelola admin 👑' :
           userRole === 'admin' 
            ? 'Admin dapat menambahkan job untuk semua user 🔧' 
            : 'Isi form di bawah untuk menambahkan file ke antrian print 🚀'
          }
        </p>
      </div>
      
      <Card className="shadow-xl border border-gray-200/50 bg-white/90 backdrop-blur-lg hover:bg-white/95 transition-all duration-300">
        <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Owner Name */}
          <div className="space-y-3">
            <Label htmlFor="owner-name" className="flex items-center gap-2 text-gray-700 font-semibold">
              <User className="h-4 w-4 text-teal-600" />
              Nama Pemilik File
            </Label>
            <Input
              id="owner-name"
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              placeholder="Masukkan nama lengkap"
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 bg-white text-gray-800 placeholder:text-gray-400 hover:border-gray-400 transition-all duration-300"
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="file-upload" className="flex items-center gap-2 text-gray-700 font-semibold">
              <Upload className="h-4 w-4 text-teal-600" />
              File yang akan di-print
              <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-md">
                {files.length} file dipilih
              </Badge>
            </Label>
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.pptx,.xlsx"
                multiple
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 bg-white text-gray-800 hover:border-gray-400 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-teal-500 file:to-cyan-600 file:text-white hover:file:from-teal-600 hover:file:to-cyan-700 file:shadow-md file:transition-all file:duration-300"
              />
            </div>
            
            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 transition-all duration-300">
                    <div className="flex items-center gap-2 flex-1">
                      <FileText className="h-4 w-4 text-teal-600" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-800 truncate block">{file.fileName}</span>
                        <span className="text-gray-500 text-xs">({file.fileSize})</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="flex items-center gap-2 text-gray-700 font-semibold">
              <MessageSquare className="h-4 w-4 text-teal-600" />
              Catatan Khusus (Opsional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Contoh: Print 2 rangkap, kertas A4, warna, jilid spiral, dll."
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 bg-white text-gray-800 placeholder:text-gray-400 min-h-[100px] resize-none hover:border-gray-400 transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 font-semibold text-lg py-6 rounded-xl"
            disabled={files.length === 0}
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah ke Antrian Print ✨🚀
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}