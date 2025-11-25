package com.mrbibliomante.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrbibliomante.entity.Evento;
import com.mrbibliomante.service.EventoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/evento")
@Tag(name = "Eventos", description = "Controlador para la gestión de eventos")
public class EventoController {

	@Autowired
	private EventoService eventoService;

	@GetMapping
	@Operation(summary = "Obtener todos los eventos", description = "Devuelve una lista completa de todos los eventos registrados en el sistema.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de eventos obtenida correctamente") })
	public ResponseEntity<List<Evento>> findAll() {
		return ResponseEntity.ok(eventoService.findAll());
	}

	@GetMapping("/{idEvento}")
	@Operation(summary = "Buscar evento por ID", description = "Busca un evento específico utilizando su ID.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Evento encontrado"),
			@ApiResponse(responseCode = "400", description = "Evento no encontrado")
	})
	public ResponseEntity<Evento> findById(@PathVariable int idEvento) {
		Optional<Evento> oEvento = eventoService.findById(idEvento);
		if (oEvento.isPresent()) {
			return ResponseEntity.ok(oEvento.get());
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	@PostMapping
	@Operation(summary = "Crear un nuevo evento", description = "Registra un nuevo evento en la base de datos.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Evento creado correctamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor al crear el evento") 
	})
	public void save(@RequestBody Evento e, HttpServletResponse response) throws IOException {
		eventoService.save(e);
		response.setStatus(200);
		response.getWriter().println("Evento creado correctamente");
	}

	@PutMapping("/{id}")
	@Operation(summary = "Actualizar un evento", description = "Actualiza la información de un evento existente según su ID.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Evento actualizado correctamente"),
		    @ApiResponse(responseCode = "400", description = "Evento no encontrado o no se puede modificar"),
		    @ApiResponse(responseCode = "409", description = "Evento no se puede modificar al contar con usuarios inscriptos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor al actualizar el evento") 
	})
	public void update(@PathVariable int id, @RequestBody Evento e, HttpServletResponse response) throws IOException {
		int inscritos = eventoService.numUsuariosByEvento(id);
		if (inscritos > 0) {
			response.setStatus(409);
			response.getWriter().println("No se puede modificar el evento, ya hay usuarios inscritos");
		} else {
			if (eventoService.update(id, e) == null) {
				response.setStatus(400);
				response.getWriter().println("Evento no encontrado");
			} else {
				response.setStatus(200);
				response.getWriter().println("Evento actualizado correctamente");
			}
		}

	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un evento", description = "Elimina un evento existente de la base de datos utilizando su ID.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Evento eliminado con éxito"),
			@ApiResponse(responseCode = "400", description = "Evento no encontrado") 
	})
	public void delete(@PathVariable int id, HttpServletResponse response) throws IOException {
		Optional<Evento> oEvento = eventoService.findById(id);
		if (oEvento.isPresent()) {
			eventoService.delete(id);
			response.setStatus(200);
			response.getWriter().println("Evento borrado con éxito");
		} else {
			response.setStatus(400);
			response.getWriter().println("Evento no encontrado");
		}
	}

	@GetMapping("/subscribe/{id}")
	@Operation(summary = "Suscribirse a un evento", description = "Permite al usuario logueado suscribirse a un evento si hay disponibilidad.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Usuario suscrito correctamente"),
			@ApiResponse(responseCode = "400", description = "Evento lleno o no encontrado") 
	})
	public ResponseEntity<String> subscribeEvento(@PathVariable int id) {
		boolean resultado = eventoService.subscribeEvento(id);
		if (resultado) {
			return ResponseEntity.ok("Usuario suscrito correctamente");
		} else {
			return ResponseEntity.badRequest().body("Evento lleno o no encontrado");
		}
	}

	@GetMapping("/unsubscribe/{id}")
	@Operation(summary = "Cancelar suscripción a un evento", description = "Permite al usuario logueado cancelar su suscripción a un evento.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Usuario desuscrito correctamente"),
			@ApiResponse(responseCode = "400", description = "Evento no encontrado o usuario no está inscrito")
	})
	public ResponseEntity<String> unSubscribeEvento(@PathVariable int id) {
		boolean resultado = eventoService.unSubscribeEvento(id);
		if (resultado) {
			return ResponseEntity.ok("Usuario desuscrito correctamente");
		} else {
			return ResponseEntity.badRequest().body("Evento no encontrado o usuario no está inscrito");
		}
	}
}