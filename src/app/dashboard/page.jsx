'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
// import {useAuth} from '../context/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {useAuth} from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';

export default function page() {
  const {user, userInfo} = useAuth();
  console.log(userInfo)
  const router = useRouter();
  if (userInfo.isDoctor == true) {
  router.push('/dashboard/doctordashboard');
  } else if (!userInfo.isDoctor) {
   router.push('/dashboard/patientdashboard');
  }

  if(user === null) {
    return (
      <main>
        <div className="max-w-md mx-auto my-10 p-8 border rounded shadow">
          Hi! If you are a patient, please <Link className='text-blue-500' href="/signup">sign up</Link> or <Link className='text-blue-500' href="/login">log in</Link> to access your dashboard.
        </div>
        <div className="max-w-md mx-auto my-10 p-8 border rounded shadow">If you are a Doctor, please <Link className='text-blue-500' href="/doctorsignup">sign up</Link> or <Link className='text-blue-500' href="/doctorlogin">log in</Link> to access your dashboard.</div>
      </main>
    )
  }


  return (
    <div>hi </div>
  )
}
