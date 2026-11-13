package com.mrbibliomante.entity;

import org.hibernate.validator.constraints.URL;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class Actor extends DomainEntity {
    @NotBlank
    private String nombre;

    @NotBlank
    private String primerApellido;

    private String segundoApellido;

    @Email
    private String mail;

    @URL
    private String foto;

    @Pattern(regexp = "^[6-9][0-9]{8}$")
    private String telefono;

    private String dPostal;

    public Actor() { super(); }

    public Actor(String nombre, String primerApellido, String segundoApellido,
                 String mail, String foto, String telefono, String dPostal) {
        this.nombre = nombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.mail = mail;
        this.foto = foto;
        this.telefono = telefono;
        this.dPostal = dPostal;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getPrimerApellido() { return primerApellido; }
    public void setPrimerApellido(String primerApellido) { this.primerApellido = primerApellido; }
    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }
    public String getMail() { return mail; }
    public void setMail(String mail) { this.mail = mail; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getdPostal() { return dPostal; }
    public void setdPostal(String dPostal) { this.dPostal = dPostal; }
}
