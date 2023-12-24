import { getApps, initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyCFoVx32Y-4p_Hmm-lpz8OnanFXLAsdtx4",
    authDomain: "alfa-canteen.firebaseapp.com",
    databaseURL: "https://alfa-canteen-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "alfa-canteen",
    storageBucket: "alfa-canteen.appspot.com",
    messagingSenderId: "621588455732",
    appId: "1:621588455732:web:49f86fdc0d0f414494c561",
    measurementId: "G-JHYS5G64WL"
};

let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;