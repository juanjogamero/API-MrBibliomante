package com.mrbibliomante.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mrbibliomante.entity.Evento;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Integer> {

	@Query("SELECT COUNT(u) FROM Usuario u JOIN u.listEvent e WHERE e.id = ?1")
	int numUsuariosByEvento(int eventoId);
}
