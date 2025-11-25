package com.mrbibliomante.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbibliomante.entity.Evento;
import com.mrbibliomante.repository.EventoRepository;

@Service
public class EventoService {
	@Autowired
	private EventoRepository eventoRepository;

//	@Autowired
//	private UsuarioService usuarioService;

	public Optional<Evento> findById(int id) {
		return this.eventoRepository.findById(id);
	}

	public List<Evento> findAll() {
		return this.eventoRepository.findAll();
	}

	public Evento save(Evento evento) {
		return this.eventoRepository.save(evento);
	}

	public Evento update(int idEvento, Evento evento) {
		Optional<Evento> oEvento = findById(idEvento);
		if (oEvento.isPresent() && numUsuariosByEvento(idEvento) == 0 ) {
			Evento e = oEvento.get();
			e.setTitulo(evento.getTitulo());
			e.setDescripcion(evento.getDescripcion());
			e.setAforo(evento.getAforo());
			e.setFechaHora(evento.getFechaHora());
			return save(e);
		}
		return null;
	}

	// TODO: Se necesita obtener usuario logueado
	public boolean subscribeEvento(int idEvento) {
		Optional<Evento> oEvento = findById(idEvento);
		if (oEvento.isPresent()) {
			Evento e = oEvento.get();
			if (e.getAforo() >= numUsuariosByEvento(idEvento)) {
				return true;
			}
		}
		return false;
	}

	// TODO: Se necesita obtener usuario logueado
	public boolean unSubscribeEvento(int idEvento) {
		Optional<Evento> oEvento = findById(idEvento);
		if (oEvento.isPresent()) {
			Evento e = oEvento.get();
			if (e.getAforo() >= numUsuariosByEvento(idEvento)) {
				return true;
			}
		}
		return false;
	}

	public void delete(int id) {
		this.eventoRepository.deleteById(id);
	}
	
	public int numUsuariosByEvento(int idEvento) {
		return eventoRepository.numUsuariosByEvento(idEvento);
	}
}
