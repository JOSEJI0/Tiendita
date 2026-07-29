import React from 'react';
import { apiService } from '../services/apiService';
import { ShoppingCart, LogOut, User, ListOrdered, ShoppingBag } from 'lucide-react';

export const Navbar = ({ vistaActual, setVistaActual, user, onLogout, cartCount, openCart }) => {
    const handleLogout = () => {
        apiService.logout();
        onLogout();
        setVistaActual('catalogo');
    };

    const isClient = user && user.rol === 'ROLE_CLIENTE';
    const isAdmin = user && user.rol === 'ROLE_ADMIN';

    return (
        <nav className="sticky top-0 z-50 bg-green-800 text-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setVistaActual('catalogo')}
                    >
                        <ShoppingBag className="h-8 w-8 text-green-300" />
                        <span className="font-extrabold text-xl tracking-tight text-white">
                            Tiendita
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setVistaActual('catalogo')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-green-700 ${vistaActual === 'catalogo' ? 'bg-green-700 font-bold border-b-2 border-green-400' : ''}`}
                        >
                            Catalogo
                        </button>

                        {isClient && (
                            <button
                                onClick={() => setVistaActual('cliente-dashboard')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-green-700 ${vistaActual === 'cliente-dashboard' ? 'bg-green-700 font-bold border-b-2 border-green-400' : ''}`}
                            >
                                <ListOrdered className="w-4 h-4" />
                                Mis Compras
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                onClick={() => setVistaActual('admin-dashboard')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-green-700 ${vistaActual === 'admin-dashboard' ? 'bg-green-700 font-bold border-b-2 border-green-400' : ''}`}
                            >
                                <ListOrdered className="w-4 h-4" />
                                Admin Panel
                            </button>
                        )}

                        {user ? (
                            <>
                                <div className="flex items-center text-sm font-medium bg-green-700 px-3 py-1.5 rounded-full border border-green-500 gap-1.5 max-w-[150px] truncate">
                                    <User className="w-4 h-4 text-green-200 flex-shrink-0" />
                                    <span className="truncate">{user.nombre}</span>
                                </div>

                                {isClient && (
                                    <button
                                        onClick={openCart}
                                        className="relative p-2 rounded-full hover:bg-green-700 transition-colors cursor-pointer group"
                                    >
                                        <ShoppingCart className="w-6 h-6 text-white group-hover:text-green-200" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold border border-green-800">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full hover:bg-red-900 hover:text-red-200 transition-colors cursor-pointer"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setVistaActual('login')}
                                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-green-700"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={() => setVistaActual('registro')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                                >
                                    Registrarse
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
