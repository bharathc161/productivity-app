import { useState, useEffect } from 'react';
import { db } from '../firebase';

import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
export default function Notifications() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const remindersRef = collection(db, 'reminders');
      const snap = await getDocs(remindersRef);
      setReminders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
    setLoading(false);
  };

  const addReminder = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'reminders'), {
        title,
        time,
        createdAt: Timestamp.now(),
        enabled: true,
      });
      setTitle('');
      setTime('09:00');
      fetchReminders();
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
    setLoading(false);
  };

  const deleteReminder = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'reminders', id));
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
    setLoading(false);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Notifications Enabled!', {
          body: 'You will receive reminders for your productivity tasks.',
          icon: '🔔',
        });
      }
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Notifications & Reminders</h2>

      <button onClick={requestNotificationPermission} style={{ width: '100%', marginBottom: 16, background: '#4CAF50' }}>
        Enable Browser Notifications
      </button>

      <div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
        <h3>Add New Reminder</h3>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g., Take a 5-minute break"
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button onClick={addReminder} disabled={loading} style={{ width: '100%' }}>
          Add Reminder
        </button>
      </div>

      <div>
        <h3>Your Reminders</h3>
        {reminders.length === 0 ? (
          <p style={{ color: '#888' }}>No reminders set yet.</p>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} style={{ padding: 12, background: '#f9f9f9', marginBottom: 8, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{reminder.title}</div>
                <div style={{ fontSize: 12, color: '#888' }}>⏰ {reminder.time}</div>
              </div>
              <button onClick={() => deleteReminder(reminder.id)} style={{ padding: '4px 8px', background: '#f44336', color: 'white' }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 24, padding: 12, background: '#e3f2fd', borderRadius: 4 }}>
        <p style={{ fontSize: 12 }}>💡 Tip: Set reminders for focus sessions, breaks, and reflection time to stay on track.</p>
      </div>
    </div>
  );
}
