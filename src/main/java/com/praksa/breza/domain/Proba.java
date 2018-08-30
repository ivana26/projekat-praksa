package com.praksa.breza.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Proba.
 */
@Entity
@Table(name = "proba")
public class Proba implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 5, max = 20)
    @Pattern(regexp = "^[a-zA-Z0-9]*$")
    @Column(name = "ime", length = 20, nullable = false)
    private String ime;

    @NotNull
    @Min(value = 5)
    @Max(value = 100)
    @Column(name = "lala", nullable = false)
    private Integer lala;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private Article article;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIme() {
        return ime;
    }

    public Proba ime(String ime) {
        this.ime = ime;
        return this;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public Integer getLala() {
        return lala;
    }

    public Proba lala(Integer lala) {
        this.lala = lala;
        return this;
    }

    public void setLala(Integer lala) {
        this.lala = lala;
    }

    public Article getArticle() {
        return article;
    }

    public Proba article(Article article) {
        this.article = article;
        return this;
    }

    public void setArticle(Article article) {
        this.article = article;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Proba proba = (Proba) o;
        if (proba.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), proba.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Proba{" +
            "id=" + getId() +
            ", ime='" + getIme() + "'" +
            ", lala=" + getLala() +
            "}";
    }
}
