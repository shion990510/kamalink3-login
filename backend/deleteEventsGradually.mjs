import admin from 'firebase-admin';
import 'dotenv/config';

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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function deleteEventsGradually() {
  try {
    const eventsRef = db.collection('events');
    const snapshot = await eventsRef.limit(5).get();

    if (snapshot.empty) {
      console.log('✅ No more events to delete.');
      process.exit(0);
    }

    const batch = db.batch();
    let count = 0;
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      count++;
    });
    await batch.commit();

    console.log(`✅ Deleted ${count} event(s). Remaining events will be deleted on next run.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteEventsGradually();
