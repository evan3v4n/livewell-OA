'use client'
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function page() {
  const {user, userInfo} = useAuth();
  const [patients, setPatients] = useState([]);
  const specialities = userInfo.reasons || []; // Ensure it's always an array
  const router = useRouter();
  
  useEffect(() => {

    const getPatients = async () => {
      if (specialities.length > 0) { // Only execute the query if there are reasons
        const patientsRef = query(
          collection(db, 'users'),
          where('isDoctor', '==', false),
          where('reasons', 'array-contains-any', specialities)
        );

        const querySnapshot = await getDocs(patientsRef);
        const matchedPatients = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPatients(matchedPatients);
      } else {
        // Handle the case where there are no patient reasons
        // You could setDoctors to an empty array or show a message
        console.log("No doctor specialties provided for querying patient.");
        // Shouldnt happen because reasons are manditory on signup
      }
    };
    getPatients();
  }, [specialities]);
  
  //console.log(patients)
  const handleSelectPatient = async (patientId) => {
    // Check for existing thread between this patient and the selected doctor
    const threadRef = query(
      collection(db, 'threads'),
      where('patientId', '==', patientId),
      where('doctorId', '==', user.uid)
    );

    const threadSnapshot = await getDocs(threadRef);

    let threadId;
    if (threadSnapshot.empty) {
      // Create new thread if it does not exist
      const newThreadRef = await addDoc(collection(db, 'threads'), {
        patientId: patientId,
        doctorId: user.uid,
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


  if (!userInfo.isDoctor) {
    return <h1 className="text-2xl font-semibold text-center text-blue-800 mb-4">You are not a doctor</h1>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center text-blue-800 mb-4">Matched Patients</h1>
      <ul className="space-y-4">
        {patients.map(patient => (
          <li key={patient.id} className="p-4 rounded-lg shadow-md bg-white" onClick={() => handleSelectPatient(patient.uid)}>
            <h2 className="text-lg font-bold">{patient.username}</h2>
            <p className="text-sm text-gray-600">Specializes in: {patient.reasons.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
  
}
