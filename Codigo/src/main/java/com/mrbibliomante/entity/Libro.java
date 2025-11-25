package com.mrbibliomante.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
public class Libro extends DomainEntity {
	@NotBlank
	private String tituloLibro;

	@NotBlank
	private String autor;

	@NotBlank
	private String genero;

	@NotBlank
	private String idioma;

	@Pattern(regexp = "[0-9]{13}")

	private String ISBN;
	
	private String imagen;

	@Min(0)
	private int numEjemplar;

	public Libro() {
		super();
	}

	public String getTituloLibro() {
		return tituloLibro;
	}

	public void setTituloLibro(String titulo) {
		this.tituloLibro = titulo;
	}

	public String getAutor() {
		return autor;
	}

	public void setAutor(String autor) {
		this.autor = autor;
	}

	public String getGenero() {
		return genero;
	}

	public void setGenero(String genero) {
		this.genero = genero;
	}

	public String getIdioma() {
		return idioma;
	}

	public void setIdioma(String idioma) {
		this.idioma = idioma;
	}

	public String getISBN() {
		return ISBN;
	}

	public void setISBN(String iSBN) {
		ISBN = iSBN;
	}

	public String getImagen() {
		return imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public int getNumEjemplar() {
		return numEjemplar;
	}

	public void setNumEjemplar(int numEjemplar) {
		this.numEjemplar = numEjemplar;
	}
}
