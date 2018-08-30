package com.praksa.breza.web.rest;

import com.praksa.breza.BrezaApp;

import com.praksa.breza.domain.Proba;
import com.praksa.breza.domain.Article;
import com.praksa.breza.repository.ProbaRepository;
import com.praksa.breza.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static com.praksa.breza.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ProbaResource REST controller.
 *
 * @see ProbaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BrezaApp.class)
public class ProbaResourceIntTest {

    private static final String DEFAULT_IME = "AAAAAAAAAA";
    private static final String UPDATED_IME = "BBBBBBBBBB";

    private static final Integer DEFAULT_LALA = 5;
    private static final Integer UPDATED_LALA = 6;

    @Autowired
    private ProbaRepository probaRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restProbaMockMvc;

    private Proba proba;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProbaResource probaResource = new ProbaResource(probaRepository);
        this.restProbaMockMvc = MockMvcBuilders.standaloneSetup(probaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proba createEntity(EntityManager em) {
        Proba proba = new Proba()
            .ime(DEFAULT_IME)
            .lala(DEFAULT_LALA);
        // Add required entity
        Article article = ArticleResourceIntTest.createEntity(em);
        em.persist(article);
        em.flush();
        proba.setArticle(article);
        return proba;
    }

    @Before
    public void initTest() {
        proba = createEntity(em);
    }

    @Test
    @Transactional
    public void createProba() throws Exception {
        int databaseSizeBeforeCreate = probaRepository.findAll().size();

        // Create the Proba
        restProbaMockMvc.perform(post("/api/probas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proba)))
            .andExpect(status().isCreated());

        // Validate the Proba in the database
        List<Proba> probaList = probaRepository.findAll();
        assertThat(probaList).hasSize(databaseSizeBeforeCreate + 1);
        Proba testProba = probaList.get(probaList.size() - 1);
        assertThat(testProba.getIme()).isEqualTo(DEFAULT_IME);
        assertThat(testProba.getLala()).isEqualTo(DEFAULT_LALA);
    }

    @Test
    @Transactional
    public void createProbaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = probaRepository.findAll().size();

        // Create the Proba with an existing ID
        proba.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProbaMockMvc.perform(post("/api/probas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proba)))
            .andExpect(status().isBadRequest());

        // Validate the Proba in the database
        List<Proba> probaList = probaRepository.findAll();
        assertThat(probaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkImeIsRequired() throws Exception {
        int databaseSizeBeforeTest = probaRepository.findAll().size();
        // set the field null
        proba.setIme(null);

        // Create the Proba, which fails.

        restProbaMockMvc.perform(post("/api/probas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proba)))
            .andExpect(status().isBadRequest());

        List<Proba> probaList = probaRepository.findAll();
        assertThat(probaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLalaIsRequired() throws Exception {
        int databaseSizeBeforeTest = probaRepository.findAll().size();
        // set the field null
        proba.setLala(null);

        // Create the Proba, which fails.

        restProbaMockMvc.perform(post("/api/probas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proba)))
            .andExpect(status().isBadRequest());

        List<Proba> probaList = probaRepository.findAll();
        assertThat(probaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProbas() throws Exception {
        // Initialize the database
        probaRepository.saveAndFlush(proba);

        // Get all the probaList
        restProbaMockMvc.perform(get("/api/probas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(proba.getId().intValue())))
            .andExpect(jsonPath("$.[*].ime").value(hasItem(DEFAULT_IME.toString())))
            .andExpect(jsonPath("$.[*].lala").value(hasItem(DEFAULT_LALA)));
    }
    

    @Test
    @Transactional
    public void getProba() throws Exception {
        // Initialize the database
        probaRepository.saveAndFlush(proba);

        // Get the proba
        restProbaMockMvc.perform(get("/api/probas/{id}", proba.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(proba.getId().intValue()))
            .andExpect(jsonPath("$.ime").value(DEFAULT_IME.toString()))
            .andExpect(jsonPath("$.lala").value(DEFAULT_LALA));
    }
    @Test
    @Transactional
    public void getNonExistingProba() throws Exception {
        // Get the proba
        restProbaMockMvc.perform(get("/api/probas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProba() throws Exception {
        // Initialize the database
        probaRepository.saveAndFlush(proba);

        int databaseSizeBeforeUpdate = probaRepository.findAll().size();

        // Update the proba
        Proba updatedProba = probaRepository.findById(proba.getId()).get();
        // Disconnect from session so that the updates on updatedProba are not directly saved in db
        em.detach(updatedProba);
        updatedProba
            .ime(UPDATED_IME)
            .lala(UPDATED_LALA);

        restProbaMockMvc.perform(put("/api/probas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProba)))
            .andExpect(status().isOk());

        // Validate the Proba in the database
        List<Proba> probaList = probaRepository.findAll();
        assertThat(probaList).hasSize(databaseSizeBeforeUpdate);
        Proba testProba = probaList.get(probaList.size() - 1);
        assertThat(testProba.getIme()).isEqualTo(UPDATED_IME);
        assertThat(testProba.getLala()).isEqualTo(UPDATED_LALA);
    }

    @Test
    @Transactional
    public void updateNonExistingProba() throws Exception {
        int databaseSizeBeforeUpdate = probaRepository.findAll().size();

        // Create the Proba

        // If the entity doesn't have an ID, it will throw BadRequestAlertException 
        restProbaMockMvc.perform(put("/api/probas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proba)))
            .andExpect(status().isBadRequest());

        // Validate the Proba in the database
        List<Proba> probaList = probaRepository.findAll();
        assertThat(probaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProba() throws Exception {
        // Initialize the database
        probaRepository.saveAndFlush(proba);

        int databaseSizeBeforeDelete = probaRepository.findAll().size();

        // Get the proba
        restProbaMockMvc.perform(delete("/api/probas/{id}", proba.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Proba> probaList = probaRepository.findAll();
        assertThat(probaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Proba.class);
        Proba proba1 = new Proba();
        proba1.setId(1L);
        Proba proba2 = new Proba();
        proba2.setId(proba1.getId());
        assertThat(proba1).isEqualTo(proba2);
        proba2.setId(2L);
        assertThat(proba1).isNotEqualTo(proba2);
        proba1.setId(null);
        assertThat(proba1).isNotEqualTo(proba2);
    }
}
