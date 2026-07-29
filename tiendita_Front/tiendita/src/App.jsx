import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import { Catalogo } from './components/Catalogo';
import { Navbar } from './components/NavBar';
import { Login } from './components/Login';
import { Registro } from './components/Registro';
import { ClienteDashboard } from './components/ClienteDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Cart } from './components/Cart';
import { apiService } from './services/apiService';
import { CheckoutForm } from './components/CheckoutForm';

function App() {
  const [vistaActual, setVistaActual] = useState('catalogo');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [ventaActiva, setVentaActiva] = useState(null);
  const [adminSubTab, setAdminSubTab] = useState('productos');

  useEffect(() => {
    if (apiService.isAuthenticated && apiService.isAuthenticated()) {
      const restoredUser = {
        id: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        nombre: localStorage.getItem('nombre'),
        rol: localStorage.getItem('rol'),
      };
      setUser(restoredUser);
      if (apiService.esAdmin(restoredUser)) {
        setVistaActual('admin-dashboard');
      } else if (apiService.esCliente(restoredUser)) {
        setVistaActual('cliente-dashboard');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser({
      id: userData.id,
      username: userData.username,
      nombre: userData.nombre,
      rol: userData.rol || userData.role,
    });
    if (apiService.esAdmin(userData)) {
      setVistaActual('admin-dashboard');
    } else {
      setVistaActual('cliente-dashboard');
    }
  };

  //Funcion de carrito de compras
  const AddToCart = (producto) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.producto.id);
      if(existing){
        if(existing.cantidad >= producto.stock){
          alert("No se puede añadir mas stock para " + producto.nombre +
            "Inventario disponible " + producto.stock);
            return prevCart;
          }
          return prevCart.map((item) =>
            item.producto.id === producto.id ? {...item, cantidad:
              item.cantidad + 1} : item
          );
        }
        return[...prevCart, {producto: producto, cantidad: 1}];
    });
    setIsCartOpen(true);
  };

  //Actualizar Csntidad
  const updateQuantity = (productoId, nuevaCantidad) =>{
    if(nuevaCantidad <= 0){
      removeFromCart(productoId);
      return;
    }
    setCart((prevCart) =>
    prevCart.map((item) =>{
      if(item.producto.id === productoId){
        if(nuevaCantidad > item.producto.stock){
          alert("No se puede exceder el stock disponible : "
          + item.producto.stock)
          return item;
        }
        return{...item, cantidad: nuevaCantidad};
      }
      return item;
    }));
  };

  //Remover del carrito
  const removeFromCart = (productoId) =>{
    setCart(prevCart => prevCart.filter((item) => item.producto.id !== productoId));
  };

  //Limpiar carrito
  const clearCart = () => setCart([]);

  //Contar productos en carrito
  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const handleLogout = () => {
    apiService.logout && apiService.logout();
    setUser(null);
    setCart([]);
    setVentaActiva(null);
    setAdminSubTab('productos');
    setVistaActual('catalogo');
  };

  const vistaContenido = () => {
    switch (vistaActual) {
      case 'catalogo':
        return <Catalogo setVistaActual={setVistaActual}
        usuario={user}
        AddToCart={AddToCart}
        />;
      case 'registro':
        return (
          <Registro
            onRegistroSuccess={() => setVistaActual('login')}
            onGoToLogin={() => setVistaActual('login')}
          />
        );
      case 'login':
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setVistaActual('registro')}
          />
        );
      case 'checkout':
        return <CheckoutForm ventaActiva={ventaActiva} setVistaActual={setVistaActual}/>
      case 'cliente-dashboard':
      case 'mis-compras':
        return (
          <ClienteDashboard
            user={user}
            setVistaActual={setVistaActual}
            openCart={() => setIsCartOpen(true)}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard
            user={user}
            adminSubTab={adminSubTab}
            setAdminSubTab={setAdminSubTab}
          />
        );
      default:
        return <Catalogo setVistaActual={setVistaActual} usuario={user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
      <Navbar
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        user={user}
        onLogout={handleLogout}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
      />
      <main className="flex-grow pb-12">{vistaContenido()}</main>

      <Cart
      isOpen = {isCartOpen}
      onClose = {()=>setIsCartOpen(false)}
      cart = {cart}
      updateQuantity = {updateQuantity}
      removeFromCart = {removeFromCart}
      clearCart = {clearCart}
      setVistaActual = {setVistaActual}
      setVentaActiva = {setVentaActiva}
      />

      <Footer />
    </div>
  );
}

export default App;