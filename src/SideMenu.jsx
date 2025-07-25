import React from 'react';
import { auth } from './firebase';
import './SideMenu.css';

function SideMenu() {
    const [chats, setChats] = useState([]);
    const chatQuery = query(collection('users', ))

    return(
        <aside>
            <h2>My Chats</h2>
        </aside>
    );
}

export default SideMenu;