import { useState, useEffect } from 'react';
import { Report, ReportCreate, REPORT_TYPES, STATUSES } from '../types';

interface ReportFormProps {
  report?: Report | null;
  onSubmit: (data: ReportCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

const emptyForm: ReportCreate = {
  title: '',
  report_type: 'revenue',
  amount: 0,
  date: '',
  status: 'draft',
};

export default function ReportForm({
  report,
  onSubmit,
  onCancel,
  loading,
}: ReportFormProps) {
  const [form, setForm] = useState<ReportCreate>(emptyForm);

  useEffect(() => {
    if (report) {
      setForm({
        title: report.title,
        report_type: report.report_type,
        amount: report.amount,
        date: report.date,
        status: report.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [report]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isEditing = Boolean(report);

  return (
    <form className="report-form" onSubmit={handleSubmit} aria-label="Report form">
      <h2>{isEditing ? 'Edit Report' : 'Add Report'}</h2>

      <label htmlFor="title">Title *</label>
      <input
        id="title"
        name="title"
        type="text"
        value={form.title}
        onChange={handleChange}
        required
        placeholder="e.g. Monthly revenue"
        data-testid="report-title-input"
      />

      <label htmlFor="report_type">Type *</label>
      <select
        id="report_type"
        name="report_type"
        value={form.report_type}
        onChange={handleChange}
        required
        data-testid="report-type-select"
      >
        {REPORT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      <label htmlFor="amount">Amount *</label>
      <input
        id="amount"
        name="amount"
        type="number"
        step="0.01"
        min="0"
        value={form.amount}
        onChange={handleChange}
        required
        placeholder="0.00"
        data-testid="report-amount-input"
      />

      <label htmlFor="date">Date *</label>
      <input
        id="date"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
        data-testid="report-date-input"
      />

      <label htmlFor="status">Status *</label>
      <select
        id="status"
        name="status"
        value={form.status}
        onChange={handleChange}
        required
        data-testid="report-status-select"
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          data-testid="report-submit-btn"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Report' : 'Add Report'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
            data-testid="report-cancel-btn"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
