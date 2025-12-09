import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit, addDoc, Timestamp } from 'firebase/firestore';

export default function Dashboard() {
  const [totalSessions, setTotalSessions] = useState(0);
  const [lastSession, setLastSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [habitChecked, setHabitChecked] = useState(false);
  const [habitDates, setHabitDates] = useState<string[]>([]);
  const [productivityScore, setProductivityScore] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const snap = await getDocs(collection(db, 'focus_sessions'));
      const totalSessions = snap.size;
      setTotalSessions(totalSessions);
      const habitSnap = await getDocs(collection(db, 'habit_checkins'));
      const score = Math.min(100, totalSessions * 10 + habitSnap.size * 5);
      setProductivityScore(score);
      const lastQ = query(collection(db, 'focus_sessions'), orderBy('completedAt', 'desc'), limit(1));
      const lastSnap = await getDocs(lastQ);
      if (!lastSnap.empty) {
        const ts = lastSnap.docs[0].data().completedAt;
        setLastSession(ts?.toDate().toLocaleString() || null);
      } else {
        setLastSession(null);
      }
      const dates = habitSnap.docs.map(doc => doc.data().date);
      setHabitDates(dates);
      setHabitChecked(dates.includes(new Date().toLocaleDateString()));
      setLoading(false);
    }
    fetchStats();
  }, []);

  const checkInHabit = async () => {
    await addDoc(collection(db, 'habit_checkins'), {
      date: new Date().toLocaleDateString(),
      checkedAt: Timestamp.now(),
    });
    setHabitChecked(true);
    setHabitDates([...habitDates, new Date().toLocaleDateString()]);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
      <h2>Productivity Dashboard</h2>
      {loading ? <p>Loading...</p> : (
        <>
          <div>Total Focus Sessions: <b>{totalSessions}</b></div>
          <div>Last Session: <b>{lastSession || 'N/A'}</b></div>
          <div style={{ marginTop: 24 }}>
            <h3>Daily Habit Tracker</h3>
            <button onClick={checkInHabit} disabled={habitChecked} style={{ marginBottom: 8 }}>
              {habitChecked ? 'Checked In Today!' : 'Check In'}
            </button>
            <div>Streak: <b>{habitDates.length}</b> days</div>
            <div style={{ fontSize: 12, color: '#888' }}>Last check-in: {habitDates[habitDates.length - 1] || 'N/A'}</div>
          </div>
          <div style={{ marginTop: 24, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
            <h3>Productivity Score</h3>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#4CAF50' }}>{productivityScore}/100</div>
            <div style={{ fontSize: 12, color: '#888' }}>Keep going! Stay consistent.</div>
          </div>
        </>
      )}
    </div>
  );
}