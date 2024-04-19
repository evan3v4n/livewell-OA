'use client'
import Link from "next/link";
import { useAuth } from './context/AuthContext';
import {useRouter} from "next/navigation";


export default function Home() {
  const {user, userInfo} = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/dashboard');
  }

  return (
   <main>
     
      <main>
        <div className="max-w-md mx-auto my-10 p-8 border rounded shadow">
          Hi! If you are a patient, please <Link className='text-blue-500' href="/signup">sign up</Link> or <Link className='text-blue-500' href="/login">log in</Link> to access your dashboard.
        </div>
        <div className="max-w-md mx-auto my-10 p-8 border rounded shadow">If you are a Doctor, please <Link className='text-blue-500' href="/doctorsignup">sign up</Link> or <Link className='text-blue-500' href="/doctorlogin">log in</Link> to access your dashboard.</div>
      </main>
   </main>
  );
}
