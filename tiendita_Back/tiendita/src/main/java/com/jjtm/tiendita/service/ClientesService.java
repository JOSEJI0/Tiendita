package com.jjtm.tiendita.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jjtm.tiendita.modelo.ClientesEntity;
import com.jjtm.tiendita.repository.ClientesRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientesService {

    private final ClientesRepository repository;
    //Leer todos los clientes
    @Transactional (readOnly = true)
    public List<ClientesEntity> obtenerTodos(){
        return repository.findAll();
    }

    //Leer un cliente por id
    @Transactional (readOnly = true)
    public ClientesEntity obtenerPorId(Long id){
        return repository.findById(id).orElseThrow(
            () -> new RuntimeException("Cliente no encontrado" + id));
        }

    //Guardar un cliente
    @Transactional
    public ClientesEntity guardarCliente(ClientesEntity cliente){
        return repository.save(cliente);
    }

    //Eliminar un cliente
    @Transactional
    public void eliminarCliente(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Cliente no encontrado" + id);
        }
        repository.deleteById(id);
    }

    //Actualizar un cliente
    @Transactional
    public ClientesEntity actualizarCliente(Long id, ClientesEntity detalleClienteEntity){
        ClientesEntity clienteExistente = repository.findById(id).
        orElseThrow(() -> new RuntimeException("Cliente no existe !" + id));
        BeanUtils.copyProperties(detalleClienteEntity, clienteExistente, "id");
        return repository.save(clienteExistente);
    }

}