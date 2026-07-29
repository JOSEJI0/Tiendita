package com.jjtm.tiendita.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jjtm.tiendita.dto.RegistroRequest;
import com.jjtm.tiendita.modelo.ClientesEntity;
import com.jjtm.tiendita.modelo.Rol;
import com.jjtm.tiendita.modelo.UsuarioEntity;
import com.jjtm.tiendita.repository.ClientesRepository;
import com.jjtm.tiendita.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final ClientesRepository clientesRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
        ClientesRepository clientesRepository, PasswordEncoder passwordEncoder){
        this.usuarioRepository = usuarioRepository;
        this.clientesRepository = clientesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioEntity saveUsuario(RegistroRequest request){
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("El nombre del usuario ya está en uso.");
        }

        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setNombre(request.getNombre());
        usuario.setDireccion(request.getDireccion());
        usuario.setTelefono(request.getTelefono());

        Rol rol = Rol.ROLE_CLIENTE;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_ADMIN")) {
            rol = Rol.ROLE_ADMIN;
        }
        usuario.setRole(rol);
        UsuarioEntity savedUusuario = usuarioRepository.save(usuario);

        if (rol == Rol.ROLE_CLIENTE) {
            ClientesEntity cliente = new ClientesEntity();
            cliente.setNombre(request.getNombre());
            cliente.setEmail(request.getUsername());
            cliente.setDireccion(request.getDireccion());
            cliente.setTelefono(request.getTelefono());
            clientesRepository.save(cliente);
        }

        return savedUusuario;
    }
}
