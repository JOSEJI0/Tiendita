import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Search, ShoppingCart, Info, AlertTriangle } from 'lucide-react';

export const Catalogo = ({ setVistaActual, usuario, AddToCart }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carga, setCarga] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selecionCategoria, setSelecionCategoria] = useState('Todos');

    useEffect(() => {
        const cargaDatosCatalogo = async () => {
            setCarga(true);
            try {
                const datosProductos = await apiService.getProductos();
                setProductos(datosProductos);
                const datosCategorias = await apiService.getCategorias();
                setCategorias(datosCategorias);
                setError('');
            } catch (err) {
                setError('Error en el servidor backend..' + err);
            } finally {
                setCarga(false);
            }
        };
        cargaDatosCatalogo();
    }, []);

    const handleComprar = (producto) => {
        if (!usuario) {
            setVistaActual('login');
            return;
        }
        if (!apiService.esCliente(usuario)) {
            alert('Solo los usuarios registrados con el rol de Cliente pueden realizar compras.');
            return;
        }
        AddToCart && AddToCart(producto);
    };

    const filtroProductos = productos.filter((producto) => {
        const busqueda =
            producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (producto.descripcion && producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
        const busquedaCategorias =
            selecionCategoria === 'Todos' ||
            (producto.categoria && producto.categoria.nombre === selecionCategoria);
        return busqueda && busquedaCategorias;
    });

    const formatPrecio = (precio) => '$' + Number(precio).toLocaleString('es-MX', { minimumFractionDigits: 2 }) + ' MXN';

    if (carga) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-4 font-medium">Cargando productos....</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-green-700 rounded-2xl p-8 mb-8 text-white shadow-sm relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Catálogo de Productos</h1>
                    <p className="mt-2 text-green-100 text-sm sm:text-base">
                        Explora las mejores ofertas, productos de calidad y envíos garantizados directamente por nuestros proveedores.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-2.5 border border-amber-200 text-sm mb-6">
                    <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">Aviso del Servidor:</span> {error}. Mostrando interfaz local. Asegúrate de iniciar la API en Spring Boot.
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4 flex-shrink-0 space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Search className="w-4 h-4 text-green-500" /> Buscar Producto
                        </h3>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Escribe nombre o descripción..."
                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                        />
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            Categorías
                        </h3>
                        <div className="flex flex-col gap-2">
                            {['Todos', ...categorias.map(c => c.nombre)].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelecionCategoria(cat)}
                                    className={'text-left px-3 py-2 rounded-lg text-sm font-medium transition ' + (selecionCategoria === cat ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700')}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-3/4">
                    {filtroProductos.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                            <AlertTriangle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <h3 className="font-bold text-lg text-gray-800">No se encontraron productos</h3>
                            <p className="text-gray-500 text-sm mt-1">Prueba a modificar los filtros o los términos de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtroProductos.map((producto) => {
                                const defaultImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300";
                                const isOutOfStock = producto.stock <= 0;
                                return (
                                    <div key={producto.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
                                        <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                                            <img
                                                src={producto.imagenUrl || defaultImage}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => { e.target.src = defaultImage; }}
                                            />
                                            {producto.categoria && (
                                                <span className="absolute top-3 left-3 bg-green-800/80 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                                                    {producto.categoria.nombre}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                {producto.proveedor && (
                                                    <div className="text-xs text-gray-400 font-semibold">
                                                        {producto.proveedor.nombre}
                                                    </div>
                                                )}
                                                <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-green-600 transition-colors">
                                                    {producto.nombre}
                                                </h3>
                                                <p className="text-gray-500 text-xs line-clamp-2 h-8">
                                                    {producto.descripcion || 'Sin descripción disponible.'}
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="font-extrabold text-xl text-green-800">
                                                        {formatPrecio(producto.precio)}
                                                    </span>
                                                    <span className={'text-xs font-bold ' + (isOutOfStock ? 'text-red-500' : 'text-green-600')}>
                                                        {isOutOfStock ? 'Sin stock' : 'Disponibles: ' + producto.stock}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleComprar(producto)}
                                                    disabled={isOutOfStock}
                                                    className={'w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs shadow-sm transition-all duration-200 ' + (isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md')}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {!usuario ? 'Ingresa para comprar' : 'Añadir al Carrito'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
