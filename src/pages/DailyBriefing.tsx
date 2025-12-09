import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export default function DailyBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateBriefing();
  }, []);

  const generateBriefing = async () => {
    setLoading(true);
    try {
      // Fetch user stats
      const sessionsSnap = await getDocs(collection(db, 'focus_sessions'));
      const tasksSnap = await getDocs(collection(db, 'weekly_tasks'));
      const habitsSnap = await getDocs(collection(db, 'habit_checkins'));

      const sessions = sessionsSnap.size;
      const tasks = tasksSnap.size;
      const habits = habitsSnap.size;

      // Generate briefing text
      const briefingText = `
Good Morning! 📊 Here's your Daily Briefing:

📈 Your Stats:
- Focus Sessions Completed: ${sessions}
- Weekly Tasks: ${tasks}
- Habit Check-ins: ${habits}

🎯 Today's Focus:
Complete at least 2 focus sessions today and check in on your habits.

💡 Tip:
Start your day with the most important task first. Use the Focus Timer to maintain deep work.

✨ You've got this!
      `.trim();

      setBriefing(briefingText);

      // Log briefing view
      await addDoc(collection(db, 'briefing_views'), {
        viewedAt: Timestamp.now(),
      });
    } catch (error) {
      setBriefing('Error generating briefing. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Daily Briefing</h2>
      {loading ? (
        <p>Generating your briefing...</p>
      ) : (
        <>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {briefing}
          </div>
          <button onClick={generateBriefing} style={{ marginTop: 16, width: '100%' }}>
            Refresh Briefing
          </button>
        </>
      )}
    </div>
  );
}
