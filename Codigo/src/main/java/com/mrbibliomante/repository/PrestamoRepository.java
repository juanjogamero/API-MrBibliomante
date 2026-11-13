package com.mrbibliomante.repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.mrbibliomante.entity.Prestamo;
import com.mrbibliomante.entity.TipoEstado;
import jakarta.persistence.LockModeType;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Integer> {
    int countByLibroIdAndTipoEstadoIn(int libroId, Collection<TipoEstado> estados);
    boolean existsByLibroId(int libroId);
    List<Prestamo> findByUsuarioId(int usuarioId);
    List<Prestamo> findByTipoEstado(TipoEstado estado);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Prestamo p WHERE p.id = :id")
    Optional<Prestamo> findByIdForUpdate(@Param("id") int id);

    @Modifying
    @Query("UPDATE Prestamo p SET p.tipoEstado = :vencido WHERE p.tipoEstado = :activo AND p.fechaFin < :hoy")
    int marcarVencidos(@Param("hoy") LocalDate hoy,
                       @Param("activo") TipoEstado activo,
                       @Param("vencido") TipoEstado vencido);

    default int numPrestamoOfLibroByNombreAndEstado(int idLibro, TipoEstado tipo) {
        return countByLibroIdAndTipoEstadoIn(idLibro, List.of(tipo));
    }
}
