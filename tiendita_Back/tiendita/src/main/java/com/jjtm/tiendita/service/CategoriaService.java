package com.jjtm.tiendita.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jjtm.tiendita.modelo.CategoriaEntity;
import com.jjtm.tiendita.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    @Transactional(readOnly = true)
    public List<CategoriaEntity> obtenerTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public CategoriaEntity obtenerPorId(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new RuntimeException("Categoría no encontrada " + id));
    }

    @Transactional
    public CategoriaEntity guardarCategoria(CategoriaEntity categoria) {
        return repository.save(categoria);
    }

    @Transactional
    public void eliminarCategoria(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public CategoriaEntity actualizarCategoria(Long id, CategoriaEntity detalleCategoriaEntity) {
        CategoriaEntity categoriaExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no existe " + id));
        BeanUtils.copyProperties(detalleCategoriaEntity, categoriaExistente, "id");
        return repository.save(categoriaExistente);
    }
}

