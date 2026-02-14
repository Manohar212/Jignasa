import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuration using environment variables is best practice.
// For the preview environment, verify these keys are set or use your specific config.
const firebaseConfig = {
  apiKey: "your-api-key", // Replace with actual keys for the demo to work if env vars aren't set
  authDomain: "jignasa-demo.firebaseapp.com",
  projectId: "jignasa-demo",
  storageBucket: "jignasa-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize only once
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);