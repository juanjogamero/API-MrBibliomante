package com.mrbibliomante.controller;

import java.net.URI;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.mrbibliomante.entity.Prestamo;
import com.mrbibliomante.service.PrestamoService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/prestamo")
@Tag(name = "Prestamos", description = "Prestamos, devoluciones y vencimientos")
public class PrestamoController {
    private final PrestamoService prestamoService;
    public PrestamoController(PrestamoService prestamoService) { this.prestamoService = prestamoService; }

    @GetMapping
    public List<Prestamo> findAll() { return prestamoService.findAll(); }

    @GetMapping("/vencidos")
    public List<Prestamo> vencidos() { return prestamoService.vencidos(); }

    @GetMapping("/{id}")
    public Prestamo findById(@PathVariable int id) {
        return prestamoService.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestamo no encontrado"));
    }

    @GetMapping("/usuario/{idUser}")
    public List<Prestamo> findAllByUser(@PathVariable int idUser) {
        return prestamoService.findAllByUser(idUser);
    }

    @PostMapping("/{idLibro}")
    public ResponseEntity<Prestamo> save(@PathVariable int idLibro, @RequestBody Prestamo prestamo) {
        Prestamo guardado = prestamoService.save(prestamo, idLibro);
        return ResponseEntity.created(URI.create("/prestamo/" + guardado.getId())).body(guardado);
    }

    @PutMapping("/finish/{idPrestamo}")
    public Prestamo finishPrestamo(@PathVariable int idPrestamo) {
        return prestamoService.finishPrestamo(idPrestamo);
    }

    @PutMapping("/mature/{idPrestamo}")
    public Prestamo maturedPrestamo(@PathVariable int idPrestamo) {
        return prestamoService.maturedPrestamo(idPrestamo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        prestamoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

