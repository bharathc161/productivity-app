import { useState } from 'react';

const tracks = [
  { name: 'Deep Focus', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Calm Productivity', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: 'Brainwave Boost', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function FocusMusic() {
  const [current, setCurrent] = useState(0);
  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
      <h2>Focus Music</h2>
      <div style={{ marginBottom: 16 }}>
        {tracks.map((track, idx) => (
          <button key={track.name} onClick={() => setCurrent(idx)} style={{ marginRight: 8 }}>
            {track.name}
          </button>
        ))}
      </div>
      <audio controls autoPlay src={tracks[current].url} style={{ width: '100%' }}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
