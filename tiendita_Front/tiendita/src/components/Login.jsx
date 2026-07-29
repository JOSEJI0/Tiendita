import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Login = ({ onLoginSuccess, onGoToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validar = () => {
    if (!username.trim()) return 'Ingresa tu correo o username.';
    if (!password) return 'Ingresa tu contraseña.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const msg = validar();
    if (msg) {
      setError(msg);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await apiService.login({
        username: username.trim(),
        password: password,
      });

      if (data && data.token) {
        apiService.setSession(data);
      }

      onLoginSuccess({
        username: data?.username || username.trim(),
        nombre: data?.nombre || username.trim(),
        rol: data?.rol || data?.role || 'ROLE_CLIENTE',
      });
      
    } catch (err) {
      setError(err?.message || 'Credenciales inválidas. Verifica tu correo o contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto my-12 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="bg-green-700 px-6 py-6 text-center text-white">
        <h2 className="text-2xl font-bold">¡Bienvenido de nuevo!</h2>
        <p className="text-green-100 mt-1 text-sm">Inicia sesión en tu cuenta de Tiendita</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Correo Electrónico o Username
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              required
              autoComplete="username"
              className="pl-11 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900"
              placeholder="nombre@correo.com o tu_usuario"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              autoComplete="current-password"
              className="pl-11 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'Iniciando Sesión...' : 'Entrar'}
        </button>

        <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-green-600 font-bold hover:underline"
          >
            Regístrate ahora
          </button>
        </div>
      </form>
    </div>
  );
};
