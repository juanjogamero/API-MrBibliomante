package com.mrbibliomante.service;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.mrbibliomante.entity.Usuario;
import com.mrbibliomante.repository.PrestamoRepository;
import com.mrbibliomante.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PrestamoRepository prestamoRepository;
    public UsuarioService(UsuarioRepository usuarioRepository, PrestamoRepository prestamoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.prestamoRepository = prestamoRepository;
    }

    public Optional<Usuario> findById(int id) { return usuarioRepository.findById(id); }
    public List<Usuario> findAll() { return usuarioRepository.findAll(); }

    public Usuario save(Usuario usuario) {
        usuario.setId(0);
        usuario.setVersion(0);
        usuario.setListEvent(new java.util.ArrayList<>());
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario update(int id, Usuario datos) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        usuario.setNombre(datos.getNombre());
        usuario.setPrimerApellido(datos.getPrimerApellido());
        usuario.setSegundoApellido(datos.getSegundoApellido());
        usuario.setMail(datos.getMail());
        usuario.setFoto(datos.getFoto());
        usuario.setTelefono(datos.getTelefono());
        usuario.setdPostal(datos.getdPostal());
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void delete(int id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (!prestamoRepository.findByUsuarioId(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario tiene historial de prestamos");
        }
        if (usuario.getListEvent() != null && !usuario.getListEvent().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario tiene inscripciones activas");
        }
        usuarioRepository.delete(usuario);
    }
}

