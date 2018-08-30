package com.praksa.breza.repository;

import com.praksa.breza.domain.Proba;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Proba entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProbaRepository extends JpaRepository<Proba, Long> {

}
