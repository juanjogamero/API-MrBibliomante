package com.mrbibliomante.controller;

import java.net.URI;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import com.mrbibliomante.entity.Evento;
import com.mrbibliomante.service.EventoService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/evento")
@Tag(name = "Eventos", description = "Eventos culturales e inscripciones")
public class EventoController {
    private final EventoService eventoService;
    public EventoController(EventoService eventoService) { this.eventoService = eventoService; }

    @GetMapping
    public List<Evento> findAll() { return eventoService.findAll(); }

    @GetMapping("/{id}")
    public Evento findById(@PathVariable int id) {
        return eventoService.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));
    }

    @GetMapping("/{id}/disponibilidad")
    public Disponibilidad disponibilidad(@PathVariable int id) {
        Evento evento = findById(id);
        int inscritos = eventoService.numUsuariosByEvento(id);
        return new Disponibilidad(id, evento.getAforo(), inscritos,
                                 Math.max(0, evento.getAforo() - inscritos));
    }
    public record Disponibilidad(int eventoId, int aforo, int inscritos, int plazasLibres) {}

    @PostMapping
    public ResponseEntity<Evento> save(@Valid @RequestBody Evento evento) {
        Evento guardado = eventoService.save(evento);
        return ResponseEntity.created(URI.create("/evento/" + guardado.getId())).body(guardado);
    }

    @PutMapping("/{id}")
    public Evento update(@PathVariable int id, @Valid @RequestBody Evento evento) {
        return eventoService.update(id, evento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        eventoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Se identifica expresamente al usuario hasta disponer de un sistema de autenticacion.
    @PostMapping("/{id}/usuarios/{idUsuario}")
    public ResponseEntity<Void> subscribeEvento(@PathVariable int id, @PathVariable int idUsuario) {
        eventoService.subscribeEvento(id, idUsuario);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/usuarios/{idUsuario}")
    public ResponseEntity<Void> unSubscribeEvento(@PathVariable int id, @PathVariable int idUsuario) {
        eventoService.unSubscribeEvento(id, idUsuario);
        return ResponseEntity.noContent().build();
    }
}

