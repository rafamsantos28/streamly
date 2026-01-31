// auth.js
import { auth } from './firebase-config.js'; // Ajusta o caminho se for diferente
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authButton = document.getElementById('authButton');
const toggleAuthLink = document.getElementById('toggleAuth');
const authMessage = document.getElementById('authMessage');

let isRegistering = false;

// Redireciona para app.html se já estiver autenticado
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'app.html'; // Redireciona para a página principal
    }
});

toggleAuthLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    authButton.innerText = isRegistering ? 'Registar' : 'Iniciar sessão';
    toggleAuthLink.innerText = isRegistering ? 'Já tenho conta' : 'Registar-me agora';
    authMessage.innerText = ''; // Limpa mensagens anteriores
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    authMessage.innerText = 'A processar...';
    authMessage.style.color = 'var(--text-light-gray)';

    try {
        if (isRegistering) {
            await createUserWithEmailAndPassword(auth, email, password);
            authMessage.innerText = 'Registo bem-sucedido! A redirecionar...';
            authMessage.style.color = 'var(--accent-gold)';
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            authMessage.innerText = 'Login bem-sucedido! A redirecionar...';
            authMessage.style.color = 'var(--accent-gold)';
        }
        window.location.href = 'app.html'; // Redireciona após sucesso
    } catch (error) {
        console.error("Erro de autenticação:", error);
        let errorMessage = "Ocorreu um erro.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este email já está registado.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email inválido.';
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Autenticação por email/password não ativada.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password muito fraca (mínimo 6 caracteres).';
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Email ou password incorretos.';
        }
        authMessage.innerText = errorMessage;
        authMessage.style.color = 'red';
    }
});
