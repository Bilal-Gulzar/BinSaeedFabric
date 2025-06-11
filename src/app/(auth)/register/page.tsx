import React from 'react'
import SignUp from './signUp'
import { cookies } from 'next/headers';

export default async function Register() {
   const cookieStore = await cookies();
   const token = cookieStore.get('authToken')?.value || ''
  return (
    <div>
      <SignUp token={token}/>
    </div>
  )
}
