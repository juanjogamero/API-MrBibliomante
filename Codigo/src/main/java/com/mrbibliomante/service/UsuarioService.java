package com.mrbibliomante.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbibliomante.entity.Usuario;
import com.mrbibliomante.repository.UsuarioRepository;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	public Optional<Usuario> findById(int id) {
		return this.usuarioRepository.findById(id);
	}

	public List<Usuario> findAll() {
		return this.usuarioRepository.findAll();
	}

	public Usuario save(Usuario usuario) {
		return this.usuarioRepository.save(usuario);
	}

	// TODO; Solo el usuario propietario puede realizar esta accion
	public Usuario update(int idUsuario, Usuario usuario) {
		Optional<Usuario> oUsuario = findById(idUsuario);
		if (oUsuario.isPresent()) {
			Usuario u = oUsuario.get();
			u.setNombre(usuario.getNombre());
			u.setPrimerApellido(usuario.getPrimerApellido());
			u.setSegundoApellido(usuario.getSegundoApellido());
			u.setMail(usuario.getMail());
			u.setFoto(usuario.getFoto());
			u.setTelefono(usuario.getTelefono());
			u.setdPostal(usuario.getdPostal());
			return save(u);
		}
		return null;
	}

	// TODO; Solo el usuario propietario puede realizar esta accion
	// TODO: Posteriormente se van a a anonimizar los datos en vez de eliminar.
	public void delete(int id) {
		this.usuarioRepository.deleteById(id);
	}
}
