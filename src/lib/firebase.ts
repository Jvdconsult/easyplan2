import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, deleteUser as firebaseDeleteUser } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: "easyplan2-3c1b5.firebaseapp.com",
  projectId: "easyplan2-3c1b5",
  storageBucket: "easyplan2-3c1b5.firebasestorage.app",
  messagingSenderId: "215575910133",
  appId: "1:215575910133:web:30168915c55607793357bc"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Add required scopes
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

// Force account selection to handle re-registration
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export async function deleteUserData(userId: string) {
  try {
    // Delete user's events
    const eventsQuery = query(
      collection(db, 'events'),
      where('createdBy', '==', userId)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const deletePromises = eventsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Delete user's votes from other events
    const allEventsQuery = query(collection(db, 'events'));
    const allEventsSnapshot = await getDocs(allEventsQuery);
    
    const updatePromises = allEventsSnapshot.docs.map(async doc => {
      const eventData = doc.data();
      if (eventData.votes?.some((vote: any) => vote.userId === userId)) {
        const updatedVotes = eventData.votes.filter(
          (vote: any) => vote.userId !== userId
        );
        await updateDoc(doc.ref, { votes: updatedVotes });
      }
      
      if (eventData.participants?.includes(userId)) {
        const updatedParticipants = eventData.participants.filter(
          (id: string) => id !== userId
        );
        await updateDoc(doc.ref, { participants: updatedParticipants });
      }
    });
    
    await Promise.all(updatePromises);

    // Delete user preferences if you have any
    const userPrefsDoc = doc(db, 'userPreferences', userId);
    await deleteDoc(userPrefsDoc).catch(() => {
      // Ignore if document doesn't exist
    });

    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}

export async function deleteUserAccount(user: any) {
  try {
    // First, delete user data
    await deleteUserData(user.uid);
    
    // Then, delete the authentication account
    await firebaseDeleteUser(user);
    
    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
}