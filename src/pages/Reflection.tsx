import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export default function Reflection() {
  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState('neutral');
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'reflections'));
    setReflections(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const saveReflection = async () => {
    if (!reflection.trim()) return;
    setLoading(true);
    await addDoc(collection(db, 'reflections'), {
      text: reflection,
      mood: mood,
      createdAt: Timestamp.now(),
    });
    setReflection('');
    setMood('neutral');
    fetchReflections();
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Evening Reflection</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>How are you feeling?</label>
        <select value={mood} onChange={e => setMood(e.target.value)} style={{ width: '100%', padding: 8 }}>
          <option value="great">Great 😊</option>
          <option value="good">Good 🙂</option>
          <option value="neutral">Neutral 😐</option>
          <option value="tired">Tired 😴</option>
          <option value="stressed">Stressed 😟</option>
        </select>
      </div>
      <textarea
        value={reflection}
        onChange={e => setReflection(e.target.value)}
        placeholder="Reflect on your day... What did you accomplish? What could be better?"
        style={{ width: '100%', height: 120, padding: 8, marginBottom: 8, borderRadius: 4, border: '1px solid #ddd' }}
      />
      <button onClick={saveReflection} disabled={loading} style={{ width: '100%' }}>
        Save Reflection
      </button>
      <div style={{ marginTop: 24 }}>
        <h3>Past Reflections</h3>
        {reflections.map(r => (
          <div key={r.id} style={{ padding: 8, background: '#f9f9f9', marginBottom: 8, borderRadius: 4 }}>
            <div style={{ fontSize: 12, color: '#888' }}>{r.createdAt?.toDate().toLocaleDateString()}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{r.text}</div>
            <div style={{ fontSize: 12, color: '#667eea', marginTop: 4 }}>Mood: {r.mood}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
