import { Analytics } from "@vercel/analytics/react" // Vercel Analytics
import { useState, useEffect, useRef } from 'react';
import { auth, provider, db } from './firebase';
import { signInWithPopup, getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import './App.css';
import ChatBubble from './ChatBubble';
import SideMenu from './SideMenu';
import GoogleSignInButton from "./GoogleSignInButton";

function App() {
  const [user, setUser] = useState(null);
  const [inputValue, updateInputValue] = useState('');
  const [chatHistory, updateChatHistory] = useState([]);
  const [isLoading, setLoadingStatus] = useState(false);
  const [error, setError] = useState('');
  const [lastPrompt, setLastPrompt] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);

  const streamingMessageRef = useRef('');
  const chatHistoryRef = useRef(null);


  const handleSignIn = async() => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch(e) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      console.error('Google Sign-In Error:', errorCode, errorMessage, email);
    }
  };

  const handleSignOut = async() => {
    const auth = getAuth();
    signOut(auth).catch((error) => {
      console.error("Sign out error:", error);
      setError("Failed to sign out.");
    })
    console.log("Succesfully signed out user");
    console.log("Current user:", user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if(!currentUser) { // if currentUser null (user logged out)
        setUser(currentUser);
        updateChatHistory([]);
      }
      
    });

    return () => unsubscribe();
  }, [user]);

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
      });

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

      saveOrUpdateChat(chatHistory);
    }
  }

  const saveOrUpdateChat = (messages) => {
    if(!activeChatId) {
      const currDoc = addDoc(collection(db, 'users', auth.currentUser.uid, 'chats'), {
        title: 'Sample title',
        messages: messages,
        timestamp: Date.now()
      });
      setActiveChatId(currDoc.id);
    } else {
      updateDoc(doc(db, 'users', auth.currentUser.uid, 'chats', activeChatId), {
        messages: messages
      })
    }
  }

  const loadChat = (chat) => {
    updateChatHistory(chat.messages);
    setActiveChatId(chat.id);
  }

  return (
    <div className='app-container'>
      <div className='top-bar'>
        <SideMenu onSelectChat={loadChat}/>
        <p className='app-title'><strong>Data AI</strong></p>
        {user ? (
          <div className='account-info'>
            <img src={user.photoURL}></img>
            <p>{user.displayName}</p>
            <button className='account-button' onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (
          <button className='account-button' onClick={handleSignIn}>Sign in with Google</button>
        )}
      </div>
      {user ? (
        <div className='main-content'>
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
      ) : (
        <div className='welcome-screen'>
          <h1>Data AI</h1>
          <h3>Asking the deep questions about humanity.</h3>
          <button className='main-sign-in-btn' onClick={handleSignIn}>Sign in to start chatting</button>
        </div>
      )}
      
      <Analytics />
    </div>
  );
}

export default App;
