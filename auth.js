import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAvvea8h7o1S5ol-FWEo9HSR95edlsIQgQ",
    authDomain: "huerta-urbana-ccb50.firebaseapp.com",
    projectId: "huerta-urbana-ccb50",
    storageBucket: "huerta-urbana-ccb50.firebasestorage.app",
    messagingSenderId: "451307881409",
    appId: "1:451307881409:web:f5ebcf19c2d354a8efe540"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const userProfile = document.getElementById('user-profile');
const userPic = document.getElementById('user-pic');
const userPanel = document.getElementById('user-panel');
const panelUserPic = document.getElementById('panel-user-pic');
const panelUserName = document.getElementById('panel-user-name');
const panelUserEmail = document.getElementById('panel-user-email');
const btnLogout = document.getElementById('btn-logout');
const closePanelBtn = document.getElementById('close-user-panel');

// Bottom Sheet DOM Elements
const loginBottomSheet = document.getElementById('login-bottom-sheet');
const btnLoginGooglePopup = document.getElementById('btn-login-google-popup');
const btnCloseLoginPopup = document.getElementById('btn-close-login-popup');

btnLoginGooglePopup.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
    }
});

btnLogout.addEventListener('click', () => {
    signOut(auth).then(() => {
        closeUserPanel();
    }).catch(error => {
        console.error("Error al cerrar sesión", error);
    });
});

btnCloseLoginPopup.addEventListener('click', () => {
    sessionStorage.setItem('login_popup_cerrado', 'true');
    loginBottomSheet.classList.add('hidden');
});

let popupTimeout;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Guardar/Actualizar en Firestore
        try {
            const docRef = doc(db, "clientes", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    uid: user.uid,
                    nombre: user.displayName,
                    email: user.email,
                    foto: user.photoURL,
                    fecha_registro: serverTimestamp()
                });
            }
        } catch (error) {
            console.error("Error al interactuar con Firestore:", error);
        }

        // Mostrar Interfaz Logueado
        if (popupTimeout) clearTimeout(popupTimeout);
        loginBottomSheet.classList.add('hidden');
        
        userProfile.style.display = 'flex';
        userPic.src = user.photoURL || '';
        
        // Purgar y cargar panel
        panelUserPic.src = user.photoURL || '';
        panelUserName.innerText = user.displayName || 'Usuario';
        panelUserEmail.innerText = user.email || '';
    } else {
        // Interfaz NO logueada
        userProfile.style.display = 'none';
        closeUserPanel();

        // Mostrar Popup Bottom Sheet después de 5 seg
        if (popupTimeout) clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => {
            if (sessionStorage.getItem('login_popup_cerrado') !== 'true' && !auth.currentUser) {
                loginBottomSheet.classList.remove('hidden');
                loginBottomSheet.style.display = 'flex';
            }
        }, 5000);
    }
});

// Cerrar popup al hacer clic fuera (en el overlay)
loginBottomSheet.addEventListener('click', (e) => {
    if (e.target === loginBottomSheet) {
        sessionStorage.setItem('login_popup_cerrado', 'true');
        loginBottomSheet.classList.add('hidden');
    }
});

// Panel Behavior
userProfile.addEventListener('click', () => {
    userPanel.style.display = 'flex';
});

closePanelBtn.addEventListener('click', closeUserPanel);

// Cerrar si hace clic fuera del contenido
userPanel.addEventListener('click', (e) => {
    if (e.target === userPanel) {
        closeUserPanel();
    }
});

function closeUserPanel() {
    userPanel.style.display = 'none';
}
