package com.mrbibliomante.entity;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Evento extends DomainEntity {
    @NotBlank
    private String titulo;

    @NotBlank
    private String descripcion;

    @Min(1)
    private int aforo;

    @NotNull
    @Future
    private LocalDate fechaHoraEvento;

    public Evento() { super(); }

    public Evento(String titulo, String descripcion, int aforo, LocalDate fechaHoraEvento) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.aforo = aforo;
        this.fechaHoraEvento = fechaHoraEvento;
    }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public int getAforo() { return aforo; }
    public void setAforo(int aforo) { this.aforo = aforo; }
    public LocalDate getFechaHora() { return fechaHoraEvento; }
    public void setFechaHora(LocalDate fechaHora) { this.fechaHoraEvento = fechaHora; }
}
