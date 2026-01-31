import { db, auth } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Proteger a página: Só entra quem estiver logado
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        console.log("Utilizador ligado:", user.email);
        loadMovies();
    }
});

// Botão de Sair
document.getElementById('logoutBtn').onclick = () => signOut(auth);

// 2. Carregar Filmes do Firebase
async function loadMovies() {
    try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const allMovies = [];
        
        querySnapshot.forEach((doc) => {
            allMovies.push({ id: doc.id, ...doc.data() });
        });

        // Configurar o Destaque (Hero)
        setupHero(allMovies);

        // Renderizar Carrosséis por Categoria
        renderCarousel(allMovies, 'Animes', 'animeCarousel');
        renderCarousel(allMovies, 'Ação', 'actionCarousel');
        renderCarousel(allMovies, 'Destaque', 'featuredCarousel');

    } catch (error) {
        console.error("Erro ao carregar filmes:", error);
    }
}

// 3. Configurar o Banner Principal (Hero)
function setupHero(movies) {
    if (movies.length === 0) return;
    
    // Escolhe um filme aleatório para o destaque
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    
    document.getElementById('heroBanner').style.backgroundImage = `url('${randomMovie.Banner}')`;
    document.getElementById('heroTitle').innerText = randomMovie.Título || randomMovie.Titulo;
    document.getElementById('heroDescription').innerText = randomMovie.Sinopse;
    document.getElementById('heroYear').innerText = randomMovie.Ano || "2024";
    document.getElementById('heroDuration').innerText = randomMovie.Duracao || "--";
    document.getElementById('heroRating').innerText = randomMovie.Classificacao || "12";

    // Ao clicar em "Ver Agora", vai para os detalhes
    document.getElementById('heroPlayBtn').onclick = () => {
        window.location.href = `details.html?id=${randomMovie.id}`;
    };
    
    document.getElementById('heroMoreInfoBtn').onclick = () => {
        window.location.href = `details.html?id=${randomMovie.id}`;
    };
}

// 4. Criar os Carrosséis
function renderCarousel(movies, category, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    // Filtra os filmes pela categoria (campo "Categoria" no Firestore)
    const filtered = movies.filter(m => m.Categoria === category);

    filtered.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Título}">
            <div class="movie-card-info">
                <h3>${movie.Título || movie.Titulo}</h3>
                <p>${movie.Ano || ''} • ${movie.Duracao || ''}</p>
            </div>
        `;
        
        card.onclick = () => {
            window.location.href = `details.html?id=${movie.id}`;
        };
        
        container.appendChild(card);
    });
}
