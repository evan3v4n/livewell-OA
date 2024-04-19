'use client'
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function page() {
  const {user, userInfo} = useAuth();
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();
  const patientReasons = userInfo.reasons || []; // Ensure it's always an array

  useEffect(() => {
    const getDoctors = async () => {
      if (patientReasons.length > 0) { // Only execute the query if there are reasons
        const doctorsRef = query(
          collection(db, 'users'),
          where('isDoctor', '==', true),
          where('reasons', 'array-contains-any', patientReasons)
        );

        const querySnapshot = await getDocs(doctorsRef);
        const matchedDoctors = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDoctors(matchedDoctors);
      } else {
        // Handle the case where there are no patient reasons
        // You could setDoctors to an empty array or show a message
        console.log("No patient reasons provided for querying doctors.");
      }
    };
    getDoctors();
  }, [patientReasons]);

  const handleSelectDoctor = async (doctorId) => {
    // Check for existing thread between this patient and the selected doctor
    const threadRef = query(
      collection(db, 'threads'),
      where('patientId', '==', user.uid),
      where('doctorId', '==', doctorId)
    );
    const threadSnapshot = await getDocs(threadRef);

    let threadId;
    if (threadSnapshot.empty) {
      // Create new thread if it does not exist
      const newThreadRef = await addDoc(collection(db, 'threads'), {
        patientId: user.uid,
        doctorId: doctorId,
        createdAt: new Date()
      });
      threadId = newThreadRef.id;
    } else {
      // Use existing thread
      threadId = threadSnapshot.docs[0].id;
    }

    // Navigate to the chat page
    router.push(`/chat/${threadId}`);
  };

  
  console.log(doctors)
  if (userInfo.isDoctor) {
    router.push('/dashboard/doctordashboard')
    return <h1 className="text-2xl font-semibold text-center text-blue-800 mb-4">You are not a Patient</h1>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center text-blue-800 mb-4">Matched Doctors</h1>
      <ul className="space-y-4">
        {doctors.map(doctor => (
          <li key={doctor.id} className="p-4 rounded-lg shadow-md bg-white cursor-pointer" onClick={() => handleSelectDoctor(doctor.id)}>
            <h2 className="text-lg font-bold">{doctor.username}</h2>
            <p className="text-sm text-gray-600">Specializes in: {doctor.reasons.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
  
}
