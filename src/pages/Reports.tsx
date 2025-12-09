import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Reports() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTasks: 0,
    totalHabits: 0,
    totalReflections: 0,
    avgSessionsPerDay: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const sessionsSnap = await getDocs(collection(db, 'focus_sessions'));
      const tasksSnap = await getDocs(collection(db, 'weekly_tasks'));
      const habitsSnap = await getDocs(collection(db, 'habits'));
      const reflectionsSnap = await getDocs(collection(db, 'reflections'));

      const totalSessions = sessionsSnap.size;
      const totalTasks = tasksSnap.size;
      const totalHabits = habitsSnap.size;
      const totalReflections = reflectionsSnap.size;

      // Estimate days (rough calculation)
      const days = Math.max(1, Math.ceil(totalReflections || totalSessions / 3) || 7);
      const avgSessionsPerDay = (totalSessions / days).toFixed(1);

      setStats({
        totalSessions,
        totalTasks,
        totalHabits,
        totalReflections,
        avgSessionsPerDay: parseFloat(avgSessionsPerDay as string),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `productivity-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const exportAsCSV = () => {
    const csv = `Productivity Report\nDate: ${new Date().toLocaleDateString()}\n\nMetric,Value\nTotal Focus Sessions,${stats.totalSessions}\nTotal Tasks,${stats.totalTasks}\nTotal Habits,${stats.totalHabits}\nTotal Reflections,${stats.totalReflections}\nAvg Sessions/Day,${stats.avgSessionsPerDay}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `productivity-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const printReport = () => {
    const printWindow = window.open('', '', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>Productivity Report</title></head><body>
        <h1>Productivity Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table border="1" cellpadding="10">
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Total Focus Sessions</td><td>${stats.totalSessions}</td></tr>
          <tr><td>Total Tasks</td><td>${stats.totalTasks}</td></tr>
          <tr><td>Total Habits</td><td>${stats.totalHabits}</td></tr>
          <tr><td>Total Reflections</td><td>${stats.totalReflections}</td></tr>
          <tr><td>Avg Sessions/Day</td><td>${stats.avgSessionsPerDay}</td></tr>
        </table>
        </body></html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Productivity Reports</h2>

      {loading ? (
        <p>Loading report data...</p>
      ) : (
        <>
          <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8, marginBottom: 24 }}>
            <h3>Summary Statistics</h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold' }}>Total Focus Sessions:</span> {stats.totalSessions}
              </div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold' }}>Total Tasks:</span> {stats.totalTasks}
              </div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold' }}>Total Habits:</span> {stats.totalHabits}
              </div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold' }}>Total Reflections:</span> {stats.totalReflections}
              </div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold' }}>Avg Sessions/Day:</span> {stats.avgSessionsPerDay}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button onClick={exportAsJSON} style={{ background: '#2196F3' }}>
              Export JSON
            </button>
            <button onClick={exportAsCSV} style={{ background: '#4CAF50' }}>
              Export CSV
            </button>
          </div>

          <button onClick={printReport} style={{ width: '100%', marginTop: 8 }}>
            Print Report
          </button>

          <div style={{ marginTop: 24, padding: 12, background: '#e3f2fd', borderRadius: 4 }}>
            <p style={{ fontSize: 12 }}>📊 Use these reports to track your progress and identify productivity trends over time.</p>
          </div>
        </>
      )}
    </div>
  );
}
