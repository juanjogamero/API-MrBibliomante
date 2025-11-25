package com.mrbibliomante.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mrbibliomante.entity.Bibliotecario;
import com.mrbibliomante.service.BibliotecarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/bibliotecario")
@Tag(name = "Bibliotecarios", description = "Controlador para la gestión de bibliotecarios")
public class BibliotecarioController {

    @Autowired
    private BibliotecarioService bibliotecarioService;

    @GetMapping
    @Operation(summary = "Obtener todos los bibliotecarios", description = "Devuelve una lista completa de todos los bibliotecarios registrados en el sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de bibliotecarios obtenida correctamente")
    })
    public ResponseEntity<List<Bibliotecario>> findAll() {
        return ResponseEntity.ok(bibliotecarioService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar bibliotecario por ID", description = "Busca un bibliotecario específico utilizando su ID.")
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "200", description = "Bibliotecario encontrado"),
            @ApiResponse(responseCode = "400", description = "Bibliotecario no encontrado")
    })
    public ResponseEntity<Bibliotecario> findById(@PathVariable int id) {
        Optional<Bibliotecario> oBibliotecario = bibliotecarioService.findById(id);
        return oBibliotecario.map(ResponseEntity::ok)
                             .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo bibliotecario", description = "Registra un nuevo bibliotecario en la base de datos.")
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "200", description = "Bibliotecario creado correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor al crear el bibliotecario") 
    })
    public ResponseEntity<String> save(@RequestBody Bibliotecario bibliotecario) {
        bibliotecarioService.save(bibliotecario);
        return ResponseEntity.status(HttpStatus.OK).body("Bibliotecario creado correctamente");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un bibliotecario", description = "Actualiza la información de un bibliotecario existente según su ID.")
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "200", description = "Bibliotecario actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Bibliotecario no encontrado o datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor al actualizar el bibliotecario") 
    })
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody Bibliotecario bibliotecario) {
        if (bibliotecarioService.update(id, bibliotecario) == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bibliotecario no encontrado");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("Bibliotecario actualizado correctamente");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un bibliotecario", description = "Elimina un bibliotecario existente de la base de datos utilizando su ID.")
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "200", description = "Bibliotecario eliminado correctamente"),
            @ApiResponse(responseCode = "400", description = "Bibliotecario no encontrado") 
    })
    public ResponseEntity<String> delete(@PathVariable int id) {
        Optional<Bibliotecario> oBibliotecario = bibliotecarioService.findById(id);
        if (oBibliotecario.isPresent()) {
            bibliotecarioService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Bibliotecario eliminado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bibliotecario no encontrado");
        }
    }
}