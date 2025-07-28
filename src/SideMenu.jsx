import React from 'react';
import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import './SideMenu.css';

function SideMenu({ onSelectChat }) {
    const [chats, setChats] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const deleteChat = async(chatId) => {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'chats', chatId);

        await deleteDoc(docRef);
    }

    useEffect(() => {
        if(auth.currentUser) {
            const q = query(collection(db, 'users', auth.currentUser.uid, 'chats'), orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chatsData = [];
                querySnapshot.forEach((doc) => {
                    chatsData.push({ id: doc.id, ...doc.data() });
                });
                setChats(chatsData);
            })

            return () => unsubscribe();
        }
    }, [auth.currentUser]);

    return(
        <aside>
            <button className='hamburger-btn' onClick={toggleMenu}>&#9776;</button>
            <div className={isMenuOpen ? 'side-menu open' : 'side-menu'}>
                <h2>My Chats</h2>
                {
                    chats.length === 0 ? (
                        <p>Nothing to see here (yet)</p>
                    ) : (
                    <ul>
                        {chats.map((chat) => (
                            <li key={chat.id} onClick={() => onSelectChat(chat)}>
                                {chat.title}
                                <button className='delete-btn' onClick={() => deleteChat(chat.id)}>🗑️</button>
                            </li>
                        ))}
                    </ul>
                    )
                }
            </div>
        </aside>
    );
}

export default SideMenu;