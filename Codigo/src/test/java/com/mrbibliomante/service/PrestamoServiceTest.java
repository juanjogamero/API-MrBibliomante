package com.mrbibliomante.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.EnumSet;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.mrbibliomante.entity.Libro;
import com.mrbibliomante.entity.Prestamo;
import com.mrbibliomante.entity.TipoEstado;
import com.mrbibliomante.entity.Usuario;
import com.mrbibliomante.repository.LibroRepository;
import com.mrbibliomante.repository.PrestamoRepository;

@ExtendWith(MockitoExtension.class)
class PrestamoServiceTest {
    @Mock PrestamoRepository prestamos;
    @Mock LibroRepository libros;
    @Mock UsuarioService usuarios;
    PrestamoService service;

    @BeforeEach
    void setup() { service = new PrestamoService(prestamos, libros, usuarios); }

    private Prestamo solicitud() {
        Usuario usuario = new Usuario();
        usuario.setId(7);
        Prestamo p = new Prestamo();
        p.setUsuario(usuario);
        p.setFechaFin(LocalDate.now().plusDays(14));
        return p;
    }

    @Test
    void noPermitePrestarSiNoHayEjemplares() {
        Libro libro = new Libro();
        libro.setNumEjemplar(1);
        when(libros.findByIdForUpdate(4)).thenReturn(Optional.of(libro));
        when(usuarios.findById(7)).thenReturn(Optional.of(new Usuario()));
        when(prestamos.countByLibroIdAndTipoEstadoIn(eq(4), anyCollection())).thenReturn(1);

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
            () -> service.save(solicitud(), 4));
        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        verify(prestamos, never()).save(any());
    }

    @Test
    void rechazaFechaDeDevolucionPasada() {
        Prestamo p = solicitud();
        p.setFechaFin(LocalDate.now().minusDays(1));
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
            () -> service.save(p, 4));
        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        verifyNoInteractions(libros, prestamos);
    }

    @Test
    void alDevolverLiberaElEjemplar() {
        Prestamo p = solicitud();
        p.setTipoEstado(TipoEstado.ACTIVO);
        when(prestamos.findByIdForUpdate(9)).thenReturn(Optional.of(p));
        when(prestamos.save(p)).thenReturn(p);
        Prestamo devuelto = service.finishPrestamo(9);
        assertEquals(TipoEstado.DEVUELTO, devuelto.getTipoEstado());
    }

    @Test
    void noPermiteDevolverDosVeces() {
        Prestamo p = solicitud();
        p.setTipoEstado(TipoEstado.DEVUELTO);
        when(prestamos.findByIdForUpdate(9)).thenReturn(Optional.of(p));
        assertEquals(HttpStatus.CONFLICT,
            assertThrows(ResponseStatusException.class, () -> service.finishPrestamo(9)).getStatusCode());
    }
}

