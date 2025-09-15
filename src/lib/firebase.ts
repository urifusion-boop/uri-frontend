import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  writeBatch,
  getDocs,
  orderBy,
  onSnapshot,
  collectionGroup,
} from "firebase/firestore";

export class FirebaseService {
  private static firebaseApp: FirebaseApp;

  private static initializeFirebase() {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    // Initialize Firebase
    return initializeApp(firebaseConfig);
  }

  private static getFirestore() {
    if (this.firebaseApp) return getFirestore(this.firebaseApp);
    this.firebaseApp = this.initializeFirebase();
    return getFirestore(this.firebaseApp);
  }

  public static getSnapshots(cb: (value: any) => void, path: string) {
    const firestore = this.getFirestore();

    if (typeof cb !== "function") return;

    let q = query(collection(firestore, path), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results = querySnapshot.docs.map((doc) => {
        return { ...doc.data() };
      });

      cb(results);
    });

    return unsubscribe;
  }

  public static getUnreadMessageCountForParticipant(
    chatId: string,
    participantId: string,
    cb: (count: number) => void
  ) {
    const firestore = this.getFirestore();

    const q = query(
      collection(firestore, `chats/${chatId}/messages`),
      where(`receiverId`, "==", participantId),
      where(`readStatus`, "==", false)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      cb(querySnapshot.size);
    });

    return unsubscribe;
  }

  public static getTotalUnreadMessageCountForParticipant(
    participantId: string,
    cb: (count: number) => void
  ) {
    const firestore = this.getFirestore();

    const q = query(
      collectionGroup(firestore, `messages`),
      where(`receiverId`, "==", participantId),
      where(`readStatus`, "==", false)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      cb(querySnapshot.size);
    });

    return unsubscribe;
  }

  public static async markChatAsRead(chatId: string, participantId: string) {
    const firestore = this.getFirestore();

    const q = query(
      collection(firestore, `chats/${chatId}/messages`),
      where(`receiverId`, "==", participantId),
      where(`readStatus`, "==", false)
    );

    const querySnapshot = await getDocs(q);

    const batch = writeBatch(firestore);

    querySnapshot.forEach((doc) => {
      const messageRef = doc.ref;
      batch.update(messageRef, { readStatus: true });
    });

    await batch.commit();
  }
}
