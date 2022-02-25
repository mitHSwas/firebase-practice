import logo from './logo.svg';
import './App.css';
import { GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, sendEmailVerification, updateProfile, GithubAuthProvider, FacebookAuthProvider, getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword, } from "firebase/auth";
import firebaseAuthentication from './firebase/firebase.init';
import { useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import { initializeApp } from 'firebase/app';

firebaseAuthentication();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function App() {

  const [user, setUser] = useState('')
  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const userInfo = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(userInfo);
      })
      .catch(error => {
        console.log(error.message)
      })
  }
  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const userInfo = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(userInfo);
      })
      .catch(error => {
        console.log(error.message)
      })
  }
  const handleFacebookSingIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const userInfo = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(userInfo);
      })
      .catch(error => {
        console.log(error.message)
      })
  }
  const handleSignOut = () => {
    signOut(auth)
      .then(result => {
        setUser('')
      })
      .catch(error => { })
  }

  // Let's get start's the email-password part-------:

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('')
  const [registration, setRegistration] = useState(false);

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleRegistration = e => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Error: Password should be at least 6 characters");
      return;
    }
    if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError("Error: Password should be at least 2 digits.")
      return;
    }
    registration ? createNewUser(email, password) : loggedInUser(email, password)
  }

  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        verifyEmail();
        setProfileName();
        setError('');
        console.log(user);
      })
      .catch(error => {
        setError(error.message)
        setSuccess('');
        console.log(error.message)
      })
  }

  const loggedInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      setSuccess("Thank you ! your login is successful.")
      setError('');
      console.log(user);
    })
    .catch(error => {
      setError(error.message)
      setSuccess('')
      console.log(error.message)
    })
  }

  const setProfileName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
      .then(result => { })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(result => {
      setSuccess("Please check your email for verification");
      setError('');
    })
    .catch(error => {
      setError(error.message);
      setSuccess('')
    })
  }

  const passwordResetMail = () => {
    sendPasswordResetEmail(auth, email)
    .then(result => {
      setSuccess("Please check email for changing password");
      setError('');
    })
    .catch(error => {
      setError(error.message)
      setSuccess('')
    })
  }

  const toggleRegistration = e => {
    setRegistration(e.target.checked);
  }

  const handleNameChange = e => {
    setName(e.target.value);
  }

  return (
    <div className="App">
      {!user.name ? <div>
        <button onClick={handleGoogleSignIn}>GG sign-in</button>
        <br />
        <button onClick={handleGithubSignIn}>GH sign-in</button>
        <br />
        <button onClick={handleFacebookSingIn}>FB sign-in</button>
      </div> :
        <button onClick={handleSignOut}>Sign Out</button>
      }
      {user.name && <div>
        <h1>Welcome {user.name}</h1>
        <h3>Your Email: {user.email}</h3>
        <img src={user.photo} alt="" />
      </div>
      }
      <br /> <br />

      {/* Let's get starts the email-password part */}

      <form onSubmit={handleRegistration}>
        <input onClick={toggleRegistration} type="checkbox" id="registration" name="registration" />
        <label htmlFor="registration"> Click For Registration</label>
        <br />
        {registration && <div>
          <label htmlFor="name">Name : </label>
          <input onBlur={handleNameChange} type="text" id="name" required />
        </div>}
        <label htmlFor="email">Email : </label>
        <input onBlur={handleEmailChange} type="email" name="" id="email" required />
        <br />
        <label htmlFor="password">Password : </label>
        <input onBlur={handlePasswordChange} type="password" name="" id="password" required />
        <br />
        <button onClick={passwordResetMail}>Reset Password</button>
        <br />
        <input type="submit" value={registration ? "Register" : "Login"} />
        <h3>{error}</h3>
        <h3>{success}</h3>
      </form>

    </div>
  );
}

export default App;
