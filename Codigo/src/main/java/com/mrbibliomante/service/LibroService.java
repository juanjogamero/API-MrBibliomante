package com.mrbibliomante.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbibliomante.entity.Libro;
import com.mrbibliomante.repository.LibroRepository;

@Service
public class LibroService {

	@Autowired
	private LibroRepository libroRepository;

	public Optional<Libro> findById(int id) {
		return this.libroRepository.findById(id);
	}

	public List<Libro> findAll() {
		return this.libroRepository.findAll();
	}

	public Libro save(Libro libro) {
		return this.libroRepository.save(libro);
	}
	
	public Libro update(int idLibro, Libro libro) {
		Optional<Libro> oLibro = findById(idLibro);
		if(oLibro.isPresent()) {
			Libro l = oLibro.get();
			l.setAutor(libro.getAutor());
			l.setGenero(libro.getGenero());
			l.setNumEjemplar(libro.getNumEjemplar());
			return save(l);
		}
		return null;
	}

	public void delete(int id) {
		this.libroRepository.deleteById(id);
	}
}
