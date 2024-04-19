'use client'
import {useContext, createContext, useState, useEffect} from 'react'
import {createUserWithEmailAndPassword,  signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {auth} from '../firebase'

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const [userRooms, setUserRooms] = useState([]);


    function signUp(email, password){
        email = email.trim();
        return createUserWithEmailAndPassword(auth, email, password)
    }


    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        
        return signOut(auth);
    }

    useEffect(() =>{
        const unsubscribe = auth.onAuthStateChanged(user =>{
            setUser(user);
        })

        if(user){
            const getUserInfo = async () =>{
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                setUserInfo(userData);
            }
          
            getUserInfo();
            


        }
        else{
            setUserInfo({}); 
            
        }






        return unsubscribe;
    }, [user])



    return(
        <AuthContext.Provider value={{user, signUp, login, logout, userInfo, userRooms, setUserRooms}} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>{
    return useContext(AuthContext);

}