import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  Auth, 
  signInAnonymously as fbSignInAnonymously,
  signInWithEmailAndPassword as fbSignInWithEmail,
  createUserWithEmailAndPassword as fbCreateUserWithEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  Firestore, 
  doc, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from "firebase/firestore";
import { Conversation, Message, UserProfile } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCQqi-EMxBJuD9eajs_8YSPYi4Y4GRlfVI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ai-perk.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ai-perk",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ai-perk.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "835871001491",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:835871001491:web:8bfbd17946cfee57b53666",
};

// Initialize Firebase Singleton
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Pre-bound Authentication helpers
export const signInAnonymously = () => fbSignInAnonymously(auth);
export const signInWithEmail = (email: string, pass: string) => fbSignInWithEmail(auth, email, pass);
export const createUserWithEmail = (email: string, pass: string) => fbCreateUserWithEmail(auth, email, pass);
export const signOut = () => fbSignOut(auth);

// Local Storage Fallback for zero data loss
const STORAGE_PREFIX = "darkgpt_persist_";

function getLocalConversations(userId: string): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}convs_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalConversations(userId: string, convs: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}convs_${userId}`, JSON.stringify(convs));
  } catch (err) {
    console.error("Local storage error:", err);
  }
}

function getLocalMessages(userId: string, convId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}msgs_${userId}_${convId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(userId: string, convId: string, msgs: Message[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}msgs_${userId}_${convId}`, JSON.stringify(msgs));
  } catch (err) {
    console.error("Local storage error:", err);
  }
}

// Conversation persistence layer
export async function persistConversation(userId: string, conv: Conversation): Promise<void> {
  const current = getLocalConversations(userId);
  const updated = [conv, ...current.filter((c) => c.id !== conv.id)];
  saveLocalConversations(userId, updated);

  try {
    const convRef = doc(db, "users", userId, "conversations", conv.id);
    await setDoc(convRef, {
      ...conv,
      userId,
      updatedAt: conv.updatedAt,
    }, { merge: true });
  } catch (err) {
    console.warn("[Firebase] Firestore sync notice; cached locally:", err);
  }
}

export async function fetchUserConversations(userId: string): Promise<Conversation[]> {
  const localConvs = getLocalConversations(userId);

  try {
    const convsRef = collection(db, "users", userId, "conversations");
    const q = query(convsRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const remoteConvs = snapshot.docs.map((doc) => doc.data() as Conversation);
      saveLocalConversations(userId, remoteConvs);
      return remoteConvs;
    }
  } catch (err) {
    console.warn("[Firebase] Using local conversation cache:", err);
  }

  return localConvs;
}

export async function persistMessage(userId: string, convId: string, msg: Message): Promise<void> {
  const current = getLocalMessages(userId, convId);
  const updated = [...current.filter((m) => m.id !== msg.id), msg];
  saveLocalMessages(userId, convId, updated);

  try {
    const msgRef = doc(db, "users", userId, "conversations", convId, "messages", msg.id);
    await setDoc(msgRef, {
      ...msg,
      timestamp: msg.timestamp,
    });
  } catch (err) {
    console.warn("[Firebase] Message persisted to client cache:", err);
  }
}

export async function fetchConversationMessages(userId: string, convId: string): Promise<Message[]> {
  const localMsgs = getLocalMessages(userId, convId);

  try {
    const msgsRef = collection(db, "users", userId, "conversations", convId, "messages");
    const q = query(msgsRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const remoteMsgs = snapshot.docs.map((doc) => doc.data() as Message);
      saveLocalMessages(userId, convId, remoteMsgs);
      return remoteMsgs;
    }
  } catch (err) {
    console.warn("[Firebase] Using local message cache:", err);
  }

  return localMsgs;
}

export async function deleteUserConversation(userId: string, convId: string): Promise<void> {
  const current = getLocalConversations(userId);
  saveLocalConversations(userId, current.filter((c) => c.id !== convId));
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${STORAGE_PREFIX}msgs_${userId}_${convId}`);
  }

  try {
    const convRef = doc(db, "users", userId, "conversations", convId);
    await deleteDoc(convRef);
  } catch (err) {
    console.warn("[Firebase] Removed from local state:", err);
  }
}

export { onAuthStateChanged, GoogleAuthProvider, signInWithPopup };
export type { User };
