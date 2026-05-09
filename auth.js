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

// Genera código de referido único tipo HU-XXXX
const generarCodigoReferido = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < 4; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return `HU-${resultado}`;
};

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

btnLogout.addEventListener('click', async () => {
    if (auth.currentUser) {
        signOut(auth).then(() => {
            closeUserPanel();
        }).catch(error => {
            console.error("Error al cerrar sesión", error);
        });
    } else {
        try {
            await signInWithPopup(auth, provider);
            closeUserPanel();
        } catch (error) {
            console.error("Error al iniciar sesión desde el panel:", error);
        }
    }
});

btnCloseLoginPopup.addEventListener('click', () => {
    sessionStorage.setItem('login_popup_cerrado', 'true');
    loginBottomSheet.classList.add('hidden');
});

let popupTimeout;

onAuthStateChanged(auth, async (user) => {
    window.userUID = user ? user.uid : '';
    if (user) {
        // Guardar/Actualizar en Firestore
        try {
            const docRef = doc(db, "clientes", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // Cliente nuevo — generar código de referido
                const codigoReferido = generarCodigoReferido();
                await setDoc(docRef, {
                    uid: user.uid,
                    nombre: user.displayName,
                    email: user.email,
                    foto: user.photoURL,
                    creditos: 0,
                    codigo_referido: codigoReferido,
                    fecha_registro: serverTimestamp()
                });
                window.userCredits = 0;

                // Enviar datos a Google Sheets (v6.0)
                try {
                    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3j7crlKpIlNGuQYJXCOKkuJskSW7ZuBTMDR9H3uTyL_GQ7ic-qHe13WJiIgBrg15o/exec';
                    fetch(APPS_SCRIPT_URL + '?accion=guardarCliente&uid=' + encodeURIComponent(user.uid) + '&email=' + encodeURIComponent(user.email) + '&nombre=' + encodeURIComponent(user.displayName) + '&codigo_referido=' + encodeURIComponent(codigoReferido));
                } catch (e) {
                    console.error("Error al sincronizar con Google Sheets:", e);
                }
            } else {
                const data = docSnap.data();
                window.userCredits = data.creditos || 0;
                console.log('[AUTH] Cliente existente en Firestore. Créditos:', window.userCredits);
                console.log('[AUTH] codigo_referido actual:', JSON.stringify(data.codigo_referido));

                // Si el cliente ya existe pero no tiene código de referido, generarlo
                if (!data.codigo_referido) {
                    console.log("[AUTH] El cliente no tiene código de referido. Generando uno...");
                    const nuevoCodigo = generarCodigoReferido();
                    await setDoc(docRef, {
                        codigo_referido: nuevoCodigo
                    }, { merge: true });
                    console.log("[AUTH] Código de referido generado y guardado en Firestore:", nuevoCodigo);

                    // Sincronizar nuevo código con Google Sheets
                    try {
                        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3j7crlKpIlNGuQYJXCOKkuJskSW7ZuBTMDR9H3uTyL_GQ7ic-qHe13WJiIgBrg15o/exec';
                        fetch(APPS_SCRIPT_URL + '?accion=actualizarCodigoReferido&uid=' + encodeURIComponent(user.uid) + '&codigo_referido=' + encodeURIComponent(nuevoCodigo));
                        console.log("[AUTH] Sincronización de código de referido enviada a Apps Script");
                    } catch (e) {
                        console.error("[AUTH] Error al sincronizar código con Apps Script:", e);
                    }
                }
            }



            // Actualizar UI de créditos v5.7
            if (typeof updateCreditUI === 'function') {
                updateCreditUI();
            } else {
                const fmtCredits = '$' + window.userCredits.toLocaleString('es-AR');
                const headerCredits = document.getElementById('credito-referidos');
                const formCredits = document.getElementById('available-credit');
                if (headerCredits) headerCredits.innerText = `${fmtCredits} créditos de referidos`;
                if (formCredits) formCredits.innerText = fmtCredits;
            }
            
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
        btnLogout.innerHTML = '<ion-icon name="log-out-outline"></ion-icon> Cerrar sesión';
        btnLogout.style.background = '#fdf2f2';
        btnLogout.style.color = 'var(--danger)';

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
        userProfile.style.display = 'flex';
        userPic.style.display = 'none';
        userPic.src = '';
        
        // Panel placeholder
        panelUserPic.style.display = 'none';
        panelUserPic.src = '';
        if (panelUserPicWrapper) panelUserPicWrapper.classList.add('auth-placeholder');
        panelUserName.innerText = 'Invitado';
        panelUserEmail.innerText = 'Inicia sesión para ver tus créditos';
        
        btnLogout.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 48 48" style="margin-right: 8px;">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Entrar con Google
        `;
        btnLogout.style.background = '#000000';
        btnLogout.style.color = '#ffffff';
        btnLogout.style.border = 'none';

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
