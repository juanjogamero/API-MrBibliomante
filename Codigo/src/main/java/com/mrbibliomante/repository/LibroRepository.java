package com.mrbibliomante.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrbibliomante.entity.Libro;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Integer>{

}
