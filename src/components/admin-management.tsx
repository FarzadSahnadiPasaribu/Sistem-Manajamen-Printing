import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Crown, 
  Shield, 
  UserPlus, 
  Trash2, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  Key
} from 'lucide-react';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  registrationDate: Date;
  addedBy: string;
}

interface AdminManagementProps {
  currentSuperAdmin: {
    id: string;
    name: string;
    email: string;
  };
}

export function AdminManagement({ currentSuperAdmin }: AdminManagementProps) {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 'admin-1',
      name: 'Siti Nurhayati',
      email: 'siti@copyxpress.com',
      role: 'admin',
      registrationDate: new Date('2024-09-20'),
      addedBy: 'Super Admin'
    },
    {
      id: 'admin-2',
      name: 'Ahmad Fauzi',
      email: 'ahmad@copyxpress.com',
      role: 'admin',
      registrationDate: new Date('2024-09-22'),
      addedBy: 'Super Admin'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Validation
      if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.password) {
        setAlert({ type: 'error', message: 'Semua field harus diisi!' });
        setIsLoading(false);
        return;
      }

      if (newAdminForm.password !== newAdminForm.confirmPassword) {
        setAlert({ type: 'error', message: 'Konfirmasi password tidak sama!' });
        setIsLoading(false);
        return;
      }

      if (newAdminForm.password.length < 6) {
        setAlert({ type: 'error', message: 'Password minimal 6 karakter!' });
        setIsLoading(false);
        return;
      }

      // Check if email already exists
      const emailExists = admins.some(admin => admin.email === newAdminForm.email);
      
      if (emailExists) {
        setAlert({ type: 'error', message: 'Email sudah terdaftar sebagai admin!' });
        setIsLoading(false);
        return;
      }

      // Add new admin
      const newAdmin: Admin = {
        id: 'admin-' + Date.now(),
        name: newAdminForm.name,
        email: newAdminForm.email,
        role: 'admin',
        registrationDate: new Date(),
        addedBy: currentSuperAdmin.name
      };

      setAdmins(prev => [...prev, newAdmin]);
      setAlert({ type: 'success', message: `Admin ${newAdmin.name} berhasil ditambahkan!` });
      
      // Clear form
      setNewAdminForm({ name: '', email: '', password: '', confirmPassword: '' });
      setShowAddForm(false);

    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem. Coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus admin "${adminName}"?\n\nAdmin akan kehilangan akses ke sistem.`)) {
      return;
    }

    setIsLoading(true);
    setAlert(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      setAdmins(prev => prev.filter(admin => admin.id !== adminId));
      setAlert({ type: 'success', message: `Admin ${adminName} berhasil dihapus dari sistem.` });
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal menghapus admin. Coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-3xl shadow-xl">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Kelola Admin
            </h1>
            <p className="text-gray-600 font-medium">Tambah dan kelola akun admin operator</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Tambah Admin
        </Button>
      </div>

      {/* Alert */}
      {alert && (
        <Alert className={`${alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {alert.type === 'success' ? 
            <CheckCircle className="h-4 w-4 text-green-600" /> : 
            <AlertTriangle className="h-4 w-4 text-red-600" />
          }
          <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Add Admin Form */}
      {showAddForm && (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <UserPlus className="h-5 w-5" />
              Tambah Admin Baru
            </CardTitle>
            <p className="text-emerald-600 text-sm">
              Admin akan mendapatkan akses untuk mengelola operasi print
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin-name">Nama Lengkap</Label>
                  <Input
                    id="admin-name"
                    type="text"
                    placeholder="Nama admin"
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 border-emerald-200 focus:border-emerald-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="admin-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@copyxpress.com"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 border-emerald-200 focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimal 6 karakter"
                      value={newAdminForm.password}
                      onChange={(e) => setNewAdminForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pr-10 border-emerald-200 focus:border-emerald-400"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="admin-confirm-password">Konfirmasi Password</Label>
                  <Input
                    id="admin-confirm-password"
                    type="password"
                    placeholder="Ulangi password"
                    value={newAdminForm.confirmPassword}
                    onChange={(e) => setNewAdminForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mt-1 border-emerald-200 focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAdminForm({ name: '', email: '', password: '', confirmPassword: '' });
                  }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  {isLoading ? 'Menambahkan...' : 'Tambah Admin'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{admins.length}</div>
                <div className="text-sm text-blue-600">Total Admin</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-purple-600">Super Admin</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {admins.filter(admin => 
                    admin.registrationDate.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                  ).length}
                </div>
                <div className="text-sm text-emerald-600">Admin Baru (7 hari)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Daftar Admin Aktif
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Kelola akun admin yang dapat mengoperasikan sistem print
          </p>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Admin</h3>
              <p className="text-gray-500 mb-4">Tambahkan admin untuk mengelola operasi print</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Tambah Admin Pertama
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {admins.map((admin, index) => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-800">{admin.name}</h3>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          👑 Admin #{index + 1}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {admin.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Bergabung: {formatDate(admin.registrationDate)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Ditambahkan oleh: <span className="font-medium">{admin.addedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      ✅ Aktif
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin.id, admin.name)}
                      disabled={isLoading}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Key className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">ℹ️ Informasi Penting</h3>
              <div className="text-sm text-amber-700 space-y-1">
                <p>• Admin dapat mengelola antrian print, menjalankan printer, dan menerima order</p>
                <p>• Admin tidak dapat registrasi sendiri - hanya Super Admin yang bisa menambahkan</p>
                <p>• Setiap admin mendapatkan akses penuh ke dashboard operasional</p>
                <p>• Hapus admin dengan hati-hati - mereka akan kehilangan akses sistem</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}