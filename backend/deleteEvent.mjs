import admin from 'firebase-admin';
import 'dotenv/config';

// Initialize Firebase Admin with environment variables
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: 'key-id',
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: '1',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40kamalink2-779cb.iam.gserviceaccount.com'
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteEvent() {
  try {
    console.log('Searching for "い" event on 2026-01-20...');
    
    // Find the event named "い" on 2026-01-20
    const eventsRef = db.collection('events');
    const querySnapshot = await eventsRef.where('eventName', '==', 'い').get();
    
    if (querySnapshot.empty) {
      console.log('Event "い" not found');
      process.exit(1);
    }
    
    let deleted = false;
    for (const doc of querySnapshot.docs) {
      const eventData = doc.data();
      const eventDate = new Date(eventData.eventDate);
      
      // Check if it's on 2026-01-20
      if (eventDate.getFullYear() === 2026 && 
          eventDate.getMonth() === 0 && 
          eventDate.getDate() === 20) {
        
        console.log(`Found event: ${eventData.eventName} on ${eventDate.toLocaleDateString('ja-JP')}`);
        console.log(`Event ID: ${doc.id}`);
        
        // Delete the event
        await db.collection('events').doc(doc.id).delete();
        console.log('✅ Event deleted successfully!');
        deleted = true;
        break;
      }
    }
    
    if (!deleted) {
      console.log('Event "い" on 2026-01-20 not found');
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteEvent();
