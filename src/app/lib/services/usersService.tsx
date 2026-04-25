import { db } from '../../../../firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export type AppUser = {
  id: string;           // uid
  email: string;
  name?: string;
  role?: 'admin' | 'user';
  createdAt?: any;      // Timestamp | number
  disabled?: boolean;
};

export async function fetchUsersFromDB(): Promise<AppUser[]> {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<AppUser, 'id'>) }));
}
