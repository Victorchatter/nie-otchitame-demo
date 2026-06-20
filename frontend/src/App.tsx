import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from './api/client';
import { Report, ReportCreate, Metrics } from './types';
import MetricsPanel from './components/Metrics';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
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
      if (editingReport) {
        await api.updateReport(editingReport.id, data);
      } else {
        await api.createReport(data);
      }
      setEditingReport(null);
      await fetchReports();
      await fetchMetrics();
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
      await api.deleteReport(id);
      await fetchReports();
      await fetchMetrics();
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
        <p>Nie Otchitame demo — frontend agent build.</p>
      </footer>
    </div>
  );
}
