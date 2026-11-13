package com.mrbibliomante.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.mrbibliomante.entity.Evento;
import com.mrbibliomante.entity.Usuario;
import com.mrbibliomante.repository.EventoRepository;
import com.mrbibliomante.repository.UsuarioRepository;

@Service
public class EventoService {
    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;

    public EventoService(EventoRepository eventoRepository, UsuarioRepository usuarioRepository) {
        this.eventoRepository = eventoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Evento> findById(int id) { return eventoRepository.findById(id); }
    public List<Evento> findAll() { return eventoRepository.findAll(); }
    public Evento save(Evento evento) {
        evento.setId(0);
        evento.setVersion(0);
        return eventoRepository.save(evento);
    }

    @Transactional
    public Evento update(int id, Evento nuevosDatos) {
        Evento evento = eventoRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));
        if (numUsuariosByEvento(id) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede editar un evento con inscritos");
        }
        evento.setTitulo(nuevosDatos.getTitulo());
        evento.setDescripcion(nuevosDatos.getDescripcion());
        evento.setAforo(nuevosDatos.getAforo());
        evento.setFechaHora(nuevosDatos.getFechaHora());
        return eventoRepository.save(evento);
    }

    @Transactional
    public void subscribeEvento(int idEvento, int idUsuario) {
        Evento evento = eventoRepository.findByIdForUpdate(idEvento)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));
        Usuario usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (evento.getFechaHora() == null || !evento.getFechaHora().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El evento ya no admite inscripciones");
        }
        if (usuario.getListEvent() == null) usuario.setListEvent(new ArrayList<>());
        if (usuario.getListEvent().stream().anyMatch(e -> e.getId() == idEvento)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya esta inscrito");
        }
        if (numUsuariosByEvento(idEvento) >= evento.getAforo()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Aforo completo");
        }
        usuario.getListEvent().add(evento);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void unSubscribeEvento(int idEvento, int idUsuario) {
        eventoRepository.findByIdForUpdate(idEvento)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));
        Usuario usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (usuario.getListEvent() == null ||
            !usuario.getListEvent().removeIf(e -> e.getId() == idEvento)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario no esta inscrito");
        }
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void delete(int id) {
        Evento evento = eventoRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));
        if (numUsuariosByEvento(id) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede borrar un evento con inscritos");
        }
        eventoRepository.delete(evento);
    }

    public int numUsuariosByEvento(int idEvento) {
        return eventoRepository.numUsuariosByEvento(idEvento);
    }
}
