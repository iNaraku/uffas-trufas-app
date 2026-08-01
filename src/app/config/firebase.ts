import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { environment } from '../../environments/environment';

export const app = initializeApp(environment.firebase);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
