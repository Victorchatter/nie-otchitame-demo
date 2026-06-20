import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from './api/client';
import { Report, ReportCreate, Metrics } from './types';
import MetricsPanel from './components/Metrics';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';

const MOCK_MODE =
  import.meta.env.VITE_MOCK_API === 'true' ||
  (import.meta.env.PROD && !import.meta.env.VITE_API_URL);

const mockReports: Report[] = [
  {
    id: 1,
    title: 'Q2 Revenue',
    report_type: 'revenue',
    amount: 25000.0,
    date: '2026-04-15',
    status: 'approved',
    created_at: '2026-04-15T10:00:00Z',
    updated_at: '2026-04-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Office Rent',
    report_type: 'expense',
    amount: 1200.0,
    date: '2026-05-01',
    status: 'submitted',
    created_at: '2026-05-01T10:00:00Z',
    updated_at: '2026-05-01T10:00:00Z',
  },
];

const mockMetrics: Metrics = {
  total_count: 2,
  total_amount: 26200.0,
  by_type: { revenue: 1, expense: 1, project: 0, hr: 0 },
  by_status: { draft: 0, submitted: 1, approved: 1 },
};

export default function App() {
  const [reports, setReports] = useState<Report[]>(MOCK_MODE ? mockReports : []);
  const [metrics, setMetrics] = useState<Metrics | null>(MOCK_MODE ? mockMetrics : null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (MOCK_MODE) return;
    setLoadingReports(true);
    try {
      const data = await api.listReports();
      setReports(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingReports(false);
    }
  }, []);

  const fetchMetrics = useCallback(async () => {
    if (MOCK_MODE) return;
    setLoadingMetrics(true);
    try {
      const data = await api.getMetrics();
      setMetrics(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      setError(`API error ${err.status}: ${err.message}`);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred.');
    }
  };

  useEffect(() => {
    fetchReports();
    fetchMetrics();
  }, [fetchReports, fetchMetrics]);

  const handleCreateOrUpdate = async (data: ReportCreate) => {
    setLoadingForm(true);
    setError(null);
    try {
      if (MOCK_MODE) {
        if (editingReport) {
          setReports((prev) =>
            prev.map((r) =>
              r.id === editingReport.id
                ? { ...r, ...data, updated_at: new Date().toISOString() }
                : r
            )
          );
        } else {
          const newReport: Report = {
            ...data,
            id: Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setReports((prev) => [...prev, newReport]);
          setMetrics((prev) =>
            prev
              ? {
                  ...prev,
                  total_count: prev.total_count + 1,
                  total_amount: prev.total_amount + Number(data.amount || 0),
                  by_type: {
                    ...prev.by_type,
                    [data.report_type]: prev.by_type[data.report_type] + 1,
                  },
                  by_status: {
                    ...prev.by_status,
                    [data.status]: prev.by_status[data.status] + 1,
                  },
                }
              : prev
          );
        }
        setEditingReport(null);
      } else {
        if (editingReport) {
          await api.updateReport(editingReport.id, data);
        } else {
          await api.createReport(data);
        }
        setEditingReport(null);
        await fetchReports();
        await fetchMetrics();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingForm(false);
    }
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Delete report #${id}?`)) return;
    setLoadingReports(true);
    setError(null);
    try {
      if (MOCK_MODE) {
        const removed = reports.find((r) => r.id === id);
        setReports((prev) => prev.filter((r) => r.id !== id));
        if (removed && metrics) {
          setMetrics({
            ...metrics,
            total_count: metrics.total_count - 1,
            total_amount: metrics.total_amount - Number(removed.amount || 0),
            by_type: {
              ...metrics.by_type,
              [removed.report_type]: Math.max(
                0,
                metrics.by_type[removed.report_type] - 1
              ),
            },
            by_status: {
              ...metrics.by_status,
              [removed.status]: Math.max(0, metrics.by_status[removed.status] - 1),
            },
          });
        }
      } else {
        await api.deleteReport(id);
        await fetchReports();
        await fetchMetrics();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingReports(false);
    }
  };

  return (
    <div className="app" data-testid="dashboard">
      <header className="app-header">
        <h1>Nie Otchitame Dashboard</h1>
        <span className="subtitle">Reporting module</span>
      </header>

      <main className="app-main">
        <MetricsPanel metrics={metrics} loading={loadingMetrics} error={null} />

        {error && (
          <div className="global-error" role="alert">
            {error}
            <button
              className="btn-icon"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          <aside className="form-panel">
            <ReportForm
              report={editingReport}
              onSubmit={handleCreateOrUpdate}
              onCancel={handleCancelEdit}
              loading={loadingForm}
            />
          </aside>

          <section className="list-panel">
            <ReportList
              reports={reports}
              loading={loadingReports}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Nie Otchitame demo — frontend agent build.{MOCK_MODE && ' (demo mode)'}</p>
      </footer>
    </div>
  );
}
