"use client"
import { useState } from 'react';
import { auth, db } from '../../firebase';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Autocomplete } from '@mui/material';
import {MenuItem} from '@mui/material';
import {TextField} from '@mui/material';
import Link from 'next/link';



const reasons: String[] = [
    'Birth Control',
    'Acne',
    'Erectile Dysfunction',
    'Weight Loss',
];

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<String[]>([]);
  const [username, setUserName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCred.user.uid;
        const userRef = doc(db, 'users', user );
        return setDoc(userRef, {
            uid: user,
            email: email,
            username: username,
            reasons: selectedReasons,
            isDoctor: true
        }).then(() => {
            console.log('User created:', user);
            router.push('/dashboard'); // Redirect to dashboard or another page  
        })
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 border rounded shadow">
      <h1 className="text-xl font-bold text-center mb-6">Doctor Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded shadow-sm"
        />

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded shadow-sm"
        />

        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mt-4">
          Doctor Name
        </label>
        <input
          type="username"
          id="username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded shadow-sm"
        />

        <Autocomplete
            className="py-"
            sx={{ marginBottom: '1rem' }}
            id="outlined-basic"
            multiple // Enable multiple selection
            disableCloseOnSelect
            options={reasons}
            value={selectedReasons}
            onChange={(event, newValue) => {
                setSelectedReasons(newValue);
            }}
            isOptionEqualToValue={(option, value) => option === value}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Interests"
                    required={selectedReasons.length === 0} // Ensures at least one interest is selected
                />
            )}
            renderOption={(props, option, { selected }) => (
                <MenuItem {...props} selected={selected}>
                  {option}
                </MenuItem>
              )}
        />
        {error && <p className="text-red-500 text-xs mt-4">{error}</p>}

        <button type="submit" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
      <div>
        If you already have an account, please 
        <Link href="/doctorlogin" className="text-blue-500"> Login Here</Link>
    </div>
    </div>
  );
};

export default SignUpPage;
