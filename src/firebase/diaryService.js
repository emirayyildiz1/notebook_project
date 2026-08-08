/**
 * diaryService.js
 * Clean CRUD helpers for Firestore diary pages.
 *
 * Collection structure:
 *   diary_pages/
 *     {pageId}/
 *       date:      string  (ISO date, e.g. "2025-03-14")
 *       content:   string  (the textarea body)
 *       createdAt: Timestamp
 *       updatedAt: Timestamp
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION = 'diary_pages';

/**
 * Fetch all diary pages sorted by creation time (oldest first).
 * @returns {Promise<Array<{id: string, date: string, content: string, createdAt: any}>>}
 */
export async function getAllPages() {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Save (create or update) a diary page.
 * Uses the page's own `id` as the Firestore document ID so navigation is stable.
 * @param {string} id        - Unique page identifier (e.g. UUID or timestamp string)
 * @param {{date: string, content: string}} data
 * @returns {Promise<void>}
 */
export async function savePage(id, { date, content }) {
  const ref = doc(db, COLLECTION, id);
  const existing = await getDoc(ref);

  await setDoc(
    ref,
    {
      date,
      content,
      updatedAt: serverTimestamp(),
      // Only set createdAt on first write
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
}

/**
 * Delete a diary page by ID.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deletePage(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
