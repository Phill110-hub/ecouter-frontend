import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';

// Import the necessary Firebase services and functions
// This assumes you have created 'src/firebase.js' as per Step 8
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// A simple component for the home page to test Firestore
function Home() {
  // This function will be called when the button is clicked
  const addTestData = async () => {
    try {
      // Add a new document to a collection named "frontend_test"
      const docRef = await addDoc(collection(db, "frontend_test"), {
        message: "Hello from the React frontend!",
        createdAt: serverTimestamp(), // Adds a server-side timestamp
      });
      alert("Test data successfully sent to Firestore! Document ID: " + docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to send data. Check the console for errors.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React Frontend</h1>
      <p>Click the button to send test data to your Firestore database.</p>
      <button onClick={addTestData} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Send Test Data
      </button>
    </div>
  );
}


function App() {
  return (
    <Routes>
      {/* Route for the home page, which now has the test button */}
      <Route path="/" element={<Home />} />

      {/* Your existing route for the signup page */}
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
