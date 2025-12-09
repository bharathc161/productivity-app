import './App.css';
import { useState, useEffect, Suspense, lazy } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from './firebase';

// Lazy-load page components to reduce initial bundle size
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FocusTimer = lazy(() => import('./pages/FocusTimer'));
const PerformancePlanner = lazy(() => import('./pages/PerformancePlanner'));
const AccountabilityCoach = lazy(() => import('./pages/AccountabilityCoach'));
const FocusMusic = lazy(() => import('./pages/FocusMusic'));
const DailyBriefing = lazy(() => import('./pages/DailyBriefing'));
const Reflection = lazy(() => import('./pages/Reflection'));
const HabitTracker = lazy(() => import('./pages/HabitTracker'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Reports = lazy(() => import('./pages/Reports'));
const FirestoreDemo = lazy(() => import('./pages/FirestoreDemo'));
const AuthScreen = lazy(() => import('./pages/AuthScreen'));

const SCREEN_NAMES = [
  'Dashboard',
  'Focus Timer',
  'Performance Planner',
  'Accountability Coach',
  'Focus Music',
  'Daily Briefing',
  'Reflection',
  'Habit Tracker',
  'Analytics',
  'Settings',
  'Notifications',
  'Reports',
  'Firestore Demo',
];

const components = [
  Dashboard,
  FocusTimer,
  PerformancePlanner,
  AccountabilityCoach,
  FocusMusic,
  DailyBriefing,
  Reflection,
  HabitTracker,
  Analytics,
  Settings,
  Notifications,
  Reports,
  FirestoreDemo,
];

function App() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AuthScreen onAuthSuccess={() => {
          const auth = getAuth(app);
          setUser(auth.currentUser);
        }} />
      </Suspense>
    );
  }

  const Active = components[activeScreen];

  return (
    <div className="App">
      <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {SCREEN_NAMES.map((name, idx) => (
          <button key={name} onClick={() => setActiveScreen(idx)}>
            {name}
          </button>
        ))}
        <button style={{ marginLeft: 'auto' }} onClick={() => signOut(getAuth(app))}>Sign Out</button>
      </nav>
      <div style={{ padding: 24 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Active />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
