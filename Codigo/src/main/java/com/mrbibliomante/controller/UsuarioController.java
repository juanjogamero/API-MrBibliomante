package com.mrbibliomante.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mrbibliomante.entity.Usuario;
import com.mrbibliomante.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Usuarios", description = "Controlador para la gestión de usuarios")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	@GetMapping
	@Operation(summary = "Obtener todos los usuarios", description = "Devuelve una lista completa de todos los usuarios registrados en el sistema.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente") 
	})
	public ResponseEntity<List<Usuario>> findAll() {
		return ResponseEntity.ok(usuarioService.findAll());
	}

	@GetMapping("/{id}")
	@Operation(summary = "Buscar usuario por ID", description = "Busca un usuario específico utilizando su ID.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Usuario encontrado"),
			@ApiResponse(responseCode = "400", description = "Usuario no encontrado")
	})
	public ResponseEntity<Usuario> findById(@PathVariable int id) {
		Optional<Usuario> oUsuario = usuarioService.findById(id);
		return oUsuario.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null));
	}

	@PostMapping
	@Operation(summary = "Crear un nuevo usuario", description = "Registra un nuevo usuario en la base de datos.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Usuario creado correctamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor al crear el usuario") 
	})
	public ResponseEntity<String> save(@RequestBody Usuario usuario) {
		usuarioService.save(usuario);
		return ResponseEntity.status(HttpStatus.OK).body("Usuario creado correctamente");
	}

	@PutMapping("/{id}")
	@Operation(summary = "Actualizar un usuario", description = "Actualiza la información de un usuario existente según su ID.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente"),
			@ApiResponse(responseCode = "400", description = "Usuario no encontrado o datos inválidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor al actualizar el usuario") 
	})
	public ResponseEntity<String> update(@PathVariable int id, @RequestBody Usuario usuario) {
		if (usuarioService.update(id, usuario) == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario no encontrado");
		} else {
			return ResponseEntity.status(HttpStatus.OK).body("Usuario actualizado correctamente");
		}
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un usuario", description = "Elimina un usuario existente de la base de datos utilizando su ID.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Usuario eliminado correctamente"),
			@ApiResponse(responseCode = "400", description = "Usuario no encontrado") 
	})
	public ResponseEntity<String> delete(@PathVariable int id) {
		Optional<Usuario> oUsuario = usuarioService.findById(id);
		if (oUsuario.isPresent()) {
			usuarioService.delete(id);
			return ResponseEntity.status(HttpStatus.OK).body("Usuario eliminado correctamente");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario no encontrado");
		}
	}
}
