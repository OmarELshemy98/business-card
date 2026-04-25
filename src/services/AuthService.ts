'use client';
import { getAuth, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';

export async function CreateUser(email: string, pass: string) {
  const auth = getAuth();
  const cred: UserCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return { cred, uid: cred.user.uid };
}
