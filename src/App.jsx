import { useState } from 'react'

import { GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import  {auth} from '../firebase'

function App(){

    const [user,setuser] = useState(null)

    const handleGoogleLogin = async() => {
        const provider = new GoogleAuthProvider()

        try {
            const result = await signInWithPopup(auth,provider)
        } catch (error) {
            
        }
    }
    return (
        <>
        <button onClick={handleGoogleLogin}>Login with Google</button>
        </>
    )
}

export default App;