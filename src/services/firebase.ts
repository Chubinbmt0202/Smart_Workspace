import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

function getFirebaseAuth() {
  if (!hasFirebaseConfig) {
    throw new Error('Firebase chưa được cấu hình. Hãy thiết lập các biến VITE_FIREBASE_* trong file .env.');
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  if (!result.user.email) {
    throw new Error('Tài khoản Google không cung cấp địa chỉ email.');
  }

  return {
    alert: result.user.emailVerified ? 'Đăng nhập thành công!' : 'Đăng nhập thành công, nhưng email chưa được xác minh.',
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL
  };
}

export async function signOutFirebase() {
  if (!hasFirebaseConfig || getApps().length === 0) return;
  await signOut(getAuth(getApp()));
}
