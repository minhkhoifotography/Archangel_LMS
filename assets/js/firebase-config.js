// === CẤU HÌNH API FIREBASE ===
export const firebaseConfig = {
    apiKey: "AIzaSyBc6i-ipiKnR1lwIIna597PyFeRB5jKhRI",
    authDomain: "luuminhkhoi-lms.firebaseapp.com",
    databaseURL: "https://luuminhkhoi-lms-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "luuminhkhoi-lms",
    storageBucket: "luuminhkhoi-lms.firebasestorage.app",
    messagingSenderId: "813957372106",
    appId: "1:813957372106:web:066d4e5d274549546efc33"
};

let db = null;
let isCloudConnected = false;

export function initFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.database();
            
            db.ref('.info/connected').on('value', function(snap) {
                if (snap.val() === true) {
                    isCloudConnected = true; 
                    setCloudStatus('online'); 
                    console.log("Firebase Connected");
                } else {
                    isCloudConnected = false; 
                    setCloudStatus('offline'); 
                    console.log("Firebase Offline - Fallback to LocalStorage");
                }
            });
        } catch(e) { 
            console.error("Firebase Init Error: ", e); 
        }
    }
}

export function setCloudStatus(status) {
    const el = document.getElementById('cloudStatus'); 
    const txt = document.getElementById('cloudStatusText');
    if(!el) return; 
    el.className = 'cloud-status';
    if(status === 'online') { 
        el.classList.remove('cloud-offline', 'cloud-syncing'); 
        el.classList.add('cloud-online'); txt.innerText = "Trực tuyến"; 
    }
    else if(status === 'syncing') { 
        el.classList.remove('cloud-offline', 'cloud-online'); 
        el.classList.add('cloud-syncing'); txt.innerText = "Đang đồng bộ..."; 
    }
    else { 
        el.classList.remove('cloud-online', 'cloud-syncing'); 
        el.classList.add('cloud-offline'); txt.innerText = "Ngoại tuyến"; 
    }
}

export { db, isCloudConnected };
