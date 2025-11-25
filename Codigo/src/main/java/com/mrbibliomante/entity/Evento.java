package com.mrbibliomante.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Evento extends DomainEntity {
	@NotBlank
	private String titulo;

	@NotBlank
	private String descripcion;

	@Min(0)
	private int aforo;

	@Future
	private LocalDate fechaHoraEvento;

	public Evento() {
		super();
	}

	public Evento(@NotBlank String titulo, @NotBlank String descripcion, @Min(0) int aforo,
			@Future LocalDate fechaHoraEvento) {
		super();
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.aforo = aforo;
		this.fechaHoraEvento = fechaHoraEvento;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public int getAforo() {
		return aforo;
	}

	public void setAforo(int aforo) {
		this.aforo = aforo;
	}

	public LocalDate getFechaHora() {
		return fechaHoraEvento;
	}

	public void setFechaHora(LocalDate fechaHora) {
		this.fechaHoraEvento = fechaHora;
	}
}
