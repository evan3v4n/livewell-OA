"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, getDoc  } from "firebase/firestore";
import { db, auth } from '../app/firebase';
import {useRouter} from 'next/navigation';
import { signOut } from 'firebase/auth';



export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log("logging out")
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        setUser(user);
    });

    if (user) {
      const getUserInfo = async () => {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          setUserInfo(userData);
      }
      getUserInfo();
    } else {
      setUserInfo({});
    }
    return unsubscribe;
  }, [user])

  return (
    <nav className='w-full py-5 pl-2.5rem text-gray-200 bg-black gap-5 mx-auto text-xl flex items-center justify-between'>
      <Link className='bg-[#171819] ph-2 p-1 rounded-sm text-white text-3xl flex-none' href='/'>  
        Livewell OA
      </Link>
     
      <div className='flex-grow flex items-center justify-center'>
        {!user ? (
          <main className='text-white'>
            Please sign in using links below
          </main>
        ) : (
          <div className='flex justify-center items-center flex-grow'>
            Hello 
            {userInfo && userInfo.isDoctor ? ' Dr. ' : ' '}
            {userInfo && userInfo.username}!
          </div>
        )}
      </div>
      
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-[#171819] text-white py-[0.3rem] px-4 rounded-lg hover:bg-[#171819]"
          >
            Logout
          </button>
        ) : (
          <div className='w-[3.5rem]'> {/* Adjust width as needed to balance the logo */}
          </div>
        )}
      </div>
    </nav>
  );
}
