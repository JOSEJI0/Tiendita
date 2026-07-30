import React, { useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/apiService';
import {
    LayoutDashboard, Package, ListChecks, BarChart3, Landmark,
    Building2, FolderKanban, Truck,
    Plus, Edit, Trash2, Search, X, AlertTriangle, RefreshCw,
    CheckCircle2, Clock, XCircle, ListOrdered, Save, Tag, Users,
    Key, UserPlus, Shield, User,
} from 'lucide-react';

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

const TABS = [
    { value: 'productos', label: 'Gestión de Productos', icon: Package },
    { value: 'categorias', label: 'Categorías', icon: FolderKanban },
    { value: 'proveedores', label: 'Proveedores', icon: Truck },
    { value: 'usuarios', label: 'Usuarios', icon: Users },
    { value: 'ventas', label: 'Registro de Ventas', icon: ListOrdered },
];

export const AdminDashboard = ({ user, adminSubTab, setAdminSubTab }) => {
    const tab = adminSubTab || 'productos';

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [ventas, setVentas] = useState([]);

    const [cargaProductos, setCargaProductos] = useState(true);
    const [cargaVentas, setCargaVentas] = useState(true);
    const [errorProductos, setErrorProductos] = useState('');
    const [errorVentas, setErrorVentas] = useState('');

    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [formProducto, setFormProducto] = useState(null);
    const [formCategoria, setFormCategoria] = useState(null);
    const [formProveedor, setFormProveedor] = useState(null);
    const [cargaCategorias, setCargaCategorias] = useState(false);
    const [cargaProveedores, setCargaProveedores] = useState(false);
    const [errorCategorias, setErrorCategorias] = useState('');
    const [errorProveedores, setErrorProveedores] = useState('');

    const [usuarios, setUsuarios] = useState([]);
    const [cargaUsuarios, setCargaUsuarios] = useState(false);
    const [errorUsuarios, setErrorUsuarios] = useState('');
    const [formUsuario, setFormUsuario] = useState(null);
    const [formPassword, setFormPassword] = useState(null);
    const [formNuevoAdmin, setFormNuevoAdmin] = useState(null);

    const cargarProductos = async () => {
        setCargaProductos(true);
        setErrorProductos('');
        try {
            const [prods, cats, provs] = await Promise.all([
                apiService.getProductos(),
                apiService.getCategorias(),
                apiService.getProveedores(),
            ]);
            setProductos(Array.isArray(prods) ? prods : []);
            setCategorias(Array.isArray(cats) ? cats : []);
            setProveedores(Array.isArray(provs) ? provs : []);
        } catch (err) {
            setErrorProductos(err?.message || 'No se pudieron cargar los productos.');
        } finally {
            setCargaProductos(false);
        }
    };

    const cargarVentas = async () => {
        setCargaVentas(true);
        setErrorVentas('');
        try {
            const data = await apiService.getVentas();
            const lista = Array.isArray(data) ? data : [];
            lista.sort((a, b) => new Date(b?.fecha || 0) - new Date(a?.fecha || 0));
            setVentas(lista);
        } catch (err) {
            setErrorVentas(err?.message || 'No se pudieron cargar las ventas.');
        } finally {
            setCargaVentas(false);
        }
    };

    useEffect(() => {
        cargarProductos();
        cargarVentas();
    }, []);

    const metricas = useMemo(() => {
        const totalRecaudado = ventas
            .filter(v => v?.estadoPago === 'PAGADO')
            .reduce((sum, v) => sum + Number(v?.total || 0), 0);
        const ordenesTotales = ventas.length;
        const productosActivos = productos.length;
        const totalCategorias = categorias.length;
        return { totalRecaudado, ordenesTotales, productosActivos, totalCategorias };
    }, [ventas, productos, categorias]);

    const productosFiltrados = useMemo(() => {
        const q = busquedaProducto.trim().toLowerCase();
        if (!q) return productos;
        return productos.filter(p =>
            (p?.nombre || '').toLowerCase().includes(q) ||
            (p?.descripcion || '').toLowerCase().includes(q)
        );
    }, [productos, busquedaProducto]);

    const abrirNuevoProducto = () => {
        setFormProducto({
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            imagenUrl: '',
            categoriaId: categorias[0]?.id || '',
            proveedorId: proveedores[0]?.id || '',
        });
    };

    const abrirEditarProducto = (producto) => {
        setFormProducto({
            id: producto.id,
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            precio: producto.precio ?? '',
            stock: producto.stock ?? '',
            imagenUrl: producto.imagenUrl || '',
            categoriaId: producto?.categoria?.id || categorias[0]?.id || '',
            proveedorId: producto?.proveedor?.id || proveedores[0]?.id || '',
        });
    };

    const cerrarFormProducto = () => setFormProducto(null);

    const guardarProducto = async (e) => {
        e.preventDefault();
        const esEdicion = !!formProducto.id;
        const payload = {
            nombre: formProducto.nombre.trim(),
            descripcion: formProducto.descripcion.trim(),
            precio: Number(formProducto.precio),
            stock: Number(formProducto.stock),
            imagenUrl: formProducto.imagenUrl.trim(),
            categoria: formProducto.categoriaId ? { id: Number(formProducto.categoriaId) } : null,
            proveedor: formProducto.proveedorId ? { id: Number(formProducto.proveedorId) } : null,
        };
        try {
            if (esEdicion) {
                await apiService.actualizarProducto(formProducto.id, payload);
            } else {
                await apiService.crearProducto(payload);
            }
            cerrarFormProducto();
            cargarProductos();
        } catch (err) {
            alert(err?.message || 'No se pudo guardar el producto.');
        }
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
        try {
            await apiService.eliminarProducto(id);
            cargarProductos();
        } catch (err) {
            alert(err?.message || 'No se pudo eliminar el producto.');
        }
    };

    const cargarCategorias = async () => {
        setCargaCategorias(true);
        setErrorCategorias('');
        try {
            const data = await apiService.getCategorias();
            setCategorias(Array.isArray(data) ? data : []);
        } catch (err) {
            setErrorCategorias(err?.message || 'No se pudieron cargar las categorías.');
        } finally {
            setCargaCategorias(false);
        }
    };

    const cargarProveedores = async () => {
        setCargaProveedores(true);
        setErrorProveedores('');
        try {
            const data = await apiService.getProveedores();
            setProveedores(Array.isArray(data) ? data : []);
        } catch (err) {
            setErrorProveedores(err?.message || 'No se pudieron cargar los proveedores.');
        } finally {
            setCargaProveedores(false);
        }
    };

    const abrirNuevoCategoria = () => setFormCategoria({ nombre: '' });
    const abrirEditarCategoria = (cat) => setFormCategoria({ id: cat.id, nombre: cat.nombre || '' });
    const cerrarFormCategoria = () => setFormCategoria(null);

    const guardarCategoria = async (e) => {
        e.preventDefault();
        try {
            if (formCategoria.id) {
                await apiService.actualizarCategoria(formCategoria.id, { nombre: formCategoria.nombre.trim() });
            } else {
                await apiService.crearCategoria({ nombre: formCategoria.nombre.trim() });
            }
            cerrarFormCategoria();
            cargarCategorias();
        } catch (err) {
            alert(err?.message || 'No se pudo guardar la categoría.');
        }
    };

    const eliminarCategoria = async (id) => {
        if (!window.confirm('¿Eliminar esta categoría? Los productos asociados podrían quedar sin categoría.')) return;
        try {
            await apiService.eliminarCategoria(id);
            cargarCategorias();
        } catch (err) {
            alert(err?.message || 'No se pudo eliminar la categoría.');
        }
    };

    const abrirNuevoProveedor = () => setFormProveedor({ nombre: '', email: '', telefono: '', direccion: '' });
    const abrirEditarProveedor = (prov) => setFormProveedor({
        id: prov.id,
        nombre: prov.nombre || '',
        email: prov.email || '',
        telefono: prov.telefono || '',
        direccion: prov.direccion || '',
    });
    const cerrarFormProveedor = () => setFormProveedor(null);

    const guardarProveedor = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: formProveedor.nombre.trim(),
                email: formProveedor.email.trim(),
                telefono: formProveedor.telefono.trim(),
                direccion: formProveedor.direccion.trim(),
            };
            if (formProveedor.id) {
                await apiService.actualizarProveedor(formProveedor.id, payload);
            } else {
                await apiService.crearProveedor(payload);
            }
            cerrarFormProveedor();
            cargarProveedores();
        } catch (err) {
            alert(err?.message || 'No se pudo guardar el proveedor.');
        }
    };

    const eliminarProveedor = async (id) => {
        if (!window.confirm('¿Eliminar este proveedor? Los productos asociados podrían quedar sin proveedor.')) return;
        try {
            await apiService.eliminarProveedor(id);
            cargarProveedores();
        } catch (err) {
            alert(err?.message || 'No se pudo eliminar el proveedor.');
        }
    };

    const cargarUsuarios = async () => {
        setCargaUsuarios(true);
        setErrorUsuarios('');
        try {
            const data = await apiService.getUsuarios();
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (err) {
            setErrorUsuarios(err?.message || 'No se pudieron cargar los usuarios.');
        } finally {
            setCargaUsuarios(false);
        }
    };

    const abrirEditarUsuario = (usuario) => {
        setFormUsuario({
            id: usuario.id,
            username: usuario.username || '',
            nombre: usuario.nombre || '',
            direccion: usuario.direccion || '',
            telefono: usuario.telefono || '',
        });
    };
    const cerrarFormUsuario = () => setFormUsuario(null);

    const guardarUsuario = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateUsuario(formUsuario.id, {
                username: formUsuario.username.trim(),
                nombre: formUsuario.nombre.trim(),
                direccion: formUsuario.direccion.trim(),
                telefono: formUsuario.telefono.trim(),
            });
            cerrarFormUsuario();
            cargarUsuarios();
        } catch (err) {
            alert(err?.message || 'No se pudo actualizar el usuario.');
        }
    };

    const abrirCambiarPassword = (usuario) => {
        setFormPassword({ id: usuario.id, username: usuario.username });
    };
    const cerrarFormPassword = () => setFormPassword(null);

    const guardarPassword = async (e) => {
        e.preventDefault();
        try {
            await apiService.changePassword(formPassword.id, {
                passwordActual: formPassword.passwordActual,
                nuevoPassword: formPassword.nuevoPassword,
            });
            alert('Contraseña actualizada correctamente.');
            cerrarFormPassword();
        } catch (err) {
            alert(err?.message || 'No se pudo cambiar la contraseña.');
        }
    };

    const eliminarUsuario = async (id) => {
        if (!window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
        try {
            await apiService.deleteUsuario(id);
            cargarUsuarios();
        } catch (err) {
            alert(err?.message || 'No se pudo eliminar el usuario.');
        }
    };

    const abrirNuevoAdmin = () => setFormNuevoAdmin({ username: '', password: '', nombre: '', direccion: '', telefono: '' });
    const cerrarNuevoAdmin = () => setFormNuevoAdmin(null);

    const guardarNuevoAdmin = async (e) => {
        e.preventDefault();
        try {
            await apiService.createAdmin({
                username: formNuevoAdmin.username.trim(),
                password: formNuevoAdmin.password,
                nombre: formNuevoAdmin.nombre.trim(),
                direccion: formNuevoAdmin.direccion.trim(),
                telefono: formNuevoAdmin.telefono.trim(),
            });
            cerrarNuevoAdmin();
            cargarUsuarios();
        } catch (err) {
            alert(err?.message || 'No se pudo crear el administrador.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-green-700 rounded-2xl p-8 mb-8 text-white shadow-sm relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutDashboard className="w-7 h-7 text-green-200" />
                        <span className="text-green-200 text-xs font-bold uppercase tracking-widest">Panel de administración</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {user?.nombre ? `Hola, ${user.nombre}` : 'Bienvenido'}
                    </h1>
                    <p className="mt-2 text-green-100 text-sm sm:text-base">
                        Supervisa las ventas, gestiona el inventario y administra la plataforma.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <MetricaCard
                    icon={Landmark}
                    titulo="TOTAL RECAUDADO"
                    valor={`${formatPrecio(metricas.totalRecaudado)}`}
                    subtitulo="↗ Transacciones Pagadas"
                />
                <MetricaCard
                    icon={BarChart3}
                    titulo="ORDENES TOTALES"
                    valor={`${metricas.ordenesTotales} Ordenes`}
                    subtitulo="Historial completo"
                />
                <MetricaCard
                    icon={Package}
                    titulo="PRODUCTOS ACTIVOS"
                    valor={`${metricas.productosActivos} Articulos`}
                    subtitulo="En inventario"
                />
                <MetricaCard
                    icon={ListChecks}
                    titulo="CATEGORÍAS"
                    valor={`${metricas.totalCategorias} Categorías`}
                    subtitulo="Clasificaciones"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-2 flex flex-wrap">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        const activo = tab === t.value;
                        return (
                            <button
                                key={t.value}
                                onClick={() => setAdminSubTab(t.value)}
                                className={
                                    'flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-colors border-b-2 cursor-pointer ' +
                                    (activo
                                        ? 'text-green-700 border-green-600'
                                        : 'text-gray-500 border-transparent hover:text-green-600')
                                }
                            >
                                <Icon className="w-4 h-4" />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {tab === 'productos' ? (
                    <ProductosTab
                        productos={productosFiltrados}
                        carga={cargaProductos}
                        error={errorProductos}
                        busqueda={busquedaProducto}
                        setBusqueda={setBusquedaProducto}
                        onNuevo={abrirNuevoProducto}
                        onEditar={abrirEditarProducto}
                        onEliminar={eliminarProducto}
                        onRecargar={cargarProductos}
                    />
                ) : tab === 'usuarios' ? (
                    <UsuariosTab
                        usuarios={usuarios}
                        carga={cargaUsuarios}
                        error={errorUsuarios}
                        onEditar={abrirEditarUsuario}
                        onCambiarPassword={abrirCambiarPassword}
                        onEliminar={eliminarUsuario}
                        onNuevoAdmin={abrirNuevoAdmin}
                        onRecargar={cargarUsuarios}
                    />
                ) : tab === 'categorias' ? (
                    <CategoriasTab
                        categorias={categorias}
                        carga={cargaCategorias}
                        error={errorCategorias}
                        onNuevo={abrirNuevoCategoria}
                        onEditar={abrirEditarCategoria}
                        onEliminar={eliminarCategoria}
                        onRecargar={cargarCategorias}
                    />
                ) : tab === 'proveedores' ? (
                    <ProveedoresTab
                        proveedores={proveedores}
                        carga={cargaProveedores}
                        error={errorProveedores}
                        onNuevo={abrirNuevoProveedor}
                        onEditar={abrirEditarProveedor}
                        onEliminar={eliminarProveedor}
                        onRecargar={cargarProveedores}
                    />
                ) : (
                    <VentasTab
                        ventas={ventas}
                        carga={cargaVentas}
                        error={errorVentas}
                        onRecargar={cargarVentas}
                    />
                )}
            </div>

            {formProducto && (
                <ProductoModal
                    form={formProducto}
                    setForm={setFormProducto}
                    categorias={categorias}
                    proveedores={proveedores}
                    onClose={cerrarFormProducto}
                    onGuardar={guardarProducto}
                />
            )}

            {formCategoria && (
                <CategoriaModal
                    form={formCategoria}
                    setForm={setFormCategoria}
                    onClose={cerrarFormCategoria}
                    onGuardar={guardarCategoria}
                />
            )}

            {formProveedor && (
                <ProveedorModal
                    form={formProveedor}
                    setForm={setFormProveedor}
                    onClose={cerrarFormProveedor}
                    onGuardar={guardarProveedor}
                />
            )}

            {formUsuario && (
                <UsuarioModal
                    form={formUsuario}
                    setForm={setFormUsuario}
                    onClose={cerrarFormUsuario}
                    onGuardar={guardarUsuario}
                />
            )}

            {formPassword && (
                <ChangePasswordModal
                    form={formPassword}
                    setForm={setFormPassword}
                    onClose={cerrarFormPassword}
                    onGuardar={guardarPassword}
                />
            )}

            {formNuevoAdmin && (
                <NuevoAdminModal
                    form={formNuevoAdmin}
                    setForm={setFormNuevoAdmin}
                    onClose={cerrarNuevoAdmin}
                    onGuardar={guardarNuevoAdmin}
                />
            )}
        </div>
    );
};

const MetricaCard = ({ icon: Icon, titulo, valor, subtitulo }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{titulo}</div>
                <div className="text-2xl font-extrabold text-gray-800">{valor}</div>
                <div className="text-xs text-gray-500">{subtitulo}</div>
            </div>
        </div>
    );
};

const ProductosTab = ({ productos, carga, error, busqueda, setBusqueda, onNuevo, onEditar, onEliminar, onRecargar }) => (
    <div className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onRecargar}
                    disabled={carga}
                    className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-green-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Recargar"
                >
                    <RefreshCw className={`w-4 h-4 ${carga ? 'animate-spin' : ''}`} />
                </button>
                <button
                    onClick={onNuevo}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                </button>
            </div>
        </div>

        {error && (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-2.5 border border-amber-200 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        {carga ? (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-3 text-sm">Cargando productos...</p>
            </div>
        ) : productos.length === 0 ? (
            <div className="text-center py-12 px-6">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800">No hay productos</h3>
                <p className="text-gray-500 text-sm mt-1">Comienza agregando un nuevo producto al catálogo.</p>
            </div>
        ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="text-left px-4 py-3 font-bold">Producto</th>
                            <th className="text-left px-4 py-3 font-bold">Categoría</th>
                            <th className="text-left px-4 py-3 font-bold">Proveedor</th>
                            <th className="text-right px-4 py-3 font-bold">Precio</th>
                            <th className="text-right px-4 py-3 font-bold">Stock</th>
                            <th className="text-center px-4 py-3 font-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {productos.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={p.imagenUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=80'}
                                            alt={p.nombre}
                                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=80'; }}
                                        />
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-800 truncate">{p.nombre}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{p.descripcion}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                        <Tag className="w-3 h-3" />
                                        {p?.categoria?.nombre || '—'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-700 text-xs">{p?.proveedor?.nombre || '—'}</td>
                                <td className="px-4 py-3 text-right font-bold text-green-800">{formatPrecio(p.precio)}</td>
                                <td className="px-4 py-3 text-right">
                                    <span className={`font-bold text-xs ${(p.stock || 0) > 0 ? 'text-green-700' : 'text-red-600'}`}>
                                        {p.stock || 0}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => onEditar(p)}
                                            className="p-2 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEliminar(p.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

const VentasTab = ({ ventas, carga, error, onRecargar }) => {
    const total = ventas.filter(v => v?.estadoPago === 'PAGADO').reduce((s, v) => s + Number(v?.total || 0), 0);
    const pagadas = ventas.filter(v => v?.estadoPago === 'PAGADO').length;

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">
                        <span className="font-bold text-gray-800">{ventas.length}</span> órdenes ·
                        <span className="font-bold text-green-700 ml-1">{pagadas}</span> pagadas ·
                        Total: <span className="font-bold text-green-800">{formatPrecio(total)}</span>
                    </div>
                </div>
                <button
                    onClick={onRecargar}
                    disabled={carga}
                    className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-green-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Recargar"
                >
                    <RefreshCw className={`w-4 h-4 ${carga ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-2.5 border border-amber-200 text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {carga ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                    <p className="text-gray-500 mt-3 text-sm">Cargando ventas...</p>
                </div>
            ) : ventas.length === 0 ? (
                <div className="text-center py-12 px-6">
                    <ListOrdered className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-800">No hay ventas registradas</h3>
                    <p className="text-gray-500 text-sm mt-1">Cuando los clientes realicen compras aparecerán aquí.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="text-left px-4 py-3 font-bold">Orden</th>
                                <th className="text-left px-4 py-3 font-bold">Cliente</th>
                                <th className="text-left px-4 py-3 font-bold">Fecha</th>
                                <th className="text-right px-4 py-3 font-bold">Artículos</th>
                                <th className="text-right px-4 py-3 font-bold">Total</th>
                                <th className="text-center px-4 py-3 font-bold">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ventas.map(v => {
                                const estado = ESTADO_STYLES[v?.estadoPago] || ESTADO_STYLES.PENDIENTE;
                                const EstadoIcon = estado.icon;
                                return (
                                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-800">#{v.id}</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            <div className="font-medium">{v?.cliente?.nombre || '—'}</div>
                                            <div className="text-xs text-gray-500">{v?.cliente?.email || ''}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 text-xs">{formatFecha(v.fecha)}</td>
                                        <td className="px-4 py-3 text-right text-gray-700">{v?.detalles?.length || 0}</td>
                                        <td className="px-4 py-3 text-right font-bold text-green-800">{formatPrecio(v.total)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${estado.bg} ${estado.color}`}>
                                                <EstadoIcon className="w-3 h-3" />
                                                {estado.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const ProductoModal = ({ form, setForm, categorias, proveedores, onClose, onGuardar }) => {
    const esEdicion = !!form.id;

    const handle = (k, v) => setForm({ ...form, [k]: v });

    return (
        <div className="fixed inset-0 z-50 bg-green-950/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-600" />
                        {esEdicion ? 'Editar producto' : 'Nuevo producto'}
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onGuardar} className="p-6 space-y-4">
                    <CampoForm label="Nombre" required>
                        <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => handle('nombre', e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Nombre del producto"
                        />
                    </CampoForm>

                    <CampoForm label="Descripción">
                        <textarea
                            value={form.descripcion}
                            onChange={(e) => handle('descripcion', e.target.value)}
                            rows={3}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            placeholder="Descripción breve"
                        />
                    </CampoForm>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CampoForm label="Precio (MXN)" required>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.precio}
                                onChange={(e) => handle('precio', e.target.value)}
                                required
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="0.00"
                            />
                        </CampoForm>
                        <CampoForm label="Stock" required>
                            <input
                                type="number"
                                min="0"
                                value={form.stock}
                                onChange={(e) => handle('stock', e.target.value)}
                                required
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="0"
                            />
                        </CampoForm>
                    </div>

                    <CampoForm label="URL de imagen">
                        <input
                            type="url"
                            value={form.imagenUrl}
                            onChange={(e) => handle('imagenUrl', e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="https://..."
                        />
                    </CampoForm>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CampoForm label="Categoría" required>
                            <select
                                value={form.categoriaId}
                                onChange={(e) => handle('categoriaId', e.target.value)}
                                required
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                                <option value="">Seleccionar...</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </CampoForm>
                        <CampoForm label="Proveedor" required>
                            <select
                                value={form.proveedorId}
                                onChange={(e) => handle('proveedorId', e.target.value)}
                                required
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                                <option value="">Seleccionar...</option>
                                {proveedores.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </CampoForm>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            {esEdicion ? 'Guardar cambios' : 'Crear producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CategoriasTab = ({ categorias, carga, error, onNuevo, onEditar, onEliminar, onRecargar }) => (
    <div className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Categorías</h3>
                <p className="text-sm text-gray-500">{categorias.length} categorías registradas</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onRecargar} disabled={carga}
                    className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-green-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Recargar">
                    <RefreshCw className={`w-4 h-4 ${carga ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={onNuevo}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                </button>
            </div>
        </div>

        {error && (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-2.5 border border-amber-200 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        {carga ? (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-3 text-sm">Cargando categorías...</p>
            </div>
        ) : categorias.length === 0 ? (
            <div className="text-center py-12 px-6">
                <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800">No hay categorías</h3>
                <p className="text-gray-500 text-sm mt-1">Crea la primera categoría para clasificar tus productos.</p>
            </div>
        ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="text-left px-4 py-3 font-bold">ID</th>
                            <th className="text-left px-4 py-3 font-bold">Nombre</th>
                            <th className="text-center px-4 py-3 font-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categorias.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-gray-500 text-xs font-mono">#{c.id}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <FolderKanban className="w-4 h-4 text-green-400" />
                                        <span className="font-medium text-gray-800">{c.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button onClick={() => onEditar(c)}
                                            className="p-2 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
                                            title="Editar">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onEliminar(c.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                                            title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

const CategoriaModal = ({ form, setForm, onClose, onGuardar }) => {
    const esEdicion = !!form.id;
    return (
        <div className="fixed inset-0 z-50 bg-green-950/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 text-green-600" />
                        {esEdicion ? 'Editar categoría' : 'Nueva categoría'}
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={onGuardar} className="p-6 space-y-4">
                    <CampoForm label="Nombre" required>
                        <input type="text" value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Nombre de la categoría" />
                    </CampoForm>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors cursor-pointer">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer">
                            <Save className="w-4 h-4" />
                            {esEdicion ? 'Guardar cambios' : 'Crear categoría'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProveedoresTab = ({ proveedores, carga, error, onNuevo, onEditar, onEliminar, onRecargar }) => (
    <div className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Proveedores</h3>
                <p className="text-sm text-gray-500">{proveedores.length} proveedores registrados</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onRecargar} disabled={carga}
                    className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-green-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Recargar">
                    <RefreshCw className={`w-4 h-4 ${carga ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={onNuevo}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Nuevo Proveedor
                </button>
            </div>
        </div>

        {error && (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-2.5 border border-amber-200 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        {carga ? (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-3 text-sm">Cargando proveedores...</p>
            </div>
        ) : proveedores.length === 0 ? (
            <div className="text-center py-12 px-6">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800">No hay proveedores</h3>
                <p className="text-gray-500 text-sm mt-1">Agrega proveedores para asociarlos a tus productos.</p>
            </div>
        ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="text-left px-4 py-3 font-bold">Proveedor</th>
                            <th className="text-left px-4 py-3 font-bold">Email</th>
                            <th className="text-left px-4 py-3 font-bold">Teléfono</th>
                            <th className="text-left px-4 py-3 font-bold">Dirección</th>
                            <th className="text-center px-4 py-3 font-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {proveedores.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-green-400" />
                                        <span className="font-medium text-gray-800">{p.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{p.email || '—'}</td>
                                <td className="px-4 py-3 text-gray-600">{p.telefono || '—'}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{p.direccion || '—'}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button onClick={() => onEditar(p)}
                                            className="p-2 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
                                            title="Editar">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onEliminar(p.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                                            title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

const ProveedorModal = ({ form, setForm, onClose, onGuardar }) => {
    const esEdicion = !!form.id;
    const handle = (k, v) => setForm({ ...form, [k]: v });
    return (
        <div className="fixed inset-0 z-50 bg-green-950/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-green-600" />
                        {esEdicion ? 'Editar proveedor' : 'Nuevo proveedor'}
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={onGuardar} className="p-6 space-y-4">
                    <CampoForm label="Nombre" required>
                        <input type="text" value={form.nombre}
                            onChange={(e) => handle('nombre', e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Nombre del proveedor" />
                    </CampoForm>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CampoForm label="Email" required>
                            <input type="email" value={form.email}
                                onChange={(e) => handle('email', e.target.value)}
                                required
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="correo@ejemplo.com" />
                        </CampoForm>
                        <CampoForm label="Teléfono" required>
                            <input type="tel" value={form.telefono}
                                onChange={(e) => handle('telefono', e.target.value)}
                                required
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="55 1234 5678" />
                        </CampoForm>
                    </div>
                    <CampoForm label="Dirección">
                        <input type="text" value={form.direccion}
                            onChange={(e) => handle('direccion', e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Calle, colonia, ciudad" />
                    </CampoForm>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors cursor-pointer">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer">
                            <Save className="w-4 h-4" />
                            {esEdicion ? 'Guardar cambios' : 'Crear proveedor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UsuariosTab = ({ usuarios, carga, error, onEditar, onCambiarPassword, onEliminar, onNuevoAdmin, onRecargar }) => {
    useEffect(() => {
        onRecargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Usuarios</h3>
                    <p className="text-sm text-gray-500">{usuarios.length} usuarios registrados</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onRecargar} disabled={carga}
                        className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-green-600 transition-colors cursor-pointer disabled:opacity-50"
                        title="Recargar">
                        <RefreshCw className={`w-4 h-4 ${carga ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={onNuevoAdmin}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer">
                        <UserPlus className="w-4 h-4" />
                        Nuevo Administrador
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-2.5 border border-amber-200 text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {carga ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                    <p className="text-gray-500 mt-3 text-sm">Cargando usuarios...</p>
                </div>
            ) : usuarios.length === 0 ? (
                <div className="text-center py-12 px-6">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-800">No hay usuarios</h3>
                    <p className="text-gray-500 text-sm mt-1">Los usuarios registrados aparecerán aquí.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="text-left px-4 py-3 font-bold">ID</th>
                                <th className="text-left px-4 py-3 font-bold">Username</th>
                                <th className="text-left px-4 py-3 font-bold">Nombre</th>
                                <th className="text-left px-4 py-3 font-bold">Rol</th>
                                <th className="text-center px-4 py-3 font-bold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {usuarios.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">#{u.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-green-400" />
                                            <span className="font-medium text-gray-800">{u.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{u.nombre}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                            u.role === 'ROLE_ADMIN'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            <Shield className="w-3 h-3" />
                                            {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Cliente'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => onEditar(u)}
                                                className="p-2 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
                                                title="Editar">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onCambiarPassword(u)}
                                                className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                                title="Cambiar contraseña">
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onEliminar(u.id)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                                                title="Eliminar">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const UsuarioModal = ({ form, setForm, onClose, onGuardar }) => {
    const handle = (k, v) => setForm({ ...form, [k]: v });
    return (
        <div className="fixed inset-0 z-50 bg-green-950/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Editar usuario
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={onGuardar} className="p-6 space-y-4">
                    <CampoForm label="Username" required>
                        <input type="text" value={form.username}
                            onChange={(e) => handle('username', e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="username" />
                    </CampoForm>
                    <CampoForm label="Nombre" required>
                        <input type="text" value={form.nombre}
                            onChange={(e) => handle('nombre', e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Nombre completo" />
                    </CampoForm>
                    <CampoForm label="Dirección">
                        <input type="text" value={form.direccion}
                            onChange={(e) => handle('direccion', e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Dirección" />
                    </CampoForm>
                    <CampoForm label="Teléfono">
                        <input type="text" value={form.telefono}
                            onChange={(e) => handle('telefono', e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="55 1234 5678" />
                    </CampoForm>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors cursor-pointer">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer">
                            <Save className="w-4 h-4" />
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ChangePasswordModal = ({ form, setForm, onClose, onGuardar }) => {
    const handle = (k, v) => setForm({ ...form, [k]: v });
    return (
        <div className="fixed inset-0 z-50 bg-green-950/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <Key className="w-5 h-5 text-green-600" />
                        Cambiar contraseña — {form.username}
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={onGuardar} className="p-6 space-y-4">
                    <CampoForm label="Contraseña actual" required>
                        <input type="password" value={form.passwordActual || ''}
                            onChange={(e) => handle('passwordActual', e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="••••••••" />
                    </CampoForm>
                    <CampoForm label="Nueva contraseña" required>
                        <input type="password" value={form.nuevoPassword || ''}
                            onChange={(e) => handle('nuevoPassword', e.target.value)}
                            required minLength={6}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Mínimo 6 caracteres" />
                    </CampoForm>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose}
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
    );
};

const NuevoAdminModal = ({ form, setForm, onClose, onGuardar }) => {
    const handle = (k, v) => setForm({ ...form, [k]: v });
    return (
        <div className="fixed inset-0 z-50 bg-green-950/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Nuevo Administrador
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={onGuardar} className="p-6 space-y-4">
                    <CampoForm label="Username" required>
                        <input type="text" value={form.username}
                            onChange={(e) => handle('username', e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="username" />
                    </CampoForm>
                    <CampoForm label="Nombre" required>
                        <input type="text" value={form.nombre}
                            onChange={(e) => handle('nombre', e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Nombre completo" />
                    </CampoForm>
                    <CampoForm label="Contraseña" required>
                        <input type="password" value={form.password}
                            onChange={(e) => handle('password', e.target.value)}
                            required minLength={6}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Mínimo 6 caracteres" />
                    </CampoForm>
                    <CampoForm label="Dirección">
                        <input type="text" value={form.direccion}
                            onChange={(e) => handle('direccion', e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Dirección" />
                    </CampoForm>
                    <CampoForm label="Teléfono">
                        <input type="text" value={form.telefono}
                            onChange={(e) => handle('telefono', e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="55 1234 5678" />
                    </CampoForm>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors cursor-pointer">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer">
                            <UserPlus className="w-4 h-4" />
                            Crear administrador
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CampoForm = ({ label, required, children }) => (
    <label className="block">
        <span className="block text-xs font-bold text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        {children}
    </label>
);