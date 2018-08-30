package com.praksa.breza.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.praksa.breza.domain.Proba;
import com.praksa.breza.repository.ProbaRepository;
import com.praksa.breza.web.rest.errors.BadRequestAlertException;
import com.praksa.breza.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Proba.
 */
@RestController
@RequestMapping("/api")
public class ProbaResource {

    private final Logger log = LoggerFactory.getLogger(ProbaResource.class);

    private static final String ENTITY_NAME = "proba";

    private final ProbaRepository probaRepository;

    public ProbaResource(ProbaRepository probaRepository) {
        this.probaRepository = probaRepository;
    }

    /**
     * POST  /probas : Create a new proba.
     *
     * @param proba the proba to create
     * @return the ResponseEntity with status 201 (Created) and with body the new proba, or with status 400 (Bad Request) if the proba has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/probas")
    @Timed
    public ResponseEntity<Proba> createProba(@Valid @RequestBody Proba proba) throws URISyntaxException {
        log.debug("REST request to save Proba : {}", proba);
        if (proba.getId() != null) {
            throw new BadRequestAlertException("A new proba cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Proba result = probaRepository.save(proba);
        return ResponseEntity.created(new URI("/api/probas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /probas : Updates an existing proba.
     *
     * @param proba the proba to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated proba,
     * or with status 400 (Bad Request) if the proba is not valid,
     * or with status 500 (Internal Server Error) if the proba couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/probas")
    @Timed
    public ResponseEntity<Proba> updateProba(@Valid @RequestBody Proba proba) throws URISyntaxException {
        log.debug("REST request to update Proba : {}", proba);
        if (proba.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Proba result = probaRepository.save(proba);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, proba.getId().toString()))
            .body(result);
    }

    /**
     * GET  /probas : get all the probas.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of probas in body
     */
    @GetMapping("/probas")
    @Timed
    public List<Proba> getAllProbas() {
        log.debug("REST request to get all Probas");
        return probaRepository.findAll();
    }

    /**
     * GET  /probas/:id : get the "id" proba.
     *
     * @param id the id of the proba to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the proba, or with status 404 (Not Found)
     */
    @GetMapping("/probas/{id}")
    @Timed
    public ResponseEntity<Proba> getProba(@PathVariable Long id) {
        log.debug("REST request to get Proba : {}", id);
        Optional<Proba> proba = probaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(proba);
    }

    /**
     * DELETE  /probas/:id : delete the "id" proba.
     *
     * @param id the id of the proba to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/probas/{id}")
    @Timed
    public ResponseEntity<Void> deleteProba(@PathVariable Long id) {
        log.debug("REST request to delete Proba : {}", id);

        probaRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
