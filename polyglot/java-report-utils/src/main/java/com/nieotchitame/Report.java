package com.nieotchitame;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Lightweight POJO representing a Nie Otchitame report.
 * Mirrors the FastAPI Report schema used by the Python backend.
 */
public class Report {

    public enum Type {
        revenue, expense, project, hr
    }

    public enum Status {
        draft, submitted, approved
    }

    private Long id;
    private String title;
    private Type reportType;
    private BigDecimal amount;
    private String date;
    private Status status;
    private Instant createdAt;
    private Instant updatedAt;

    public Report() {
    }

    public Report(String title, Type reportType, BigDecimal amount, String date, Status status) {
        this.title = title;
        this.reportType = reportType;
        this.amount = amount;
        this.date = date;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Type getReportType() {
        return reportType;
    }

    public void setReportType(Type reportType) {
        this.reportType = reportType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
