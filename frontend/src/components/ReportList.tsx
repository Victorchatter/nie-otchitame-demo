import { Report } from '../types';

interface ReportListProps {
  reports: Report[];
  loading?: boolean;
  onEdit: (report: Report) => void;
  onDelete: (id: number) => void;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
  }).format(amount);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('bg-BG');
}

export default function ReportList({
  reports,
  loading,
  onEdit,
  onDelete,
}: ReportListProps) {
  return (
    <section className="report-list" aria-label="Reports">
      <div className="section-header">
        <h2>Reports</h2>
        {loading && <span className="loading-pill">Loading...</span>}
      </div>

      {reports.length === 0 ? (
        <div className="empty-state" data-testid="empty-reports">
          No reports yet. Add one using the form.
        </div>
      ) : (
        <div className="table-wrapper">
          <table data-testid="reports-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} data-testid={`report-row-${report.id}`}>
                  <td>{report.id}</td>
                  <td>{report.title}</td>
                  <td>
                    <span className={`badge type-${report.report_type}`}>
                      {report.report_type}
                    </span>
                  </td>
                  <td>{formatAmount(report.amount)}</td>
                  <td>{formatDate(report.date)}</td>
                  <td>
                    <span className={`badge status-${report.status}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => onEdit(report)}
                      aria-label={`Edit report ${report.id}`}
                      data-testid={`edit-report-${report.id}`}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => onDelete(report.id)}
                      aria-label={`Delete report ${report.id}`}
                      data-testid={`delete-report-${report.id}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
