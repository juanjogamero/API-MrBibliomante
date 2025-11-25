package com.mrbibliomante.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mrbibliomante.entity.Admin;
import com.mrbibliomante.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/admin")
@Tag(name = "Administradores", description = "Controlador para la gestión de administradores")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    @Operation(summary = "Obtener todos los administradores", description = "Devuelve una lista completa de todos los administradores registrados en el sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de administradores obtenida correctamente")
    })
    public ResponseEntity<List<Admin>> findAll() {
        return ResponseEntity.ok(adminService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar administrador por ID", description = "Busca un administrador específico utilizando su ID.")
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "200", description = "Administrador encontrado"),
            @ApiResponse(responseCode = "400", description = "Administrador no encontrado")
    })
    public ResponseEntity<Admin> findById(@PathVariable int id) {
        Optional<Admin> oAdmin = adminService.findById(id);
        return oAdmin.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo administrador", description = "Registra un nuevo administrador en la base de datos.")
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "200", description = "Administrador creado correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor al crear el administrador") 
    })
    public ResponseEntity<String> save(@RequestBody Admin admin) {
        adminService.save(admin);
        return ResponseEntity.status(HttpStatus.OK).body("Administrador creado correctamente");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un administrador", description = "Actualiza la información de un administrador existente según su ID.")
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "200", description = "Administrador actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Administrador no encontrado o datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor al actualizar el administrador") 
    })
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody Admin admin) {
        if (adminService.update(id, admin) == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Administrador no encontrado");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("Administrador actualizado correctamente");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un administrador", description = "Elimina un administrador existente de la base de datos utilizando su ID.")
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "200", description = "Administrador eliminado correctamente"),
            @ApiResponse(responseCode = "400", description = "Administrador no encontrado") 
    })
    public ResponseEntity<String> delete(@PathVariable int id) {
        Optional<Admin> oAdmin = adminService.findById(id);
        if (oAdmin.isPresent()) {
            adminService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Administrador eliminado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Administrador no encontrado");
        }
    }
}