package com.mrbibliomante.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbibliomante.entity.Admin;
import com.mrbibliomante.repository.AdminRepository;

@Service
public class AdminService {

	@Autowired
	private AdminRepository adminRepository;

	public Optional<Admin> findById(int id) {
		return this.adminRepository.findById(id);
	}

	public List<Admin> findAll() {
		return this.adminRepository.findAll();
	}

	public Admin save(Admin admin) {
		return this.adminRepository.save(admin);
	}

	// TODO; Solo el usuario propietario puede realizar esta accion
	public Admin update(int idAdmin, Admin admin) {
		Optional<Admin> oAdmin = findById(idAdmin);
		if (oAdmin.isPresent()) {
			Admin a = oAdmin.get();
			a.setNombre(admin.getNombre());
			a.setPrimerApellido(admin.getPrimerApellido());
			a.setSegundoApellido(admin.getSegundoApellido());
			a.setMail(admin.getMail());
			a.setFoto(admin.getFoto());
			a.setTelefono(admin.getTelefono());
			a.setdPostal(admin.getdPostal());
			return save(a);
		}
		return null;
	}

	// TODO; Solo el usuario propietario puede realizar esta accion
	// TODO: Posteriormente se van a a anonimizar los datos en vez de eliminar.
	public void delete(int id) {
		this.adminRepository.deleteById(id);
	}
}
