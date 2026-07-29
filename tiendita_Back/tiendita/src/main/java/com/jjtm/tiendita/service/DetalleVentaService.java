package com.jjtm.tiendita.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jjtm.tiendita.modelo.DetalleVentaEntity;
import com.jjtm.tiendita.repository.DetalleVentaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DetalleVentaService {

    private final DetalleVentaRepository repository;

    @Transactional(readOnly = true)
    public List<DetalleVentaEntity> obtenerTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public DetalleVentaEntity obtenerPorId(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new RuntimeException("Detalle de venta no encontrado " + id));
    }

    @Transactional
    public DetalleVentaEntity guardarDetalleVenta(DetalleVentaEntity detalleVenta) {
        return repository.save(detalleVenta);
    }

    @Transactional
    public void eliminarDetalleVenta(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Detalle de venta no encontrado " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public DetalleVentaEntity actualizarDetalleVenta(Long id, DetalleVentaEntity detalleVentaEntity) {
        DetalleVentaEntity detalleExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle de venta no existe " + id));
        BeanUtils.copyProperties(detalleVentaEntity, detalleExistente, "id");
        return repository.save(detalleExistente);
    }
}

