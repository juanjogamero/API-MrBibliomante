package com.mrbibliomante.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbibliomante.entity.Bibliotecario;
import com.mrbibliomante.repository.BibliotecarioRepository;

@Service
public class BibliotecarioService {

	@Autowired
	private BibliotecarioRepository bibliotecarioRepository;

	public Optional<Bibliotecario> findById(int id) {
		return this.bibliotecarioRepository.findById(id);
	}

	public List<Bibliotecario> findAll() {
		return this.bibliotecarioRepository.findAll();
	}

	public Bibliotecario save(Bibliotecario bibliotecario) {
		return this.bibliotecarioRepository.save(bibliotecario);
	}

	// TODO; Solo el usuario propietario puede realizar esta accion
	public Bibliotecario update(int idBibliotecario, Bibliotecario bibliotecario) {
		Optional<Bibliotecario> oBibliotecario = findById(idBibliotecario);
		if (oBibliotecario.isPresent()) {
			Bibliotecario b = oBibliotecario.get();
			b.setNombre(bibliotecario.getNombre());
			b.setPrimerApellido(bibliotecario.getPrimerApellido());
			b.setSegundoApellido(bibliotecario.getSegundoApellido());
			b.setMail(bibliotecario.getMail());
			b.setFoto(bibliotecario.getFoto());
			b.setTelefono(bibliotecario.getTelefono());
			b.setdPostal(bibliotecario.getdPostal());
			return save(b);
		}
		return null;
	}

	// TODO; Es necesario controlar que esa accion solo lo hace el propio usuario
	// TODO: Posteriormente se van a a anonimizar los datos en vez de eliminar.
	public void delete(int id) {
		this.bibliotecarioRepository.deleteById(id);
	}
}
