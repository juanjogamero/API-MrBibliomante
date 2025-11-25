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

import com.mrbibliomante.entity.Libro;
import com.mrbibliomante.entity.TipoEstado;
import com.mrbibliomante.service.LibroService;
import com.mrbibliomante.service.PrestamoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/libro")
@Tag(name = "Libros", description = "Controlador para la gestión de libros")
public class LibroController {

	@Autowired
	private LibroService libroService;

	@Autowired
	private PrestamoService prestamoService;

	@GetMapping
	@Operation(summary = "Obtener todos los libros", description = "Devuelve una lista completa de todos los libros registrados en el sistema.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de libros obtenida correctamente") 
	})
	public ResponseEntity<List<Libro>> findAll() {
		return ResponseEntity.ok(libroService.findAll());
	}

	@GetMapping("/{id}")
	@Operation(summary = "Buscar libro por ID", description = "Busca un libro específico utilizando su ID.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Libro encontrado"),
			@ApiResponse(responseCode = "400", description = "Libro no encontrado", content = @Content) 
	})
	public ResponseEntity<Libro> findById(@PathVariable int id) {
		Optional<Libro> oLibro = libroService.findById(id);
		if (oLibro.isPresent()) {
			return ResponseEntity.ok(oLibro.get());
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	@PostMapping
	@Operation(summary = "Crear un nuevo libro", description = "Registra un nuevo libro en la base de datos.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Libro creado correctamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor al actualizar el libro")
	})
	public void save(@RequestBody Libro l, HttpServletResponse response) throws IOException {
		libroService.save(l);
		response.setStatus(200);
		response.getWriter().println("Libro creado correctamente");
	}

	@PutMapping("/{id}")
	@Operation(summary = "Actualizar un libro", description = "Actualiza la información de un libro existente según su ID.")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Libro actualizado correctamente"),
			@ApiResponse(responseCode = "400", description = "Libro no encontrado o datos inválidos"),
			@ApiResponse(responseCode = "409", description = "Conflicto al actualizar el libro, el número de ejemplares es menor que los préstamos activos o vencidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor al actualizar el libro") 
	})
	public void update(@PathVariable int id, @RequestBody Libro l, HttpServletResponse response) throws IOException {
		// Comprobamos si el libro tiene prestamos activos o vencidos
		int prestamosActivos = prestamoService.numPrestamoOfLibroByNombreAndEstado(id, TipoEstado.ACTIVO);
		int prestamosVencidos = prestamoService.numPrestamoOfLibroByNombreAndEstado(id, TipoEstado.VENCIDO);

		if (l.getNumEjemplar() >= prestamosActivos + prestamosVencidos) {
			if (libroService.update(id, l) == null) {
				response.setStatus(400);
				response.getWriter().println("Libro no encontrado");
			} else {
				response.setStatus(200);
				response.getWriter().println("Libro actualizado correctamente");
			}
		} else {
			response.setStatus(409);
			response.getWriter().println(
					"No se puede actualizar el número de ejemplares es menor que los préstamos activos o vencidos");
		}

	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un libro", description = "Elimina un libro existente de la base de datos utilizando su ID.")
	@ApiResponses(value = { 
		    @ApiResponse(responseCode = "200", description = "Libro eliminado con éxito"),
		    @ApiResponse(responseCode = "400", description = "Libro no encontrado"),
		    @ApiResponse(responseCode = "409", description = "Libro no se puede eliminar por tener préstamos activos o vencidos")
	})
	public void delete(@PathVariable int id, HttpServletResponse response) throws IOException {
		Optional<Libro> oLibro = libroService.findById(id);
		if (oLibro.isPresent()) {
			// Comprobamos si el libro tiene prestamos activos o vencidos
		    int prestamosActivos = prestamoService.numPrestamoOfLibroByNombreAndEstado(oLibro.get().getId(), TipoEstado.ACTIVO);
		    int prestamosVencidos = prestamoService.numPrestamoOfLibroByNombreAndEstado(oLibro.get().getId(), TipoEstado.VENCIDO);
		    
		    if (prestamosActivos > 0 || prestamosVencidos > 0) {
		        response.setStatus(409);
		        response.getWriter().println("No se puede eliminar el libro, tiene préstamos activos o vencidos.");
		    } else {
				libroService.delete(id);
		    	response.setStatus(200);
				response.getWriter().println("Libro borrado con éxito");
		    }
		} else {
			response.setStatus(400);
			response.getWriter().println("Libro no encontrado");
		}
	}
}
