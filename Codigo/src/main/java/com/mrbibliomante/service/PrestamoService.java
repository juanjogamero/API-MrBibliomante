package com.mrbibliomante.service;

import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.mrbibliomante.entity.Libro;
import com.mrbibliomante.entity.Prestamo;
import com.mrbibliomante.entity.TipoEstado;
import com.mrbibliomante.entity.Usuario;
import com.mrbibliomante.repository.LibroRepository;
import com.mrbibliomante.repository.PrestamoRepository;

@Service
public class PrestamoService {
    private static final EnumSet<TipoEstado> OCUPADOS = EnumSet.of(TipoEstado.ACTIVO, TipoEstado.VENCIDO);
    private final PrestamoRepository prestamoRepository;
    private final LibroRepository libroRepository;
    private final UsuarioService usuarioService;

    public PrestamoService(PrestamoRepository prestamoRepository, LibroRepository libroRepository,
                           UsuarioService usuarioService) {
        this.prestamoRepository = prestamoRepository;
        this.libroRepository = libroRepository;
        this.usuarioService = usuarioService;
    }

    public Optional<Prestamo> findById(int id) { return prestamoRepository.findById(id); }
    public List<Prestamo> findAll() { return prestamoRepository.findAll(); }
    public List<Prestamo> vencidos() { return prestamoRepository.findByTipoEstado(TipoEstado.VENCIDO); }

    @Transactional
    public Prestamo save(Prestamo solicitud, int idLibro) {
        if (solicitud.getUsuario() == null || solicitud.getUsuario().getId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Indica el ID del usuario");
        }
        if (solicitud.getFechaFin() == null || !solicitud.getFechaFin().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de devolucion debe ser futura");
        }
        // El bloqueo evita que dos prestamos simultaneos consuman el ultimo ejemplar.
        Libro libro = libroRepository.findByIdForUpdate(idLibro)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado"));
        Usuario usuario = usuarioService.findById(solicitud.getUsuario().getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        int ocupados = prestamoRepository.countByLibroIdAndTipoEstadoIn(idLibro, OCUPADOS);
        if (ocupados >= libro.getNumEjemplar()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No quedan ejemplares disponibles");
        }

        Prestamo prestamo = new Prestamo();
        prestamo.setLibro(libro);
        prestamo.setUsuario(usuario);
        prestamo.setFechaInicio(LocalDate.now());
        prestamo.setFechaFin(solicitud.getFechaFin());
        prestamo.setTipoEstado(TipoEstado.ACTIVO);
        return prestamoRepository.save(prestamo);
    }

    @Transactional
    public Prestamo finishPrestamo(int idPrestamo) {
        Prestamo prestamo = prestamoRepository.findByIdForUpdate(idPrestamo)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestamo no encontrado"));
        if (prestamo.getTipoEstado() == TipoEstado.DEVUELTO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El prestamo ya fue devuelto");
        }
        prestamo.setTipoEstado(TipoEstado.DEVUELTO);
        return prestamoRepository.save(prestamo);
    }

    @Transactional
    public Prestamo maturedPrestamo(int idPrestamo) {
        Prestamo prestamo = prestamoRepository.findByIdForUpdate(idPrestamo)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestamo no encontrado"));
        if (prestamo.getTipoEstado() != TipoEstado.ACTIVO ||
            prestamo.getFechaFin() == null || !prestamo.getFechaFin().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solo se pueden vencer prestamos activos fuera de plazo");
        }
        prestamo.setTipoEstado(TipoEstado.VENCIDO);
        return prestamoRepository.save(prestamo);
    }

    @Scheduled(fixedDelayString = "${bibliomante.prestamos.comprobacion-ms:3600000}")
    @Transactional
    public void actualizarVencidos() {
        prestamoRepository.marcarVencidos(LocalDate.now(), TipoEstado.ACTIVO, TipoEstado.VENCIDO);
    }

    public List<Prestamo> findAllByUser(int idUser) {
        if (usuarioService.findById(idUser).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        return prestamoRepository.findByUsuarioId(idUser);
    }

    public int numPrestamoOfLibroByNombreAndEstado(int idLibro, TipoEstado estado) {
        return prestamoRepository.countByLibroIdAndTipoEstadoIn(idLibro, List.of(estado));
    }

    @Transactional
    public void delete(int id) {
        Prestamo prestamo = prestamoRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestamo no encontrado"));
        // Conservar el historial: la API permite devolver, pero no borrar movimientos.
        throw new ResponseStatusException(HttpStatus.CONFLICT, "El historial no se elimina; utiliza la devolucion");
    }
}
