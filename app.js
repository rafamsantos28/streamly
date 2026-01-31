// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAkYudiGSZxhsiMj4MoLAMCLRErb9IlTDE",
    authDomain: "streamly-87883.firebaseapp.com",
    projectId: "streamly-87883",
    storageBucket: "streamly-87883.firebasestorage.app",
    messagingSenderId: "553778506908",
    appId: "1:553778506908:web:bf4cc80e128038a3df9159"
};
firebase.initializeApp(firebaseConfig);

const player = new Plyr('#player');

// Função para mudar título do navegador
function updateTitle(title) {
    document.title = title || "Streamly";
}

// Lógica de Fullscreen
document.getElementById('btn-play').addEventListener('click', () => {
    const container = document.getElementById('player-container');
    container.classList.remove('hidden');
    
    // Para Streamtape, você precisaria do link direto do vídeo .mp4
    // Exemplo genérico:
    player.source = {
        type: 'video',
        sources: [{ src: 'LINK_DO_STREAMTAPE_AQUI', type: 'video/mp4' }]
    };
    
    player.play();
    if (container.requestFullscreen) container.requestFullscreen();
});

// Fechar Player
document.getElementById('close-player').addEventListener('click', () => {
    player.pause();
    document.exitFullscreen().catch(() => {});
    document.getElementById('player-container').classList.add('hidden');
});

// Gestão de Perfis (Simulação)
let userProfiles = []; // Buscar do Firestore no Login

function loadProfiles(profiles) {
    const grid = document.getElementById('profiles-grid');
    grid.innerHTML = profiles.map(p => `
        <div class="profile-card" onclick="selectProfile('${p.id}')">
            <img src="${p.avatar}">
            <p>${p.name}</p>
        </div>
    `).join('');
}
const db = firebase.firestore();

async function toggleFavorito(profileId, movieId) {
    const profileRef = db.collection('users').doc(firebase.auth().currentUser.uid)
                         .collection('profiles').doc(profileId);

    const doc = await profileRef.get();
    let favoritos = doc.data().favoritos || [];

    if (favoritos.includes(movieId)) {
        favoritos = favoritos.filter(id => id !== movieId); // Remove
    } else {
        favoritos.push(movieId); // Adiciona
    }

    await profileRef.update({ favoritos });
    alert("Lista de favoritos atualizada!");
}
async function criarPerfil(nomePerfil, avatarUrl) {
    const user = firebase.auth().currentUser;
    const profilesRef = db.collection('users').doc(user.uid).collection('profiles');
    
    const snapshot = await profilesRef.get();
    if (snapshot.size >= 5) {
        alert("Limite de 5 perfis atingido!");
        return;
    }

    await profilesRef.add({
        name: nomePerfil,
        avatar: avatarUrl,
        favoritos: []
    });
    // Recarregar lista de perfis na UI
}
async function atualizarConta(novoEmail, novaSenha) {
    const user = firebase.auth().currentUser;

    try {
        if (novoEmail) await user.updateEmail(novoEmail);
        if (novaSenha) await user.updatePassword(novaSenha);
        alert("Dados atualizados com sucesso!");
    } catch (error) {
        alert("Erro ao atualizar: " + error.message);
    }
}
function abrirDetalhesFilme(filme) {
    // Esconde a home e mostra os detalhes
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('details-page').classList.remove('hidden');
    
    // Altera o título da aba do navegador
    document.title = filme.nome; 
    
    // Preenche a página
    document.getElementById('movie-details-content').innerHTML = `
        <h1>${filme.nome}</h1>
        <p>${filme.descricao}</p>
    `;
    
    // Configura o botão de Play para o link do Streamtape
    document.getElementById('btn-play').onclick = () => iniciarPlayer(filme.urlStreamtape);
}
