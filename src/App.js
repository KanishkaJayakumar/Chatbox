import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import './App.css'
import { serverTimestamp } from 'firebase/firestore'

import "firebase/compat/firestore";
import "firebase/compat/storage";
import { useEffect, useState } from 'react'
import { GoogleAuthProvider,onAuthStateChanged,signInWithPopup} from 'firebase/auth'
import {doc,setDoc,getFirestore,getDoc,onSnapshot,collection,addDoc,orderBy,query} from 'firebase/firestore'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAq3Yi9XFOyOuGwjRV5DiEmMoLKWppE2AQ",
  authDomain: "chatbox-9be3c.firebaseapp.com",
  projectId: "chatbox-9be3c",
  storageBucket: "chatbox-9be3c.appspot.com",
  messagingSenderId: "119988020428",
  appId: "1:119988020428:web:2800a1b0e2e58e95798e69",
  measurementId: "G-HVC6K6TC7G"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

function App(){

  const [user,setUser] = useState(null)
  const [messages,setMessages] = useState([])
  const [newMessage,setNewMessage] = useState("")

  useEffect(()=>{
    const q=query(collection(db,"messages"),orderBy("timestamp"))
    const unsubscribe = onSnapshot(q,snapshot=>{
      setMessages(snapshot.docs.map(doc=>({
        id:doc.id,
        data:doc.data(),
      })))
    })
    return unsubscribe
    },[])

    useEffect(()=>{
      onAuthStateChanged(auth,user=>{
        if(user)
        {
          setUser(user)
        }
        else{
          setUser(null)
        }
      })
    },[])

    const sendMessage = async() => {
      await addDoc(collection(db,"messages"),{
        uid:user.uid,
        photoURL:user.photoURL,
        displayName:user.displayName,
        text:newMessage,
        timestamp:serverTimestamp()
      })
      setNewMessage("");
    }

  const handleGoogleLogin = async() => {
      const provider = new GoogleAuthProvider()

      try {
          const result = await signInWithPopup(auth,provider)
      } catch (error) {
          
      }
  }
  return (
      
      <div className="App">
        {
          user?(
            <>
            <div className="user" >Logged in as {user.displayName}</div>
            <input
            value={newMessage}
            onChange={e=>setNewMessage(e.target.value)}
            />
            <button className="send" onClick={sendMessage}>Send Message</button>
            <button className="logout" onClick={()=>auth.signOut()}>LogOut </button>
            
            

            {messages.map(msg=>(
              <div className={`message ${msg.data.uid === user.id? 'current':'other'}`}>
                <div className="texts">
                <img
                  src={msg.data.photoURL}/>
                  {msg.data.displayName}
                  
                  <div className="text">
                    {msg.data.text}
                  </div>
                  </div>
              </div>
            ))}
            </>
          ):
          <button className="login" onClick={handleGoogleLogin}>Login with Google</button>
          }
        </div>
  )
}


export default App;
export {db,auth,storage}



