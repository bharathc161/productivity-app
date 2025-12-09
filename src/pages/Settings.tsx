import { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import app from '../firebase';

export default function Settings() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [goal, setGoal] = useState('Improve productivity');
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating profile');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
      <h2>Settings & Profile</h2>

      <div style={{ marginBottom: 24 }}>
        <h3>Account Info</h3>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <div style={{ background: '#f0f0f0', padding: 8, borderRadius: 4, marginTop: 4 }}>
            {user?.email}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            style={{ width: '100%', marginTop: 4 }}
          />
        </div>

        <button onClick={updateUserProfile} disabled={loading} style={{ width: '100%' }}>
          Update Profile
        </button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>Productivity Goal</h3>
        <textarea
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="What's your main productivity goal?"
          style={{ width: '100%', height: 80, padding: 8, marginTop: 4 }}
        />
        <button style={{ width: '100%', marginTop: 8 }}>Save Goal</button>
      </div>

      <div>
        <h3>Preferences</h3>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <input type="checkbox" defaultChecked style={{ marginRight: 8 }} />
          Daily notifications
        </label>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <input type="checkbox" defaultChecked style={{ marginRight: 8 }} />
          Email reminders
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" style={{ marginRight: 8 }} />
          Dark mode
        </label>
      </div>

      <div style={{ marginTop: 32, padding: 12, background: '#f9f9f9', borderRadius: 4 }}>
        <p style={{ fontSize: 12, color: '#888' }}>
          Version 1.0.0 | Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
