package com.jjtm.tiendita.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jjtm.tiendita.modelo.ProductoEntity;
import com.jjtm.tiendita.repository.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository repository;

    //Leer todos los productos
    @Transactional (readOnly = true)
    public List<ProductoEntity> obtenerTodos(){
        return repository.findAll();
    }

    //Leer un producto por id
    @Transactional (readOnly = true)
    public ProductoEntity obtenerPorId(Long id){
        return repository.findById(id).orElseThrow(
            () -> new RuntimeException("Producto no encontrado" + id));
    }

    //Guardar un producto
    @Transactional
    public ProductoEntity guardarProducto(ProductoEntity producto){
        return repository.save(producto);
    }

    //Eliminar un producto
    @Transactional
    public void eliminarProducto(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Producto no encontrado" + id);
        }
        repository.deleteById(id);
    }

    //Actualizar un producto
    @Transactional
    public ProductoEntity actualizarProducto(Long id, ProductoEntity detalleProductoEntity){
        ProductoEntity productoExistente = repository.findById(id).
        orElseThrow(() -> new RuntimeException("El Producto" + id + "no existe !"));
        BeanUtils.copyProperties(detalleProductoEntity, productoExistente, "id");
        return repository.save(productoExistente);
    }

}