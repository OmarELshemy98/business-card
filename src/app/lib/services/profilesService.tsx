// src/app/lib/services/profilesService.tsx
import { db } from '../../../../firebaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import type { Profile } from '../../types/profile';

// ✅ اسم الكولكشن الجديد في مكان واحد
const COLLECTION = 'business_cards' as const;

/**
 * Fetch all profiles that belong to a specific user (by ownerId).
 * Assumes every profile document contains: ownerId = uid
 */
export async function fetchProfilesForUser(uid: string): Promise<Profile[]> {
  if (!uid) return [];

  const colRef = collection(db, COLLECTION);
  const q = query(colRef, where('ownerId', '==', uid));
  const qs = await getDocs(q);

  return qs.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<Profile, 'id'>),
  }));
}

/**
 * Delete a profile document by id.
 * Security Rules must ensure only the owner can delete.
 */
export async function deleteProfileFromDB(profileId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, profileId));
}
