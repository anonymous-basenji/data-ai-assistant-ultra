import React from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import './GoogleSignInButton.css';

function GoogleSignInButton() {
    const handleGoogleSignIn = async() => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Successfully signed in with Google!', user);
        } catch(e) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData?.email;
            console.error('Google Sign-In Error:', errorCode, errorMessage, email);
        }
    }

    return(
        <button onClick={handleGoogleSignIn}>
            Sign in with Google
        </button>
    );
}

export default GoogleSignInButton;