package com.mrbibliomante.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mrbibliomante.entity.Prestamo;
import com.mrbibliomante.service.PrestamoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/prestamo")
@Tag(name = "Préstamos", description = "Controlador para la gestión de préstamos de libros")
public class PrestamoController {

    @Autowired
    private PrestamoService prestamoService;

    @GetMapping
    @Operation(summary = "Obtener todos los préstamos", description = "Devuelve una lista completa de todos los préstamos registrados en el sistema.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de préstamos obtenida correctamente")
    })
    public ResponseEntity<List<Prestamo>> findAll() {
        return ResponseEntity.ok(prestamoService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar préstamo por ID", description = "Busca un préstamo específico utilizando su ID.")
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Préstamo encontrado"),
        @ApiResponse(responseCode = "400", description = "Préstamo no encontrado") 
    })
    public ResponseEntity<Prestamo> findById(@PathVariable int id) {
        Optional<Prestamo> oPrestamo = prestamoService.findById(id);
        return oPrestamo.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null));
    }

    @GetMapping("/usuario/{idUser}")
    @Operation(summary = "Obtener préstamos por usuario", description = "Devuelve la lista de préstamos de un usuario específico.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Préstamos del usuario obtenidos correctamente"),
        @ApiResponse(responseCode = "400", description = "Usuario no encontrado o sin préstamos")
    })
    public ResponseEntity<List<Prestamo>> findAllByUser(@PathVariable int idUser) {
        List<Prestamo> prestamos = prestamoService.findAllByUser(idUser);
        if (prestamos != null) {
            return ResponseEntity.ok(prestamos);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/{idLibro}")
    @Operation(summary = "Crear un nuevo préstamo", description = "Crea un nuevo préstamo para un libro específico.")
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Préstamo creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Libro no disponible o no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno al crear el préstamo") 
    })
    public ResponseEntity<String> save(@RequestBody Prestamo prestamo, @PathVariable int idLibro) {
        Prestamo p = prestamoService.save(prestamo, idLibro);
        if (p != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Préstamo creado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Libro no disponible o no encontrado");
        }
    }

    @PutMapping("/finish/{idPrestamo}")
    @Operation(summary = "Finalizar préstamo", description = "Marca un préstamo como devuelto.")
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Préstamo finalizado correctamente"),
        @ApiResponse(responseCode = "400", description = "Préstamo no encontrado") 
    })
    public ResponseEntity<String> finishPrestamo(@PathVariable int idPrestamo) {
        if (prestamoService.finishPrestamo(idPrestamo) != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Préstamo finalizado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Préstamo no encontrado");
        }
    }

    @PutMapping("/mature/{idPrestamo}")
    @Operation(summary = "Marcar préstamo como vencido", description = "Marca un préstamo como vencido (VENCIDO).")
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Préstamo marcado como vencido"),
        @ApiResponse(responseCode = "400", description = "Préstamo no encontrado") 
    })
    public ResponseEntity<String> maturedPrestamo(@PathVariable int idPrestamo) {
        if (prestamoService.maturedPrestamo(idPrestamo) != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Préstamo marcado como vencido");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Préstamo no encontrado");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un préstamo", description = "Elimina un préstamo de la base de datos utilizando su ID.")
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Préstamo eliminado correctamente"),
        @ApiResponse(responseCode = "400", description = "Préstamo no encontrado") 
    })
    public ResponseEntity<String> delete(@PathVariable int id) {
        Optional<Prestamo> oPrestamo = prestamoService.findById(id);
        if (oPrestamo.isPresent()) {
            prestamoService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Préstamo eliminado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Préstamo no encontrado");
        }
    }
}