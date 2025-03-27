"use client"
import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { app } from '@/config/firebaseConfig';

const provider = new GoogleAuthProvider();

export default function page() {
    const auth = getAuth(app);

    let handleGoogleLogin = () => {
        console.log("login with goole btn clicked");
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                console.log(token);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    let handleGoogleSignOut = () => {
        console.log("sign out with google clicked");
        console.log(auth.currentUser);
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign out successful")
        }).catch((error) => {
            // An error happened.
            console.log("Error occured whle sign out using google");
        });
    }
    return (
        <div>
            <button onClick={handleGoogleLogin} className="bg-blue-500 text-white w-[150px] py-[5px]">Login with Google</button>
            <button onClick={handleGoogleSignOut} className="bg-red-500 text-white w-[150px] py-[5px]">Sign Out</button>
        </div>
    )
}
