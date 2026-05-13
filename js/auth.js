// Firebase Authentication Module
class StreamlyAuth {
    constructor() {
        this.db = null;
        this.auth = null;
        this.currentUser = null;
        this.initFirebase();
    }

    initFirebase() {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.database();

        // Listen for auth state changes
        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateAuthUI();
        });
    }

    // Registar novo utilizador
    async register(email, password) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            console.log('Utilizador registado:', userCredential.user.uid);
            return userCredential.user;
        } catch (error) {
            console.error('Erro no registo:', error.message);
            throw error;
        }
    }

    // Login com email e password
    async login(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('Utilizador autenticado:', userCredential.user.uid);
            return userCredential.user;
        } catch (error) {
            console.error('Erro no login:', error.message);
            throw error;
        }
    }

    // Logout
    async logout() {
        try {
            await this.auth.signOut();
            this.currentUser = null;
            console.log('Utilizador desconectado');
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Erro no logout:', error.message);
            throw error;
        }
    }

    // Obter utilizador atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar se está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Atualizar UI baseado no estado de autenticação
    updateAuthUI() {
        if (this.isAuthenticated()) {
            console.log('Utilizador autenticado:', this.currentUser.email);
            // Redirecionar para página de início se está em login/registo
            if (window.location.pathname === '/login.html' || window.location.pathname === '/registo.html') {
                window.location.href = '/inicio.html';
            }
        } else {
            console.log('Utilizador não autenticado');
            // Redirecionar para login se tenta aceder a página protegida
            const protectedPages = ['/inicio.html', '/filme.html', '/player.html'];
            if (protectedPages.some(page => window.location.pathname === page)) {
                window.location.href = '/login.html';
            }
        }
    }

    // Obter ID do utilizador
    getUserId() {
        return this.currentUser ? this.currentUser.uid : null;
    }

    // Obter email do utilizador
    getUserEmail() {
        return this.currentUser ? this.currentUser.email : null;
    }
}

// Instanciar globalmente
const streamlyAuth = new StreamlyAuth();