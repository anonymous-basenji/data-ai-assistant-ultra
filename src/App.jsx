import { Analytics } from "@vercel/analytics/next" // Vercel Analytics
import { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatBubble from './ChatBubble';
import { GoogleGenAI } from '@google/genai';

function App() {
  const [inputValue, updateInputValue] = useState('');
  const [chatHistory, updateChatHistory] = useState([]);
  const [isLoading, setLoadingStatus] = useState(false);
  const [error, setError] = useState('');
  const [lastPrompt, setLastPrompt] = useState(null);

  const streamingMessageRef = useRef('');
  const chatHistoryRef = useRef(null);

  const streamResponse = async() => {
    if(!lastPrompt || isLoading) return;
    if(chatHistory.length === 0 || chatHistory[chatHistory.length - 1].role !== 'user') return;

    setLoadingStatus(true);
    setError('');
    streamingMessageRef.current = '';

    try {
      const response = await fetch(import.meta.env.DEV ? 'http://localhost:3001/api/generate' : '/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: chatHistory })
      })

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while(true) {
        const { value, done } = await reader.read();
        if(done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        
        for(const line of lines) {
          const json = JSON.parse(line.replace('data: ', ''));
          const chunkText = json.text;

          streamingMessageRef.current += chunkText;

          updateChatHistory(prev => {
            const lastMessage = prev[prev.length - 1];

            if(lastMessage && lastMessage.role === 'model') {
              const newHistory = [...prev];
              newHistory[newHistory.length - 1].parts[0].text = streamingMessageRef.current;
              return newHistory;
            } else {
              return [...prev, {
                id: Date.now(),
                role: 'model',
                parts: [{ text: chunkText }]
              }];
            }
          })
          if(chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
          }
        }
      }
    } catch(e) {
      console.error('Error:', e);
      setError('Something went wrong.');
    } finally {
      setLoadingStatus(false);
      setLastPrompt(null);
    }
  }

  useEffect(() => {
    streamResponse();
  }, [lastPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!isLoading) {
      if(inputValue.trim() === '') {
        updateInputValue('');
        return;
      }

      const userMessage = {id: Date.now(), role: 'user', parts: [{text: inputValue}]}

      updateChatHistory([...chatHistory, userMessage]);
      setLastPrompt(userMessage);
      updateInputValue('');
    }
  }

  return (
    <div>
      <div className='chat-history' ref={chatHistoryRef}>
        {
          chatHistory.map(chatBubble => (
            <ChatBubble key={chatBubble.id} role={chatBubble.role} message={chatBubble.parts[0].text}/>
          ))
        }
      </div>
      <form className='submit-form' onSubmit={handleSubmit}>
        <input name='chat-input' className='chat-input' type='text' placeholder='Chat with Data' value={inputValue} onChange={(e) => updateInputValue(e.target.value)}></input>
        <button className='submit-btn' type='submit'>Send</button>
      </form>
      <div className='disclaimer'>
        <p><strong>Chats are not private. Do not enter private/confidential information.</strong></p>
      </div>
    </div>
  );
}

export default App;
