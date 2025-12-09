import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function FirestoreDemo() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const saveTask = async () => {
    if (!task) return;
    setLoading(true);
    await addDoc(collection(db, 'tasks'), { name: task });
    setTask('');
    setLoading(false);
    fetchTasks();
  };

  const fetchTasks = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, 'tasks'));
    setTasks(snapshot.docs.map(doc => doc.data().name));
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 320, margin: 'auto', padding: 24 }}>
      <h3>Firestore Demo: Save & List Tasks</h3>
      <input
        type="text"
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Enter a task"
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button onClick={saveTask} disabled={loading} style={{ width: '100%' }}>
        Save Task
      </button>
      <button onClick={fetchTasks} disabled={loading} style={{ width: '100%', marginTop: 8 }}>
        Load Tasks
      </button>
      <ul>
        {tasks.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
