package com.jjtm.tiendita.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jjtm.tiendita.modelo.ClientesEntity;
import com.jjtm.tiendita.modelo.DetalleVentaEntity;
import com.jjtm.tiendita.modelo.ProductoEntity;
import com.jjtm.tiendita.modelo.UsuarioEntity;
import com.jjtm.tiendita.modelo.VentaEntity;
import com.jjtm.tiendita.repository.ClientesRepository;
import com.jjtm.tiendita.repository.ProductoRepository;
import com.jjtm.tiendita.repository.UsuarioRepository;
import com.jjtm.tiendita.repository.VentaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final ClientesRepository clientesRepository;
    private final UsuarioRepository usuarioRepository;

    //Metodo para procesar venta
    @Transactional
    public VentaEntity procesarVenta(VentaEntity ventaRequest, String email){
        ClientesEntity cliente = clientesRepository.findFirstByEmail(email)
            .orElseGet(() -> crearClienteDesdeUsuario(email));

        ventaRequest.setCliente(cliente);
        ventaRequest.setFecha(LocalDateTime.now());
        ventaRequest.setEstadoPago("PENDIENTE");

        double total = 0.0;
        for(DetalleVentaEntity detalle: ventaRequest.getDetalles()){
            ProductoEntity producto =
            productoRepository.findById(detalle.getProducto().getId())
            .orElseThrow(() -> new RuntimeException("Producto no existe"));

            if (producto.getStock() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente del producto: " + producto.getNombre());
            }

            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(detalle.getCantidad() * detalle.getPrecioUnitario());
            detalle.setVenta(ventaRequest);

            total += detalle.getSubtotal();
        }
        ventaRequest.setTotal(total);
        return ventaRepository.save(ventaRequest);

    }

    private ClientesEntity crearClienteDesdeUsuario(String email) {
        UsuarioEntity usuario = usuarioRepository.findByUsername(email)
            .orElseThrow(() -> new RuntimeException(
                "Usuario no encontrado: " + email + ". Inicia sesión de nuevo."));

        return clientesRepository.findFirstByEmail(email).orElseGet(() -> {
            ClientesEntity cliente = new ClientesEntity();
            cliente.setNombre(usuario.getNombre());
            cliente.setEmail(usuario.getUsername());
            cliente.setDireccion(usuario.getDireccion());
            cliente.setTelefono(usuario.getTelefono());
            return clientesRepository.save(cliente);
        });
    }

    //Metodo para procesar pago
    @Transactional
    public VentaEntity confirmarPago(Long idVenta){
        VentaEntity venta = ventaRepository.findById(idVenta)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + idVenta));

        if (!"PAGADO".equalsIgnoreCase(venta.getEstadoPago())) {
            for (DetalleVentaEntity detalle : venta.getDetalles()) {
                ProductoEntity producto = productoRepository.findById(detalle.getProducto().getId())
                        .orElseThrow(() -> new RuntimeException("Producto no existe: " + detalle.getProducto().getId()));

                if (producto.getStock() < detalle.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre() +
                        ". Disponible: " + producto.getStock() + ", Requerido: " + detalle.getCantidad());
                }
                producto.setStock(producto.getStock() - detalle.getCantidad());
                productoRepository.save(producto);
            }
            venta.setEstadoPago("PAGADO");
        }
        return ventaRepository.save(venta);
    }

    @Transactional(readOnly = true)
    public List<VentaEntity> obtenerTodos() {
        return ventaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public VentaEntity obtenerPorId(Long id) {
        return ventaRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Venta no encontrada " + id));
    }

    @Transactional
    public VentaEntity guardarVenta(VentaEntity venta) {
        return ventaRepository.save(venta);
    }

    @Transactional
    public void eliminarVenta(Long id) {
        VentaEntity venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada " + id));

        if ("PAGADO".equalsIgnoreCase(venta.getEstadoPago())) {
            for (DetalleVentaEntity detalle : venta.getDetalles()) {
                if (detalle.getProducto() != null) {
                    ProductoEntity producto = productoRepository.findById(detalle.getProducto().getId()).orElse(null);
                    if (producto != null) {
                        producto.setStock(producto.getStock() + detalle.getCantidad());
                        productoRepository.save(producto);
                    }
                }
            }
        }
        ventaRepository.delete(venta);
    }

    @Transactional
    public VentaEntity actualizarVenta(Long id, VentaEntity detalleVentaEntity) {
        VentaEntity ventaExistente = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no existe " + id));
        BeanUtils.copyProperties(detalleVentaEntity, ventaExistente, "id");
        return ventaRepository.save(ventaExistente);
    }

    @Transactional
    public List<VentaEntity> obtenerVentasPorCliente(String email){
        return ventaRepository.findAllByClienteEmail(email);
    }
}

