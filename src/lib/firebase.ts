import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface GlobalSiteData {
  avatarUrl?: string;
  projectImages?: Record<string, string>;
  marqueeRow1?: any[];
  marqueeRow2?: any[];
  updatedAt?: number;
}

const SETTINGS_DOC_ID = 'global_alexandre_fontinele';

/**
 * Real-time listener for site content across all visitors/browsers
 */
export function subscribeToSiteData(callback: (data: GlobalSiteData) => void): () => void {
  try {
    const docRef = doc(db, 'site_content', SETTINGS_DOC_ID);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as GlobalSiteData);
        }
      },
      (error) => {
        console.warn('Firestore subscription notice:', error);
      }
    );
  } catch (err) {
    console.warn('Firestore listener initialization error:', err);
    return () => {};
  }
}

/**
 * Fetch latest data once from Firestore
 */
export async function getGlobalSiteData(): Promise<GlobalSiteData | null> {
  try {
    const docRef = doc(db, 'site_content', SETTINGS_DOC_ID);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as GlobalSiteData;
    }
    return null;
  } catch (err) {
    console.warn('Error fetching Firestore site data:', err);
    return null;
  }
}

/**
 * Save site data directly to cloud Firestore so it is globally available
 */
export async function saveGlobalSiteData(partialData: Partial<GlobalSiteData>): Promise<void> {
  try {
    const docRef = doc(db, 'site_content', SETTINGS_DOC_ID);
    await setDoc(
      docRef,
      {
        ...partialData,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving to Firestore:', err);
    throw err;
  }
}
