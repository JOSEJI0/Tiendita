package com.jjtm.tiendita.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jjtm.tiendita.modelo.ProveedorEntity;
import com.jjtm.tiendita.repository.ProveedorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProveedorService {

    private final ProveedorRepository repository;

    @Transactional(readOnly = true)
    public List<ProveedorEntity> obtenerTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public ProveedorEntity obtenerPorId(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new RuntimeException("Proveedor no encontrado " + id));
    }

    @Transactional
    public ProveedorEntity guardarProveedor(ProveedorEntity proveedor) {
        return repository.save(proveedor);
    }

    @Transactional
    public void eliminarProveedor(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Proveedor no encontrado " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public ProveedorEntity actualizarProveedor(Long id, ProveedorEntity detalleProveedorEntity) {
        ProveedorEntity proveedorExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no existe " + id));
        BeanUtils.copyProperties(detalleProveedorEntity, proveedorExistente, "id");
        return repository.save(proveedorExistente);
    }
}

