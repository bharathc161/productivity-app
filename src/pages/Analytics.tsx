import { useState, useEffect, Suspense, lazy } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AnalyticsCharts = lazy(() => import('./AnalyticsCharts'));

export default function Analytics() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [habitData, setHabitData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch focus sessions
      const sessionsSnap = await getDocs(collection(db, 'focus_sessions'));
      const sessions = sessionsSnap.docs.map(doc => doc.data());

      // Group sessions by date
      const sessionsByDate: { [key: string]: number } = {};
      sessions.forEach(session => {
        const date = session.completedAt?.toDate().toLocaleDateString() || 'Unknown';
        sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
      });

      const chartData = Object.entries(sessionsByDate)
        .slice(-7) // Last 7 days
        .map(([date, count]) => ({ date, sessions: count }));
      setChartData(chartData);

      // Fetch habits
      const habitsSnap = await getDocs(collection(db, 'habits'));
      const habits = habitsSnap.docs.map(doc => doc.data());
      const habitData = habits.map((habit) => ({
        name: habit.name,
        value: Math.floor(Math.random() * 100), // Placeholder completion percentage
      }));
      setHabitData(habitData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  // Colors are defined inside the lazily-loaded charts component

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <h2>Analytics Dashboard</h2>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          <Suspense fallback={<div>Loading charts...</div>}>
            <AnalyticsCharts chartData={chartData} habitData={habitData} />
          </Suspense>

          <button onClick={fetchAnalytics} style={{ width: '100%', marginTop: 16 }}>
            Refresh Analytics
          </button>
        </>
      )}
    </div>
  );
}
