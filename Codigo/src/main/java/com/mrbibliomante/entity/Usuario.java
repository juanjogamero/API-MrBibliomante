package com.mrbibliomante.entity;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Usuario extends Actor {
    @ManyToMany
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<Evento> listEvent = new ArrayList<>();

    @OneToMany(mappedBy = "usuario")
    @JsonIgnore
    private List<Prestamo> listPrestamo = new ArrayList<>();

    public Usuario() { super(); }

    public List<Prestamo> getListPrestamo() { return listPrestamo; }
    public void setListPrestamo(List<Prestamo> listPrestamo) { this.listPrestamo = listPrestamo; }
    public List<Evento> getListEvent() { return listEvent; }
    public void setListEvent(List<Evento> listEvent) { this.listEvent = listEvent; }
}
