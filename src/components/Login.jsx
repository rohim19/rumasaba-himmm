import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoSaba from '../assets/logo.png';
import heroImage from '../assets/hero.png'; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true); 

    setTimeout(() => {
      setLoading(false); 
      if (username === 'envy' && password === '123qwer') {
        localStorage.setItem('userRumaSaba', username);
        navigate('/');
      } else {
        alert('Username atau Password salah bro !!!');
      }
    }, 1000); 
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      
      {/* BAGIAN KIRI */}
      <div className="hidden md:flex md:w-[60%] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img 
            src={heroImage} 
            alt="Login Hero" 
            className="w-full h-full object-cover object-[center_70%] absolute inset-0"
        />
        <div className="relative z-20 p-12 text-white text-left w-full h-full flex flex-col justify-end pb-20">
            <h2 className="text-5xl font-bold drop-shadow-lg mb-4">Ruma Saba <br/> </h2>
            <p className="text-xl drop-shadow-md text-gray-100 max-w-lg leading-relaxed">
              Bukan sekedar tempat untuk menghilangkan haus dan lapar kalian, tapi tempat terbaik untuk mengistirahatkan beban dan perasaan kalian.
            </p>
        </div>
      </div>

      {/* BAGIAN KANAN */}
      <div className="w-full md:w-[40%] flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
          
          <div className="text-center mb-8">
            <img 
              src={logoSaba} 
              alt="Ruma Saba" 
              className="w-64 h-auto mx-auto -mb-20 object-contain relative z-10" 
            />
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight pt-10">Masuk ke Dashboard</h2>
            <p className="text-sm text-gray-500 mt-2">Silakan masukkan akun admin Anda</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
              <input 
                type="text" // Koreksi: type 'username' itu gak ada di HTML, pakainya 'text'
                placeholder="Username"
                value={username} // Sambungkan ke state
                onChange={(e) => setUsername(e.target.value)} // Tangkap ketikan
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-gray-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="********"
                  value={password} // Sambungkan ke state
                  onChange={(e) => setPassword(e.target.value)} // Tangkap ketikan
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-gray-800 pr-10"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Lupa kata sandi?</a>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Masuk"}
            </button>

          </form>

          <div className="pt-8 mt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">© 2026 Ruma Saba. All rights reserved.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;