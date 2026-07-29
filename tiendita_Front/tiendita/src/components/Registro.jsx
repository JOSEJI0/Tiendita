import React, { useState } from 'react';
import { UserPlus, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle, ArrowLeft, Shield, User, Store } from 'lucide-react';
import { apiService } from '../services/apiService';

const ROLES = [
  { value: 'ROLE_CLIENTE', label: 'Cliente', descripcion: 'Compras y entrega a domicilio.', icon: Store },
  { value: 'ROLE_ADMIN', label: 'Administrador', descripcion: 'Gestiona productos, ventas y usuarios.', icon: Shield },
];

export const Registro = ({ onRegistroSuccess, onGoToLogin }) => {
  const [role, setRole] = useState('ROLE_CLIENTE');
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const esCliente = role === 'ROLE_CLIENTE';

  const validar = () => {
    if (!nombre.trim()) return 'El nombre es obligatorio.';
    if (!username.trim()) return 'El correo es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username.trim())) {
      return 'El correo no tiene un formato válido.';
    }
    if (!password || password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (esCliente) {
      if (!telefono.trim()) return 'El teléfono es obligatorio para clientes.';
      if (!direccion.trim()) return 'La dirección de entrega es obligatoria para clientes.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) {
      setError(msg);
      return;
    }
    setCargando(true);
    setError('');
    setExito('');

    const payload = {
      nombre: nombre.trim(),
      username: username.trim(),
      password,
      role,
      telefono: esCliente ? telefono.trim() : null,
      direccion: esCliente ? direccion.trim() : null,
    };

    try {
      await apiService.registrarUsuario(payload);
      setExito('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => {
        onRegistroSuccess && onRegistroSuccess();
      }, 800);
    } catch (err) {
      setError(err?.message || 'No se pudo crear la cuenta.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto my-12 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="bg-green-700 px-6 py-6 text-center text-white">
        <h2 className="text-2xl font-bold">Crear Cuenta</h2>
        <p className="text-green-100 mt-1 text-sm">Únete a Tiendita hoy mismo</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4" noValidate>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        {exito && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-2 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{exito}</span>
          </div>
        )}

        <div>
          <span className="text-sm font-medium text-gray-700">Tipo de cuenta</span>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const activo = role === r.value;
              return (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={
                    'text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 ' +
                    (activo
                      ? 'border-green-600 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-green-300 bg-white')
                  }
                >
                  <span
                    className={
                      'p-2 rounded-lg ' +
                      (activo ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600')
                    }
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-gray-800">{r.label}</span>
                    <span className="block text-xs text-gray-500">{r.descripcion}</span>
                  </span>
                  <span
                    className={
                      'mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ' +
                      (activo ? 'border-green-600' : 'border-gray-300')
                    }
                  >
                    {activo && <span className="w-2 h-2 rounded-full bg-green-600" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Campo
          label="Nombre"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre completo"
          icon={<User className="w-4 h-4" />}
          autoComplete="name"
          required
        />
        <Campo
          label="Username (Correo)"
          name="username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          icon={<Mail className="w-4 h-4" />}
          autoComplete="username"
          required
        />
        <Campo
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
        />

        {esCliente && (
          <>
            <Campo
              label="Teléfono"
              name="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="55 1234 5678"
              icon={<Phone className="w-4 h-4" />}
              autoComplete="tel"
              required
            />
            <Campo
              label="Dirección de entrega"
              name="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, colonia, ciudad"
              icon={<MapPin className="w-4 h-4" />}
              autoComplete="street-address"
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>

        <button
          type="button"
          onClick={onGoToLogin}
          className="w-full flex items-center justify-center gap-1 text-sm text-green-700 hover:text-green-900 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Ya tengo cuenta, iniciar sesión
        </button>
      </form>
    </div>
  );
};

const Campo = ({ label, name, type = 'text', value, onChange, placeholder, icon, autoComplete, required }) => (
  <label className="block">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="mt-1 relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  </label>
);
