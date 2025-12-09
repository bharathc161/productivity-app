import { useState } from 'react';

export default function AccountabilityCoach() {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'coach', text: 'Hi! I am your productivity coach. What did you achieve today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // Check if API key is configured
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        setMessages(prev => [...prev, { 
          sender: 'coach', 
          text: 'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to .env.local' 
        }]);
        setLoading(false);
        return;
      }

      // Call OpenAI API via proxy endpoint (backend recommended for production)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a supportive and motivational productivity coach. Provide brief, actionable advice.' },
            ...messages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { sender: 'coach', text: `Error: ${data.error.message}` }]);
      } else {
        const coachMessage = data.choices[0].message.content;
        setMessages(prev => [...prev, { sender: 'coach', text: coachMessage }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'coach', text: 'Error connecting to AI. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Accountability Coach</h2>
      <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, minHeight: 300, marginBottom: 12, overflow: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ background: msg.sender === 'user' ? '#e0f7fa' : '#f1f8e9', padding: '8px 12px', borderRadius: 16, display: 'inline-block', maxWidth: '80%' }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div style={{ textAlign: 'left', margin: '8px 0' }}>Coach is thinking...</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your update..."
          style={{ flex: 1 }}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}