package com.mrbibliomante.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mrbibliomante.entity.Prestamo;
import com.mrbibliomante.entity.TipoEstado;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Integer> {
	// Se utiliza el valor numerico (ordinal) del enum tipoEstado.
	/*
	 * En consultas JPQL, los nombres de los atributos deben coincidir exactamente
	 * con los definidos en las entidades Java
	 */
	@Query("SELECT COUNT(p) FROM Prestamo p JOIN p.libro l WHERE " + "l.id = ?1 AND p.tipoEstado = ?2")
	public int numPrestamoOfLibroByNombreAndEstado(int idLibro, TipoEstado tipo);
}
