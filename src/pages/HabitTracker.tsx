import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

export default function HabitTracker() {
  const [habitName, setHabitName] = useState('');
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'habits'));
    setHabits(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const addHabit = async () => {
    if (!habitName.trim()) return;
    setLoading(true);
    await addDoc(collection(db, 'habits'), {
      name: habitName,
      createdAt: Timestamp.now(),
      completed: 0,
    });
    setHabitName('');
    fetchHabits();
    setLoading(false);
  };

  const deleteHabit = async (id: string) => {
    setLoading(true);
    await deleteDoc(doc(db, 'habits', id));
    fetchHabits();
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Habit Tracker</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={habitName}
          onChange={e => setHabitName(e.target.value)}
          placeholder="Add a new habit (e.g., Exercise, Meditate)"
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button onClick={addHabit} disabled={loading} style={{ width: '100%' }}>
          Add Habit
        </button>
      </div>
      <div>
        <h3>Your Habits</h3>
        {habits.length === 0 ? (
          <p style={{ color: '#888' }}>No habits yet. Create one to get started!</p>
        ) : (
          habits.map(habit => (
            <div key={habit.id} style={{ padding: 12, background: '#f9f9f9', marginBottom: 8, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{habit.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>Created: {habit.createdAt?.toDate().toLocaleDateString()}</div>
              </div>
              <button onClick={() => deleteHabit(habit.id)} style={{ padding: '4px 8px', background: '#f44336', color: 'white' }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
