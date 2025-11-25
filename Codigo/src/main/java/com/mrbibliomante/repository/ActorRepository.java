package com.mrbibliomante.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrbibliomante.entity.Actor;

@Repository
public interface ActorRepository extends JpaRepository<Actor, Integer> {

}
