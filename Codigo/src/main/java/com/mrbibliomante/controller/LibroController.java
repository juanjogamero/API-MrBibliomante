package com.mrbibliomante.controller;

import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.mrbibliomante.entity.Libro;
import com.mrbibliomante.service.LibroService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/libro")
@Validated
@Tag(name = "Libros", description = "Catalogo y disponibilidad de libros")
public class LibroController {
    private final LibroService libroService;
    public LibroController(LibroService libroService) { this.libroService = libroService; }

    @GetMapping
    public List<Libro> findAll(@RequestParam(required = false) String buscar) {
        return libroService.buscar(buscar);
    }

    @GetMapping("/{id}")
    public Libro findById(@PathVariable int id) {
        return libroService.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado"));
    }

    @GetMapping("/{id}/disponibilidad")
    public Disponibilidad disponibilidad(@PathVariable int id) {
        Libro libro = findById(id);
        int ocupados = libroService.ejemplaresOcupados(id);
        return new Disponibilidad(id, libro.getNumEjemplar(), ocupados,
                                  Math.max(0, libro.getNumEjemplar() - ocupados));
    }
    public record Disponibilidad(int libroId, int ejemplares, int ocupados, int disponibles) {}

    @PostMapping
    public ResponseEntity<Libro> save(@Valid @RequestBody Libro libro) {
        Libro guardado = libroService.save(libro);
        return ResponseEntity.created(URI.create("/libro/" + guardado.getId())).body(guardado);
    }

    @PutMapping("/{id}")
    public Libro update(@PathVariable int id, @Valid @RequestBody Libro libro) {
        return libroService.update(id, libro);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        libroService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

