package com.mrbibliomante.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.mrbibliomante.entity.Evento;
import com.mrbibliomante.entity.Usuario;
import com.mrbibliomante.repository.EventoRepository;
import com.mrbibliomante.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class EventoServiceTest {
    @Mock EventoRepository eventos;
    @Mock UsuarioRepository usuarios;
    EventoService service;

    @BeforeEach
    void setup() { service = new EventoService(eventos, usuarios); }

    @Test
    void inscripcionPersisteEnUsuario() {
        Evento evento = new Evento("Club de lectura", "Charla", 2, LocalDate.now().plusDays(7));
        evento.setId(1);
        Usuario usuario = new Usuario();
        usuario.setId(2);
        usuario.setListEvent(new ArrayList<>());
        when(eventos.findByIdForUpdate(1)).thenReturn(Optional.of(evento));
        when(usuarios.findById(2)).thenReturn(Optional.of(usuario));
        when(eventos.numUsuariosByEvento(1)).thenReturn(0);

        service.subscribeEvento(1, 2);

        assertEquals(1, usuario.getListEvent().size());
        verify(usuarios).save(usuario);
    }

    @Test
    void noAceptaEventoConAforoCompleto() {
        Evento evento = new Evento("Club de lectura", "Charla", 1, LocalDate.now().plusDays(7));
        Usuario usuario = new Usuario();
        when(eventos.findByIdForUpdate(1)).thenReturn(Optional.of(evento));
        when(usuarios.findById(2)).thenReturn(Optional.of(usuario));
        when(eventos.numUsuariosByEvento(1)).thenReturn(1);

        assertEquals(HttpStatus.CONFLICT,
            assertThrows(ResponseStatusException.class, () -> service.subscribeEvento(1, 2)).getStatusCode());
        verify(usuarios, never()).save(any());
    }
}

