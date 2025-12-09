import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

export default function PerformancePlanner() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const saveTask = async () => {
    if (!task) return;
    setLoading(true);
    await addDoc(collection(db, 'weekly_tasks'), {
      name: task,
      createdAt: Timestamp.now(),
    });
    setTask('');
    fetchTasks();
    setLoading(false);
  };

  const fetchTasks = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'weekly_tasks'));
    setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
      <h2>Weekly Performance Planner</h2>
      <input
        type="text"
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Add a task for this week"
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button onClick={saveTask} disabled={loading} style={{ width: '100%' }}>
        Add Task
      </button>
      <ul style={{ marginTop: 16 }}>
        {tasks.map(t => (
          <li key={t.id}>{t.name} <span style={{ color: '#888', fontSize: 12 }}>({t.createdAt?.toDate().toLocaleDateString()})</span></li>
        ))}
      </ul>
    </div>
  );
}