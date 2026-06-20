package com.nieotchitame;

import com.nieotchitame.Report.Status;
import com.nieotchitame.Report.Type;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

/**
 * Validation utilities for Nie Otchitame reports.
 * Demonstrates Java 17 + Maven + JUnit 5 skills from the job posting.
 */
public class ReportValidator {

    // Allowed lifecycle transitions for report status.
    // draft -> submitted, submitted -> approved, draft -> approved is NOT allowed.
    private static final Set<Status> FINAL_STATUSES = EnumSet.of(Status.approved);

    /**
     * Validates a full report object. Returns all validation errors found.
     *
     * @param report the report to validate
     * @return list of human-readable error messages; empty if valid
     */
    public List<String> validate(Report report) {
        if (report == null) {
            return List.of("Report is null.");
        }

        List<String> errors = new ArrayList<>();

        if (isBlank(report.getTitle())) {
            errors.add("Title is required.");
        }

        if (report.getReportType() == null) {
            errors.add("Report type is required.");
        } else if (!isValidType(report.getReportType())) {
            errors.add("Invalid report type: " + report.getReportType() + ".");
        }

        if (report.getAmount() == null) {
            errors.add("Amount is required.");
        } else if (!isPositiveAmount(report.getAmount())) {
            errors.add("Amount must be positive (got " + report.getAmount() + ").");
        }

        if (isBlank(report.getDate())) {
            errors.add("Date is required.");
        }

        if (report.getStatus() == null) {
            errors.add("Status is required.");
        } else if (!isValidStatus(report.getStatus())) {
            errors.add("Invalid status: " + report.getStatus() + ".");
        }

        return Collections.unmodifiableList(errors);
    }

    /**
     * Checks whether a status transition is allowed in the report lifecycle.
     *
     * @param from current status
     * @param to   requested status
     * @return true if the transition is legal, false otherwise
     */
    public boolean canTransition(Status from, Status to) {
        if (from == null || to == null) {
            return false;
        }
        if (from == to) {
            return true;
        }
        if (FINAL_STATUSES.contains(from)) {
            return false; // approved cannot change
        }
        return switch (from) {
            case draft -> to == Status.submitted;
            case submitted -> to == Status.approved;
            default -> false;
        };
    }

    /**
     * Performs the transition if valid; otherwise throws IllegalStateException.
     */
    public Status transition(Status from, Status to) {
        if (!canTransition(from, to)) {
            throw new IllegalStateException(
                "Invalid transition from " + from + " to " + to + "."
            );
        }
        return to;
    }

    private boolean isValidType(Type type) {
        try {
            Type.valueOf(type.name());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isValidStatus(Status status) {
        try {
            Status.valueOf(status.name());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isPositiveAmount(BigDecimal amount) {
        return amount.compareTo(BigDecimal.ZERO) > 0;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    // Small CLI demo. Not the main entry point of the polyglot demo, but shows
    // that the validator can be exercised from the command line after packaging.
    public static void main(String[] args) {
        ReportValidator validator = new ReportValidator();

        Report valid = new Report(
            "Monthly revenue",
            Type.revenue,
            new BigDecimal("12500.50"),
            "2026-06-20",
            Status.draft
        );

        System.out.println("Valid report errors: " + validator.validate(valid));
        System.out.println("draft -> submitted: " + validator.canTransition(Status.draft, Status.submitted));
        System.out.println("draft -> approved: " + validator.canTransition(Status.draft, Status.approved));
    }
}
