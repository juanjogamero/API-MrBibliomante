package com.mrbibliomante.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.mrbibliomante.entity.Evento;
import jakarta.persistence.LockModeType;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Integer> {
    @Query("SELECT COUNT(u) FROM Usuario u JOIN u.listEvent e WHERE e.id = :id")
    int numUsuariosByEvento(@Param("id") int eventoId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Evento e WHERE e.id = :id")
    Optional<Evento> findByIdForUpdate(@Param("id") int id);
}
