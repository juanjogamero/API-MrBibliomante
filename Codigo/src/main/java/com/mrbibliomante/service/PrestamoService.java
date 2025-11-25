package com.mrbibliomante.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbibliomante.entity.Libro;
import com.mrbibliomante.entity.Prestamo;
import com.mrbibliomante.entity.TipoEstado;
import com.mrbibliomante.entity.Usuario;
import com.mrbibliomante.repository.PrestamoRepository;

@Service
public class PrestamoService {

	@Autowired
	private PrestamoRepository prestamoRepository;

	@Autowired
	private LibroService libroService;

	@Autowired
	private UsuarioService usuarioService;

	public Optional<Prestamo> findById(int id) {
		return this.prestamoRepository.findById(id);
	}

	public List<Prestamo> findAll() {
		return this.prestamoRepository.findAll();
	}

	public Prestamo update(Prestamo prestamo) {
		return this.prestamoRepository.save(prestamo);
	}

	// TODO: Se debe controlar quien realiza esta accion
	public Prestamo save(Prestamo prestamo, int idLibro) {
		Optional<Libro> oLibro = libroService.findById(idLibro);
		if (oLibro.isEmpty()) {
			return null;
		} else if (oLibro.get()
				.getNumEjemplar() >= (prestamoRepository
						.numPrestamoOfLibroByNombreAndEstado(oLibro.get().getId(), TipoEstado.ACTIVO)
						+ numPrestamoOfLibroByNombreAndEstado(oLibro.get().getId(),
								TipoEstado.VENCIDO))) {
			Libro l = oLibro.get();
			prestamo.setLibro(l);
			prestamo.setTipoEstado(TipoEstado.ACTIVO);
			prestamo.setFechaInicio(new Date());
			prestamo.setFechaFin(prestamo.getFechFin());
		}
		return this.prestamoRepository.save(prestamo);
	}
	
	public void delete(int id) {
		this.prestamoRepository.deleteById(id);
	}

	public Prestamo finishPrestamo(int idPrestamo) {
		Optional<Prestamo> oPrestamo = findById(idPrestamo);
		if (oPrestamo.isPresent()) {
			Prestamo p = oPrestamo.get();
			p.setTipoEstado(TipoEstado.DEVUELTO);
			return update(p);
		}
		return null;
	}

	// TODO: Este metodo se debe hacer Async
	public Prestamo maturedPrestamo(int idPrestamo) {
		Optional<Prestamo> oPrestamo = findById(idPrestamo);
		if (oPrestamo.isPresent()) {
			Prestamo p = oPrestamo.get();
			p.setTipoEstado(TipoEstado.VENCIDO);
			return update(p);
		}
		return null;
	}

	public List<Prestamo> findAllByUser(int idUser) {
		Optional<Usuario> oUsuario = usuarioService.findById(idUser);
		if (oUsuario.isPresent()) {
			Usuario u = oUsuario.get();
			return u.getListPrestamo();
		}
		return null;
	}
	
	public int numPrestamoOfLibroByNombreAndEstado(int idLibro, TipoEstado tipoEstado) {
		return this.prestamoRepository.numPrestamoOfLibroByNombreAndEstado(idLibro, tipoEstado);
	}
}
