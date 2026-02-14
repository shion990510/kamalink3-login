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

async function listAllEvents() {
  try {
    console.log('Listing all events...\n');
    
    const eventsRef = db.collection('events');
    const querySnapshot = await eventsRef.get();
    
    if (querySnapshot.empty) {
      console.log('No events found');
      process.exit(0);
    }
    
    for (const doc of querySnapshot.docs) {
      const eventData = doc.data();
      const eventDate = new Date(eventData.eventDate);
      console.log(`ID: ${doc.id}`);
      console.log(`Name: ${eventData.eventName}`);
      console.log(`Date: ${eventDate.toLocaleDateString('ja-JP')}`);
      console.log('---');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listAllEvents();
