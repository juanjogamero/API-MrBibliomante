package com.mrbibliomante.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Future;

@Entity
public class Prestamo extends DomainEntity {
	private Date fechaInicio;

	@Future
	private Date fechaFin;

	private TipoEstado tipoEstado;

	@ManyToOne
	private Libro libro;

	public Prestamo() {
		super();
	}

	public Prestamo(Date fechaInicio, Date fechFin, TipoEstado tipoEstado, Libro libro) {
		super();
		this.fechaInicio = fechaInicio;
		this.fechaFin = fechFin;
		this.tipoEstado = tipoEstado;
		this.libro = libro;
	}

	public Date getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(Date fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public Date getFechFin() {
		return fechaFin;
	}

	public void setFechaFin(Date fechaFin) {
		this.fechaFin = fechaFin;
	}

	public TipoEstado getTipoEstado() {
		return tipoEstado;
	}

	public void setTipoEstado(TipoEstado tipoEstado) {
		this.tipoEstado = tipoEstado;
	}

	public Libro getLibro() {
		return libro;
	}

	public void setLibro(Libro libro) {
		this.libro = libro;
	}
}
