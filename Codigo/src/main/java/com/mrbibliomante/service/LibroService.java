package com.mrbibliomante.service;

import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.mrbibliomante.entity.Libro;
import com.mrbibliomante.entity.TipoEstado;
import com.mrbibliomante.repository.LibroRepository;
import com.mrbibliomante.repository.PrestamoRepository;

@Service
public class LibroService {
    private static final EnumSet<TipoEstado> OCUPADOS = EnumSet.of(TipoEstado.ACTIVO, TipoEstado.VENCIDO);
    private final LibroRepository libroRepository;
    private final PrestamoRepository prestamoRepository;

    public LibroService(LibroRepository libroRepository, PrestamoRepository prestamoRepository) {
        this.libroRepository = libroRepository;
        this.prestamoRepository = prestamoRepository;
    }

    public Optional<Libro> findById(int id) { return libroRepository.findById(id); }
    public List<Libro> findAll() { return libroRepository.findAll(); }

    public List<Libro> buscar(String texto) {
        if (texto == null || texto.isBlank()) return findAll();
        String filtro = texto.trim();
        return libroRepository.findByTituloLibroContainingIgnoreCaseOrAutorContainingIgnoreCase(filtro, filtro);
    }

    public Libro save(Libro libro) {
        libro.setId(0);
        libro.setVersion(0);
        return libroRepository.save(libro);
    }

    @Transactional
    public Libro update(int id, Libro libro) {
        Libro actual = libroRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado"));
        int ocupados = prestamoRepository.countByLibroIdAndTipoEstadoIn(id, OCUPADOS);
        if (libro.getNumEjemplar() < ocupados) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede reducir el stock por debajo de los prestamos pendientes");
        }
        actual.setTituloLibro(libro.getTituloLibro());
        actual.setAutor(libro.getAutor());
        actual.setGenero(libro.getGenero());
        actual.setIdioma(libro.getIdioma());
        actual.setISBN(libro.getISBN());
        actual.setImagen(libro.getImagen());
        actual.setNumEjemplar(libro.getNumEjemplar());
        return libroRepository.save(actual);
    }

    @Transactional
    public void delete(int id) {
        Libro actual = libroRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado"));
        if (prestamoRepository.existsByLibroId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede eliminar un libro con historial de prestamos");
        }
        libroRepository.delete(actual);
    }

    public int ejemplaresOcupados(int id) {
        return prestamoRepository.countByLibroIdAndTipoEstadoIn(id, OCUPADOS);
    }
}
