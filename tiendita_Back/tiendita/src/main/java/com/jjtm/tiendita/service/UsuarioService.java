package com.jjtm.tiendita.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jjtm.tiendita.dto.ChangePasswordRequest;
import com.jjtm.tiendita.dto.CreateAdminRequest;
import com.jjtm.tiendita.dto.RegistroRequest;
import com.jjtm.tiendita.dto.UpdateUsuarioRequest;
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

    public List<UsuarioEntity> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public UsuarioEntity obtenerUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id: " + id));
    }

    @Transactional
    public UsuarioEntity actualizarUsuario(Long id, UpdateUsuarioRequest request) {
        UsuarioEntity usuario = obtenerUsuario(id);
        if (request.getUsername() != null && !request.getUsername().equals(usuario.getUsername())) {
            if (usuarioRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
            }
            usuario.setUsername(request.getUsername());
        }
        if (request.getNombre() != null) usuario.setNombre(request.getNombre());
        if (request.getDireccion() != null) usuario.setDireccion(request.getDireccion());
        if (request.getTelefono() != null) usuario.setTelefono(request.getTelefono());
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void cambiarPassword(Long id, ChangePasswordRequest request) {
        UsuarioEntity usuario = obtenerUsuario(id);
        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual no es correcta.");
        }
        usuario.setPassword(passwordEncoder.encode(request.getNuevoPassword()));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        UsuarioEntity usuario = obtenerUsuario(id);
        usuarioRepository.delete(usuario);
    }

    @Transactional
    public UsuarioEntity crearAdmin(CreateAdminRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
        }
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setNombre(request.getNombre());
        usuario.setDireccion(request.getDireccion());
        usuario.setTelefono(request.getTelefono());
        usuario.setRole(Rol.ROLE_ADMIN);
        return usuarioRepository.save(usuario);
    }
}
