import React from 'react'
import Navbar from "../Navbar/Navbar";
import "./main.css"
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, firebase, auth, provider } from "../../firebase";
import { useHistory } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  // sendEmailVerification
} from "firebase/auth";
import { HiOutlineLogout } from 'react-icons/hi';

const Main = () => {
  const history = useHistory();
  const [user, loading] = useAuthState(auth);

  function signin(e) {
    e.preventDefault();
    auth.signInWithPopup(provider).then(() => history.push("/")).catch((err) => {
      alert(err.message);
    });
  }

  async function LogoutUser() {
    await signOut(auth);
  }

  return (
    <div className="home">
      {
        user ?
          <div className="home_user">
            <Navbar />
            <div className="home_user_right">
              <div className="home_user_right_header">
                <span title="Logout" onClick={LogoutUser}><HiOutlineLogout/></span>
                <div>
                  <img src={user.photoURL} />
                </div>
              </div>
              <h1>note.<span>down</span></h1>
              <p>Welcome {user.displayName.split(" ")[0]}</p>
            </div>
          </div>
          :
          <div className="home_withoutuser">
            <p>Welcome to</p>
            <h1>note.<span>down</span></h1>
            <button onClick={signin}>Login</button>
          </div>
      }

    </div>
  )
}

export default Main