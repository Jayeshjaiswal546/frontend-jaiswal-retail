const { app } = require("@/config/firebaseConfig");
const { signInWithPopup, GoogleAuthProvider, getAuth, signOut } = require("firebase/auth");
const { success, error } = require("./notifyUser");
const { default: axios } = require("axios");
const { backendBaseUrl } = require("../api/api");
const { addUserToken } = require("../redux/reducers/userSlice");
const { setCart,addToCart } = require("../redux/reducers/cartSlice");

const provider = new GoogleAuthProvider();


exports.handleGoogleSignup = (toast) => {
    console.log("Signup with google btn clicked");
    const auth = getAuth(app);

    signInWithPopup(auth, provider)
        .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(user);
            console.log(token);
            let tempObj = await {
                "name": user.displayName,
                "email": user.email,
                "password": token,
                "isEmailVerified": user.emailVerified
            }

            console.log(tempObj);

            axios.post(`${backendBaseUrl}/user/register-with-google`, tempObj)
                .then(res => res.data)
                .then(finalRes => {
                    console.log(finalRes);
                    if (finalRes.status) {
                        success(toast, <div><h1>Hello {tempObj.name},</h1><h2><b>{finalRes.message}</b></h2></div>);
                    } else {
                        error(toast, <div><h1>{finalRes.message}</h1><h2><b>Please try login instead</b></h2></div>)
                    }

                    // router.push(`/auth/please-verify-email/${encodeURIComponent(formDataObject.email)}`);
                })
                .then(() => {
                    console.log(auth.currentUser);
                    signOut(auth).then(() => {
                        // Sign-out successful.
                        console.log("After registration auth set to null successfully")
                    }).catch((error) => {
                        // An error happened.
                        console.log("Error occured whle clearing auth");
                    });
                })
                .catch((error) => {
                    console.log("Something went xrong");
                    // setRegisterBtnClicked(false);
                })
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


exports.handleLoginWithGoogle = (toast,dispatch,router,setRedirectCount) => {
    console.log("Login with google clicked");
    const auth = getAuth(app);

    signInWithPopup(auth, provider)
        .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(user);

            axios.post(`${backendBaseUrl}/user/login-with-google`, { "email": user.email })
                .then(res => res.data)
                .then(finalRes => {
                    console.log(finalRes);
                    if (finalRes.status) {
                        success(toast, <div><h1>{finalRes.message}</h1><h2><b>Welcome {finalRes.name}</b></h2></div>);
                        dispatch(addUserToken(finalRes.token));
                        dispatch(setCart(finalRes.cart));   
                        localStorage.setItem('jaiswal-retail-userToken',JSON.stringify(finalRes.token));
                        localStorage.setItem('jaiswal-retail-userCart',JSON.stringify(finalRes.cart));
                        setRedirectCount(5);
                        setTimeout(() => {
                            router.replace('/');
                        }, 5000);

                        // success(toast, <div><h1>Hello {tempObj.name},</h1><h2><b>{finalRes.message}</b></h2></div>);
                        // router.push(`/auth/please-verify-email/${encodeURIComponent(formDataObject.email)}`);

                    } else {
                        error(toast, finalRes.message);
                    }

                })
                .catch((error) => {
                    console.log(error);
                    console.log("Something went xrong");
                    // setRegisterBtnClicked(false);
                })
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
