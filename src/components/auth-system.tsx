import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Shield, 
  User, 
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Printer
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user';
  registrationDate: Date;
}

interface AuthSystemProps {
  onAuthSuccess: (user: User) => void;
}

export function AuthSystem({ onAuthSuccess }: AuthSystemProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Login form state - hanya untuk super admin dan user
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: 'user' as 'super-admin' | 'user'
  });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Default Super Admin - hanya ada satu, dibuat saat instalasi sistem
  const superAdmin = {
    email: 'superadmin@copyxpress.com', 
    password: 'superadmin123', 
    name: 'Super Administrator CopyXpress'
  };

  // Mock registered admins - ditambahkan oleh Super Admin
  const [registeredAdmins, setRegisteredAdmins] = useState<Array<{
    id: string;
    name: string;
    email: string;
    password: string;
    registrationDate: Date;
  }>>([]);

  const [registeredUsers, setRegisteredUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    password: string;
    registrationDate: Date;
  }>>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (loginForm.role === 'super-admin') {
        // Check Super Admin credentials
        if (loginForm.email === superAdmin.email && loginForm.password === superAdmin.password) {
          setAlert({ type: 'success', message: 'Login Super Admin berhasil! Selamat datang, Pemilik.' });
          setTimeout(() => {
            onAuthSuccess({
              id: 'superadmin-' + Date.now(),
              name: superAdmin.name,
              email: superAdmin.email,
              role: 'super-admin',
              registrationDate: new Date()
            });
          }, 1000);
        } else {
          setAlert({ type: 'error', message: 'Email atau password Super Admin salah!' });
        }
      } else {
        // Check user credentials
        const user = registeredUsers.find(
          u => u.email === loginForm.email && u.password === loginForm.password
        );
        
        // Check admin credentials (admins ditambahkan oleh Super Admin)
        const admin = registeredAdmins.find(
          a => a.email === loginForm.email && a.password === loginForm.password
        );
        
        if (user) {
          setAlert({ type: 'success', message: 'Login User berhasil! Selamat datang kembali.' });
          setTimeout(() => {
            onAuthSuccess({
              id: user.id,
              name: user.name,
              email: user.email,
              role: 'user',
              registrationDate: user.registrationDate
            });
          }, 1000);
        } else if (admin) {
          setAlert({ type: 'success', message: 'Login Admin berhasil! Siap mengelola operasi print.' });
          setTimeout(() => {
            onAuthSuccess({
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: 'admin',
              registrationDate: admin.registrationDate
            });
          }, 1000);
        } else {
          setAlert({ type: 'error', message: 'Email atau password salah! User harus registrasi dulu, Admin ditambahkan oleh Super Admin.' });
        }
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem. Coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Validation
      if (!registerForm.name || !registerForm.email || !registerForm.password) {
        setAlert({ type: 'error', message: 'Semua field harus diisi!' });
        setIsLoading(false);
        return;
      }

      if (registerForm.password !== registerForm.confirmPassword) {
        setAlert({ type: 'error', message: 'Konfirmasi password tidak sama!' });
        setIsLoading(false);
        return;
      }

      if (registerForm.password.length < 6) {
        setAlert({ type: 'error', message: 'Password minimal 6 karakter!' });
        setIsLoading(false);
        return;
      }

      // Check if email already exists
      const emailExists = registeredUsers.some(u => u.email === registerForm.email) ||
                         registeredAdmins.some(a => a.email === registerForm.email) ||
                         registerForm.email === superAdmin.email;
      
      if (emailExists) {
        setAlert({ type: 'error', message: 'Email sudah terdaftar! Gunakan email lain atau login.' });
        setIsLoading(false);
        return;
      }

      // Register new user
      const newUser = {
        id: 'user-' + Date.now(),
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        registrationDate: new Date()
      };

      setRegisteredUsers(prev => [...prev, newUser]);
      setAlert({ type: 'success', message: 'Registrasi berhasil! Silakan login dengan akun baru Anda.' });
      
      // Clear form and switch to login
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        setActiveTab('login');
        setLoginForm(prev => ({ ...prev, email: newUser.email, role: 'user' }));
      }, 2000);

    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem. Coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/50 to-cyan-50 p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-3 h-3 bg-teal-400/60 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-cyan-400/50 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-orange-400/40 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-teal-300/60 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4 rounded-3xl shadow-xl">
              <Printer className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            CopyXpress
          </h1>
          <p className="text-gray-600 font-medium">Layanan Print Online Premium ⚡</p>
          <p className="text-gray-500 text-sm mt-2">Masuk atau daftar untuk melanjutkan</p>
        </div>

        {/* Alert */}
        {alert && (
          <Alert className={`mb-6 ${alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {alert.type === 'success' ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertTriangle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Auth Tabs */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/80">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Registrasi
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-teal-600" />
                  Masuk ke Akun
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Masukkan kredensial untuk mengakses CopyXpress
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Role Selection */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button
                      type="button"
                      variant={loginForm.role === 'user' ? 'default' : 'outline'}
                      onClick={() => setLoginForm(prev => ({ ...prev, role: 'user' }))}
                      className={`flex items-center gap-2 ${loginForm.role === 'user' ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                    >
                      <User className="h-4 w-4" />
                      User / Admin
                    </Button>
                    <Button
                      type="button"
                      variant={loginForm.role === 'super-admin' ? 'default' : 'outline'}
                      onClick={() => setLoginForm(prev => ({ ...prev, role: 'super-admin' }))}
                      className={`flex items-center gap-2 ${loginForm.role === 'super-admin' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    >
                      <Shield className="h-4 w-4" />
                      Super Admin
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={loginForm.role === 'super-admin' ? 'superadmin@copyxpress.com' : 'email@example.com'}
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={loginForm.role === 'super-admin' ? 'superadmin123' : 'Password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pr-10"
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

                  {/* Demo credentials */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium mb-2">🔧 Demo Credentials:</p>
                    <div className="text-xs text-blue-600 space-y-1">
                      <div><strong>Super Admin:</strong> superadmin@copyxpress.com / superadmin123</div>
                      <div><strong>User:</strong> Daftar dulu atau gunakan akun yang sudah dibuat</div>
                      <div><strong>Admin:</strong> Ditambahkan oleh Super Admin, tidak bisa registrasi</div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full ${
                      loginForm.role === 'super-admin' 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700' 
                        : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                    } text-white`}
                  >
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-teal-600" />
                  Daftar Akun Baru
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Buat akun untuk mulai menggunakan layanan print
                </p>
                <Badge className="bg-orange-100 text-orange-700 w-fit">
                  📝 Khusus untuk User - Admin ditambahkan oleh Super Admin
                </Badge>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="reg-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="email@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="reg-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Ulangi password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700">
                      ✅ Akun user akan otomatis dibuat dan bisa langsung digunakan untuk submit job print
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                  >
                    {isLoading ? 'Membuat Akun...' : 'Daftar Sekarang'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © 2024 CopyXpress. Layanan print online terpercaya ✨
          </p>
        </div>
      </div>
    </div>
  );
}