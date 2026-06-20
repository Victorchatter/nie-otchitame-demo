import { Metrics as MetricsData } from '../types';

interface MetricsProps {
  metrics: MetricsData | null;
  loading?: boolean;
  error?: string | null;
}

function formatCurrency(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatCount(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '—';
  return value.toString();
}

export default function Metrics({ metrics, loading, error }: MetricsProps) {
  return (
    <section className="metrics" aria-label="Aggregated metrics">
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Reports</span>
          <strong className="metric-value" data-testid="metric-count">
            {loading ? '...' : formatCount(metrics?.total_count)}
          </strong>
        </div>

        <div className="metric-card">
          <span className="metric-label">Total Amount</span>
          <strong className="metric-value" data-testid="metric-total">
            {loading ? '...' : formatCurrency(metrics?.total_amount)}
          </strong>
        </div>

        <div className="metric-card approved">
          <span className="metric-label">Approved</span>
          <strong className="metric-value" data-testid="metric-approved">
            {loading ? '...' : formatCurrency(metrics?.approved_amount)}
          </strong>
        </div>

        <div className="metric-card submitted">
          <span className="metric-label">Submitted</span>
          <strong className="metric-value" data-testid="metric-submitted">
            {loading ? '...' : formatCurrency(metrics?.submitted_amount)}
          </strong>
        </div>

        <div className="metric-card draft">
          <span className="metric-label">Draft</span>
          <strong className="metric-value" data-testid="metric-draft">
            {loading ? '...' : formatCurrency(metrics?.draft_amount)}
          </strong>
        </div>
      </div>

      {error && <div className="metrics-error" role="alert">{error}</div>}
    </section>
  );
}
