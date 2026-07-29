import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { ShoppingBag, ListOrdered, AlertTriangle, RefreshCw, CheckCircle2, Clock, XCircle, Home, Search, User, Edit2, Key, Save, X, Mail } from 'lucide-react';

const ESTADO_STYLES = {
    PAGADO: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2, label: 'Pagado' },
    PENDIENTE: { color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock, label: 'Pendiente' },
    CANCELADO: { color: 'text-red-700', bg: 'bg-red-100', icon: XCircle, label: 'Cancelado' },
};

const formatPrecio = (precio) =>
    '$' + Number(precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) + ' MXN';

const formatFecha = (fecha) => {
    if (!fecha) return '—';
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const ClienteDashboard = ({ user, setVistaActual, openCart }) => {
    const [compras, setCompras] = useState([]);
    const [carga, setCarga] = useState(true);
    const [error, setError] = useState('');

    const [editandoPerfil, setEditandoPerfil] = useState(false);
    const [formPerfil, setFormPerfil] = useState({ nombre: user?.nombre || '', direccion: '', telefono: '' });
    const [formPass, setFormPass] = useState(null);
    const [guardandoPerfil, setGuardandoPerfil] = useState(false);

    const cargar = async () => {
        setCarga(true);
        setError('');
        try {
            const lista = await apiService.getMisCompras();
            const arr = Array.isArray(lista) ? lista : [];
            arr.sort((a, b) => new Date(b?.fecha || 0) - new Date(a?.fecha || 0));
            setCompras(arr);
        } catch (err) {
            setError(err?.message || 'No se pudieron cargar tus compras.');
        } finally {
            setCarga(false);
        }
    };

    useEffect(() => {
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.username]);

    const abrirEditarPerfil = () => {
        setFormPerfil({
            nombre: user?.nombre || '',
            direccion: user?.direccion || '',
            telefono: user?.telefono || '',
        });
        setEditandoPerfil(true);
    };

    const guardarPerfil = async (e) => {
        e.preventDefault();
        setGuardandoPerfil(true);
        try {
            await apiService.updateUsuario(user.id, {
                nombre: formPerfil.nombre.trim(),
                direccion: formPerfil.direccion.trim(),
                telefono: formPerfil.telefono.trim(),
            });
            localStorage.setItem('nombre', formPerfil.nombre.trim());
            if (user?.direccion !== undefined) localStorage.setItem('direccion', formPerfil.direccion.trim());
            if (user?.telefono !== undefined) localStorage.setItem('telefono', formPerfil.telefono.trim());
            user.nombre = formPerfil.nombre.trim();
            setEditandoPerfil(false);
            alert('Perfil actualizado correctamente.');
        } catch (err) {
            alert(err?.message || 'No se pudo actualizar el perfil.');
        } finally {
            setGuardandoPerfil(false);
        }
    };

    const abrirCambiarPass = () => setFormPass({ passwordActual: '', nuevoPassword: '' });
    const cerrarCambiarPass = () => setFormPass(null);

    const guardarCambiarPass = async (e) => {
        e.preventDefault();
        try {
            await apiService.changePassword(user.id, {
                passwordActual: formPass.passwordActual,
                nuevoPassword: formPass.nuevoPassword,
            });
            alert('Contraseña actualizada correctamente.');
            cerrarCambiarPass();
        } catch (err) {
            alert(err?.message || 'No se pudo cambiar la contraseña.');
        }
    };

    const tarjetas = [
        {
            titulo: 'Explorar Catálogo',
            desc: 'Descubre nuevos productos disponibles.',
            icon: ShoppingBag,
            color: 'bg-green-600',
            accion: () => setVistaActual('catalogo'),
        },
        {
            titulo: 'Mi Carrito',
            desc: 'Revisa los productos que añadiste.',
            icon: ShoppingBag,
            color: 'bg-amber-600',
            accion: () => openCart && openCart(),
        },
        {
            titulo: 'Mis Compras',
            desc: 'Consulta el historial de tus pedidos.',
            icon: ListOrdered,
            color: 'bg-emerald-700',
            accion: () => setVistaActual('cliente-dashboard'),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-green-700 rounded-2xl p-8 mb-8 text-white shadow-sm relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Home className="w-7 h-7 text-green-200" />
                        <span className="text-green-200 text-xs font-bold uppercase tracking-widest">Panel de cliente</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        ¡Hola, {user?.nombre || user?.username || 'cliente'}!
                    </h1>
                    <p className="mt-2 text-green-100 text-sm sm:text-base">
                        Bienvenido a tu panel. Aquí puedes revisar tus compras recientes y volver al catálogo cuando quieras.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        <h2 className="font-bold text-gray-800">Mi Perfil</h2>
                    </div>
                    {!editandoPerfil && (
                        <button onClick={abrirEditarPerfil}
                            className="flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-800 transition-colors cursor-pointer">
                            <Edit2 className="w-4 h-4" />
                            Editar perfil
                        </button>
                    )}
                </div>
                <div className="p-6">
                    {editandoPerfil ? (
                        <form onSubmit={guardarPerfil} className="space-y-4 max-w-lg">
                            <label className="block">
                                <span className="text-xs font-bold text-gray-700 mb-1 block">Nombre</span>
                                <input type="text" value={formPerfil.nombre}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, nombre: e.target.value })}
                                    required
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-bold text-gray-700 mb-1 block">Dirección</span>
                                <input type="text" value={formPerfil.direccion}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, direccion: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-bold text-gray-700 mb-1 block">Teléfono</span>
                                <input type="text" value={formPerfil.telefono}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, telefono: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </label>
                            <div className="flex items-center gap-2 pt-2">
                                <button type="submit" disabled={guardandoPerfil}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50">
                                    <Save className="w-4 h-4" />
                                    {guardandoPerfil ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                                <button type="button" onClick={() => setEditandoPerfil(false)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors cursor-pointer">
                                    <X className="w-4 h-4" />
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 font-medium">Nombre</div>
                                    <div className="font-bold text-gray-800">{user?.nombre || '—'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 font-medium">Email</div>
                                    <div className="font-bold text-gray-800">{user?.username || '—'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 font-medium">Contraseña</div>
                                    <button onClick={abrirCambiarPass}
                                        className="font-bold text-green-700 hover:text-green-800 text-sm cursor-pointer">
                                        Cambiar contraseña
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {tarjetas.map((t, idx) => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={idx}
                            onClick={t.accion}
                            className={`text-left ${t.color} text-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Acción</span>
                            </div>
                            <h3 className="font-bold text-base">{t.titulo}</h3>
                            <p className="text-xs opacity-90 mt-1">{t.desc}</p>
                        </button>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2">
                        <ListOrdered className="w-5 h-5 text-green-600" />
                        <h2 className="font-bold text-gray-800">Mis Compras</h2>
                        <span className="text-xs text-gray-500 font-medium bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                            {compras.length} {compras.length === 1 ? 'orden' : 'órdenes'}
                        </span>
                    </div>
                    <button
                        onClick={cargar}
                        disabled={carga}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors cursor-pointer disabled:opacity-50"
                        title="Recargar"
                    >
                        <RefreshCw className={`w-4 h-4 ${carga ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {error && (
                    <div className="bg-amber-50 text-amber-800 p-4 mx-6 mt-4 rounded-xl flex items-start gap-2.5 border border-amber-200 text-sm">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {carga ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                        <p className="text-gray-500 mt-3 text-sm">Cargando compras...</p>
                    </div>
                ) : compras.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-800">Aún no tienes compras</h3>
                        <p className="text-gray-500 text-sm mt-1">Cuando realices una compra aparecerá en este listado.</p>
                        <button
                            onClick={() => setVistaActual('catalogo')}
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                        >
                            Ir al Catálogo
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {compras.map((v) => {
                            const estado = ESTADO_STYLES[v?.estadoPago] || ESTADO_STYLES.PENDIENTE;
                            const EstadoIcon = estado.icon;
                            return (
                                <div key={v.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-gray-800 text-sm">Orden #{v.id}</span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${estado.bg} ${estado.color}`}>
                                                    <EstadoIcon className="w-3 h-3" />
                                                    {estado.label}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatFecha(v.fecha)} · {v?.detalles?.length || 0} {(v?.detalles?.length || 0) === 1 ? 'artículo' : 'artículos'}
                                            </div>
                                        </div>
                                        <div className="font-extrabold text-green-800 text-base">
                                            {formatPrecio(v.total)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {formPass && (
                <div className="fixed inset-0 z-50 bg-green-950/45 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Key className="w-5 h-5 text-green-600" />
                                Cambiar contraseña
                            </h3>
                            <button onClick={cerrarCambiarPass} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={guardarCambiarPass} className="p-6 space-y-4">
                            <label className="block">
                                <span className="text-xs font-bold text-gray-700 mb-1 block">Contraseña actual</span>
                                <input type="password" value={formPass.passwordActual}
                                    onChange={(e) => setFormPass({ ...formPass, passwordActual: e.target.value })}
                                    required
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                    placeholder="••••••••" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-bold text-gray-700 mb-1 block">Nueva contraseña</span>
                                <input type="password" value={formPass.nuevoPassword}
                                    onChange={(e) => setFormPass({ ...formPass, nuevoPassword: e.target.value })}
                                    required minLength={6}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                    placeholder="Mínimo 6 caracteres" />
                            </label>
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                <button type="button" onClick={cerrarCambiarPass}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors cursor-pointer">
                                    Cancelar
                                </button>
                                <button type="submit"
                                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer">
                                    <Key className="w-4 h-4" />
                                    Cambiar contraseña
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
