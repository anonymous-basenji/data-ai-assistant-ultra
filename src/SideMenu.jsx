import React from 'react';
import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './SideMenu.css';

function SideMenu() {
    const [chats, setChats] = useState([]);

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
            <h2>My Chats</h2>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id}>
                        {chat.title}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default SideMenu;