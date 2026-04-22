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
const panelUserPicWrapper = document.getElementById('panel-user-pic-wrapper');

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
                    creditos: 0,
                    fecha_registro: serverTimestamp()
                });
                window.userCredits = 0;
            } else {
                const data = docSnap.data();
                window.userCredits = data.creditos || 0;
            }

            // Actualizar UI de créditos
            const fmtCredits = '$' + window.userCredits.toLocaleString('es-AR');
            const headerCredits = document.getElementById('credito-referidos');
            const formCredits = document.getElementById('available-credit');
            const creditFormGroup = document.getElementById('credit-form-group');

            if (headerCredits) headerCredits.innerText = `${fmtCredits} créditos de referidos`;
            if (formCredits) formCredits.innerText = fmtCredits;
            
            // UI del Formulario v8.0
            const creditBtn = document.getElementById('btn-aplicar-credito');
            const creditMsg = document.getElementById('credit-mensaje');
            
            if (creditBtn && creditMsg) {
                if (window.userCredits > 0) {
                    creditBtn.disabled = false;
                    creditBtn.classList.remove('btn-disabled');
                    creditMsg.textContent = 'Tenés créditos disponibles para usar.';
                    creditMsg.className = 'cupon-mensaje exito';
                } else {
                    creditBtn.disabled = true;
                    creditBtn.classList.add('btn-disabled');
                    creditMsg.textContent = 'No tenés créditos disponibles.';
                    creditMsg.className = 'cupon-mensaje error';
                }
            }

            // También en el panel lateral v5.5
            const panelCredits = document.querySelector('.credit-amount');
            if (panelCredits) panelCredits.innerText = fmtCredits;

        } catch (error) {
            console.error("Error al interactuar con Firestore:", error);
        }

        // Mostrar Interfaz Logueado
        if (popupTimeout) clearTimeout(popupTimeout);
        loginBottomSheet.classList.add('hidden');
        
        userProfile.style.display = 'flex';
        if (user.photoURL) {
            userPic.src = user.photoURL;
            userPic.style.display = 'block';
        } else {
            userPic.style.display = 'none';
        }
        
        // Purgar y cargar panel
        if (user.photoURL) {
            panelUserPic.src = user.photoURL;
            panelUserPic.style.display = 'block';
            panelUserPicWrapper.classList.remove('auth-placeholder');
        } else {
            panelUserPic.style.display = 'none';
            panelUserPicWrapper.classList.add('auth-placeholder');
        }
        panelUserName.innerText = user.displayName || 'Usuario';
        panelUserEmail.innerText = user.email || '';
    } else {
        // Interfaz NO logueada
        userProfile.style.display = 'flex'; // Siempre visible por diseño v5.1
        userPic.style.display = 'none';
        userPic.src = '';
        
        // Panel placeholder
        panelUserPic.style.display = 'none';
        panelUserPic.src = '';
        if (panelUserPicWrapper) panelUserPicWrapper.classList.add('auth-placeholder');
        panelUserName.innerText = 'Invitado';
        panelUserEmail.innerText = 'Inicia sesión para ver tus créditos';
        
        window.userCredits = 0;
        const creditBtn = document.getElementById('btn-aplicar-credito');
        const creditMsg = document.getElementById('credit-mensaje');
        const availableCredits = document.getElementById('available-credit');

        if (availableCredits) availableCredits.innerText = '$0';
        if (creditBtn) {
            creditBtn.disabled = true;
            creditBtn.classList.add('btn-disabled');
        }
        if (creditMsg) {
            creditMsg.textContent = 'Iniciá sesión para ver tus créditos';
            creditMsg.className = 'cupon-mensaje';
        }

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
