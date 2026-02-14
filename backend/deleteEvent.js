const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, './firebase-key.json'));

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
        console.log('Event deleted successfully!');
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
