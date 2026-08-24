import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { MarqueeMediaItem } from '../components/sections/MarqueeSection';

const app = initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface GlobalSiteData {
  avatarUrl?: string;
  projectImages?: Record<string, string>;
  marqueeRow1?: MarqueeMediaItem[];
  marqueeRow2?: MarqueeMediaItem[];
  updatedAt?: number;
}

const SETTINGS_DOC_ID = 'global_alexandre_fontinele';
const MARQUEE_DOC_ID = 'marquee_media_content';

/**
 * Real-time listener for site content across all visitors/browsers
 */
export function subscribeToSiteData(callback: (data: GlobalSiteData) => void): () => void {
  try {
    const mainDocRef = doc(db, 'site_content', SETTINGS_DOC_ID);
    const marqueeDocRef = doc(db, 'site_content', MARQUEE_DOC_ID);

    let latestMain: Partial<GlobalSiteData> = {};
    let latestMarquee: Partial<GlobalSiteData> = {};

    const unsubMain = onSnapshot(
      mainDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          latestMain = snapshot.data() as Partial<GlobalSiteData>;
          callback({ ...latestMarquee, ...latestMain });
        }
      },
      (error) => {
        console.warn('Firestore main subscription notice:', error);
      }
    );

    const unsubMarquee = onSnapshot(
      marqueeDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          latestMarquee = snapshot.data() as Partial<GlobalSiteData>;
          callback({ ...latestMain, ...latestMarquee });
        }
      },
      (error) => {
        console.warn('Firestore marquee subscription notice:', error);
      }
    );

    return () => {
      unsubMain();
      unsubMarquee();
    };
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
    const mainDocRef = doc(db, 'site_content', SETTINGS_DOC_ID);
    const marqueeDocRef = doc(db, 'site_content', MARQUEE_DOC_ID);

    const [mainSnap, marqueeSnap] = await Promise.all([
      getDoc(mainDocRef),
      getDoc(marqueeDocRef),
    ]);

    let combined: GlobalSiteData = {};
    if (mainSnap.exists()) {
      combined = { ...combined, ...(mainSnap.data() as GlobalSiteData) };
    }
    if (marqueeSnap.exists()) {
      combined = { ...combined, ...(marqueeSnap.data() as GlobalSiteData) };
    }

    if (mainSnap.exists() || marqueeSnap.exists()) {
      return combined;
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
    const timestamp = Date.now();

    // If saving marquee items, save into dedicated marquee document to preserve capacity
    if (partialData.marqueeRow1 !== undefined || partialData.marqueeRow2 !== undefined) {
      const marqueeDocRef = doc(db, 'site_content', MARQUEE_DOC_ID);
      const payload: Partial<GlobalSiteData> = { updatedAt: timestamp };
      if (partialData.marqueeRow1 !== undefined) payload.marqueeRow1 = partialData.marqueeRow1;
      if (partialData.marqueeRow2 !== undefined) payload.marqueeRow2 = partialData.marqueeRow2;
      await setDoc(marqueeDocRef, payload, { merge: true });
    }

    // If saving avatar, projects, etc., save into main document
    if (partialData.avatarUrl !== undefined || partialData.projectImages !== undefined) {
      const mainDocRef = doc(db, 'site_content', SETTINGS_DOC_ID);
      const payload: Partial<GlobalSiteData> = { updatedAt: timestamp };
      if (partialData.avatarUrl !== undefined) payload.avatarUrl = partialData.avatarUrl;
      if (partialData.projectImages !== undefined) payload.projectImages = partialData.projectImages;
      await setDoc(mainDocRef, payload, { merge: true });
    }
  } catch (err) {
    console.error('Error saving to Firestore:', err);
    throw err;
  }
}
