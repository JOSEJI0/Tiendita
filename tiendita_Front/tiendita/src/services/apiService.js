const API_URL = import.meta.env.VITE_API_URL || '/api/v1/';

//Método para el manejo de errores de la API
const handleResponse = async (response) => {
    if (!response.ok) {
        const raw = await response.text();
        let message = raw;
        try {
            const parsed = JSON.parse(raw);
            message = parsed.message || parsed.error || parsed || raw;
        } catch (_) {}
        throw new Error(message || `Error ${response.status} en la API`);
    }
    if (response.status === 204) { return null; }
    return await response.json();
};

// ===== Autenticación =====
const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

const apiUrl = (path) => `${API_URL}${path}`;

//Método principal de peticiones
export const apiService = {
    //Peticiones a productos
    getProductos: async () => {
        const response = await fetch(API_URL+'productos/', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getProducto: async (id) => {
        const response = await fetch(API_URL+'productos/'+id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearProducto: async (producto) => {
        const response = await fetch(API_URL+'productos/', {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(producto),
        });
        return await handleResponse(response);
    },
    actualizarProducto: async (id, producto) => {
        const response = await fetch(API_URL+'productos/'+id, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(producto),
        });
        return await handleResponse(response);
    },
    eliminarProducto: async (id) => {
        const response = await fetch(API_URL+'productos/'+id, {
            method: "DELETE",
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    //Categorias
    //Peticiones a Categorias
    getCategorias: async () => {
        const response = await fetch(API_URL+'categorias', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getCategoria: async (id) => {
        const response = await fetch(API_URL+'categorias/'+id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearCategoria: async (categoria) => {
        const response = await fetch(API_URL+'categorias', {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(categoria),
        });
        return await handleResponse(response);
    },
    actualizarCategoria: async (id, categoria) => {
        const response = await fetch(API_URL+'categorias/'+id, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(categoria),
        });
        return await handleResponse(response);
    },
    eliminarCategoria: async (id) => {
        const response = await fetch(API_URL+'categorias/'+id, {
            method: "DELETE",
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    //Clientes
    //Peticiones a Clientes
    getClientes: async () => {
        const response = await fetch(API_URL+'clientes', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getCliente: async (id) => {
        const response = await fetch(API_URL+'clientes/'+id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearCliente: async (cliente) => {
        const response = await fetch(API_URL+'clientes', {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(cliente),
        });
        return await handleResponse(response);
    },
    actualizarCliente: async (id, cliente) => {
        const response = await fetch(API_URL+'clientes/'+id, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(cliente),
        });
        return await handleResponse(response);
    },
    eliminarCliente: async (id) => {
        const response = await fetch(API_URL+'clientes/'+id, {
            method: "DELETE",
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },
    //Usuarios
    getUsuarios: async () => {
        const response = await fetch(API_URL+'usuarios', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getUsuario: async (id) => {
        const response = await fetch(API_URL+'usuarios/'+id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    updateUsuario: async (id, data) => {
        const response = await fetch(API_URL+'usuarios/'+id, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    },
    changePassword: async (id, data) => {
        const response = await fetch(API_URL+'usuarios/'+id+'/password', {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    },
    deleteUsuario: async (id) => {
        const response = await fetch(API_URL+'usuarios/'+id, {
            method: "DELETE",
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },
    createAdmin: async (data) => {
        const response = await fetch(API_URL+'usuarios', {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    },
    //Proveedores
    //Peticiones a Proveedores
    getProveedores: async () => {
        const response = await fetch(API_URL+'proveedores', { headers: getHeaders() });
        return  await handleResponse(response);
    },
    getProveedor: async (id) => {
        const response = await fetch(API_URL+'proveedores/'+id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearProveedor: async (proveedor) => {
        const response = await fetch(API_URL+'proveedores', {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(proveedor),
        });
        return await handleResponse(response);
    },
    actualizarProveedor: async (id, proveedor) => {
        const response = await fetch(API_URL+'proveedores/'+id, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(proveedor),
        });
        return await handleResponse(response);
    },
    eliminarProveedor: async (id) => {
        const response = await fetch(API_URL+'proveedores/'+id, {
            method: "DELETE",
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },
    //Ventas
    //Peticiones a Ventas
    getVentas: async () => {
        const response = await fetch(API_URL+'ventas', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getMisCompras: async () => {
        const response = await fetch(API_URL+'ventas/mis-compras', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getVenta: async (id) => {
        const response = await fetch(API_URL+'ventas/'+id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearVenta: async (venta) => {
        const response = await fetch(API_URL+'ventas', {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(venta),
        });
        return await handleResponse(response);
    },
    actualizarVenta: async (id, venta) => {
        const response = await fetch(API_URL+'ventas/'+id, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(venta),
        });
        return await handleResponse(response);
    },
    eliminarVenta: async (id) => {
        const response = await fetch(API_URL+'ventas/'+id, {
            method: "DELETE",
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },
    //Pagos
    //Peticiones a Pagos
    getPagos: async () => {
        const response = await fetch(API_URL+'pagos', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getPago: async (id) => {
        const response = await fetch(API_URL+'pagos/'+id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearPago: async (pago) => {
        const response = await fetch(API_URL+'pagos', {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(pago),
        });
        return await handleResponse(response);
    },
    actualizarPago: async (id, pago) => {
        const response = await fetch(API_URL+'pagos/'+id, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(pago),
        });
        return await handleResponse(response);
    },
    eliminarPago: async (id) => {
        const response = await fetch(API_URL+'pagos/'+id, {
            method: "DELETE",
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    esAdmin: (user) => !!(user && (user.rol === 'ROLE_ADMIN')),
    esCliente: (user) => !!(user && (user.rol === 'ROLE_CLIENTE')),
};

export const authService = {
    login: async ({ username, password }) => {
        const response = await fetch(apiUrl('auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await handleResponse(response);
        if(data.token){
            localStorage.setItem('token', data.token),
            localStorage.setItem('username', data.username),
            localStorage.setItem('nombre', data.nombre),
            localStorage.setItem('rol', data.role || data.rol),
            localStorage.setItem('userId', data.id)
        }
        return data;
    },

    logout: () =>{
        localStorage.removeItem('token'),
        localStorage.removeItem('username'),
        localStorage.removeItem('nombre'),
        localStorage.removeItem('rol')
    },

    register: async (usuario) => {
        const response = await fetch(apiUrl('auth/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario),
        });
        return await handleResponse(response);
    },
    me: async () => {
        const response = await fetch(apiUrl('auth/me'), { headers: getHeaders() });
        return await handleResponse(response);
    },

    //Metodos de pago
crearIntencionPago: async (idVenta)=>{
    const response = await fetch(API_URL+"pagos/crear-intencion",
        {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({idVenta, moneda:'mxn'}),
        });
        return await handleResponse(response);
    },
    confirmarPagoVenta: async(idVenta)=>{
        const response = await fetch(API_URL+"pagos/confirmar-pago/"+idVenta,
        {
            method: 'POST',
            headers: getHeaders(),
        });
    return await handleResponse(response);
    },
};

// Extendemos apiService con helpers de sesión sin romper lo existente
apiService.login = authService.login;
apiService.registrarUsuario = authService.register;
apiService.crearIntencionPago = authService.crearIntencionPago;
apiService.confirmarPagoVenta = authService.confirmarPagoVenta;
apiService.loginUser = async ({ username, password }) => {
    const data = await authService.login({ username, password });
    if (data && data.token) apiService.setSession(data);
    return data;
};
apiService.setSession = (data) => {
    if (data?.token) localStorage.setItem('token', data.token);
    if (data?.username) localStorage.setItem('username', data.username);
    if (data?.nombre) localStorage.setItem('nombre', data.nombre);
    if (data?.direccion !== undefined && data?.direccion !== null) localStorage.setItem('direccion', data.direccion);
    if (data?.telefono !== undefined && data?.telefono !== null) localStorage.setItem('telefono', data.telefono);
    if (data?.role || data?.rol) localStorage.setItem('rol', data.role || data.rol);
    if (data?.id) localStorage.setItem('userId', data.id);
};
apiService.isAuthenticated = () => !!localStorage.getItem('token');
apiService.logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('nombre');
    localStorage.removeItem('direccion');
    localStorage.removeItem('telefono');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
};