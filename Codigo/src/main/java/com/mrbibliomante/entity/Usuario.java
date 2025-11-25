package com.mrbibliomante.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Usuario extends Actor {

	@ManyToMany
	private List<Evento> listEvent;
	
	@OneToMany
	private List<Prestamo> listPrestamo;
	
	public Usuario() {
		super();
	}
	
	public List<Prestamo> getListPrestamo() {
		return listPrestamo;
	}

	public void setListPrestamo(List<Prestamo> listPrestamo) {
		this.listPrestamo = listPrestamo;
	}


	public List<Evento> getListEvent() {
		return listEvent;
	}
	

	public void setListEvent(List<Evento> listEvent) {
		this.listEvent = listEvent;
	}
}