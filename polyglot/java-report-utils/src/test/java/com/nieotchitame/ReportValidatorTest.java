package com.nieotchitame;

import com.nieotchitame.Report.Status;
import com.nieotchitame.Report.Type;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ReportValidatorTest {

    private ReportValidator validator;

    @BeforeEach
    void setUp() {
        validator = new ReportValidator();
    }

    @Test
    void validReportShouldHaveNoErrors() {
        Report report = new Report(
            "Q2 revenue",
            Type.revenue,
            new BigDecimal("12500.50"),
            "2026-06-20",
            Status.draft
        );

        List<String> errors = validator.validate(report);

        assertTrue(errors.isEmpty(), "Expected no validation errors, got: " + errors);
    }

    @Test
    void nullReportShouldBeInvalid() {
        List<String> errors = validator.validate(null);

        assertEquals(1, errors.size());
        assertEquals("Report is null.", errors.get(0));
    }

    @Test
    void missingFieldsShouldProduceErrors() {
        Report report = new Report();

        List<String> errors = validator.validate(report);

        assertEquals(5, errors.size());
        assertTrue(errors.contains("Title is required."));
        assertTrue(errors.contains("Report type is required."));
        assertTrue(errors.contains("Amount is required."));
        assertTrue(errors.contains("Date is required."));
        assertTrue(errors.contains("Status is required."));
    }

    @Test
    void negativeAmountShouldBeInvalid() {
        Report report = new Report(
            "Bad expense",
            Type.expense,
            new BigDecimal("-100.00"),
            "2026-06-20",
            Status.draft
        );

        List<String> errors = validator.validate(report);

        assertEquals(1, errors.size());
        assertTrue(errors.get(0).contains("Amount must be positive"));
    }

    @Test
    void zeroAmountShouldBeInvalid() {
        Report report = new Report(
            "Zero revenue",
            Type.revenue,
            BigDecimal.ZERO,
            "2026-06-20",
            Status.draft
        );

        List<String> errors = validator.validate(report);

        assertEquals(1, errors.size());
        assertTrue(errors.get(0).contains("Amount must be positive"));
    }

    @Test
    void blankTitleShouldBeInvalid() {
        Report report = new Report(
            "   ",
            Type.hr,
            new BigDecimal("1.00"),
            "2026-06-20",
            Status.draft
        );

        List<String> errors = validator.validate(report);

        assertEquals(1, errors.size());
        assertEquals("Title is required.", errors.get(0));
    }

    @Test
    void allowedTransitionsShouldPass() {
        assertTrue(validator.canTransition(Status.draft, Status.submitted));
        assertTrue(validator.canTransition(Status.submitted, Status.approved));
        assertTrue(validator.canTransition(Status.draft, Status.draft));
    }

    @Test
    void forbiddenTransitionsShouldFail() {
        assertFalse(validator.canTransition(Status.draft, Status.approved));
        assertFalse(validator.canTransition(Status.submitted, Status.draft));
        assertFalse(validator.canTransition(Status.approved, Status.submitted));
        assertFalse(validator.canTransition(Status.approved, Status.approved));
        assertFalse(validator.canTransition(null, Status.draft));
        assertFalse(validator.canTransition(Status.draft, null));
    }

    @Test
    void transitionShouldReturnNewStatusWhenAllowed() {
        Status result = validator.transition(Status.draft, Status.submitted);

        assertEquals(Status.submitted, result);
    }

    @Test
    void transitionShouldThrowWhenForbidden() {
        IllegalStateException exception = assertThrows(
            IllegalStateException.class,
            () -> validator.transition(Status.draft, Status.approved)
        );

        assertTrue(exception.getMessage().contains("Invalid transition"));
    }

    @Test
    void allValidReportTypesShouldValidate() {
        for (Type type : Type.values()) {
            Report report = new Report(
                type + " report",
                type,
                new BigDecimal("100.00"),
                "2026-06-20",
                Status.draft
            );
            assertTrue(validator.validate(report).isEmpty(),
                "Expected " + type + " to be valid");
        }
    }
}
