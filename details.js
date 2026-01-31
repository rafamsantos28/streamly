import { db } from './firebase-config.js';
import { doc, getDoc, collection, getDocs, limit, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
let movieData = null;

async function initDetails() {
    if (!movieId) return window.location.href = 'app';

    const docRef = doc(db, "movies", movieId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        movieData = docSnap.data();
        renderMovieDetails(movieData);
        loadRelatedMovies(movieData.Categoria);
    }
}

function renderMovieDetails(data) {
    document.title = `${data.Título} | Streamly+`;
    document.getElementById('detailsBg').style.backgroundImage = `url('${data.Banner}')`;
    document.getElementById('moviePoster').src = data.Poster;
    document.getElementById('movieTitle').innerText = data.Título;
    document.getElementById('movieSynopsis').innerText = data.Sinopse;
    document.getElementById('movieRating').innerText = data.Classificacao || "12";
    document.getElementById('movieYear').innerText = data.Ano || "2024";
    document.getElementById('movieDuration').innerText = data.Duracao || "--";
    document.getElementById('movieGenre').innerText = data.Categoria || "";
    
    // Detalhes Técnicos
    document.getElementById('movieCast').innerText = data.Elenco || "Informação não disponível";
    document.getElementById('movieDirector').innerText = data.Diretor || "Informação não disponível";
    document.getElementById('movieAudio').innerText = data.Audio || "Francês (Original)";
    document.getElementById('movieSubs').innerText = data.Legendas || "Português, Inglês";
}

// Lógica de Troca de Abas
window.switchTab = (tab) => {
    const tabRec = document.getElementById('tabRec');
    const tabDet = document.getElementById('tabDet');
    const contentRec = document.getElementById('contentRecommendations');
    const contentDet = document.getElementById('contentDetails');

    if (tab === 'recommendations') {
        tabRec.classList.add('active');
        tabDet.classList.remove('active');
        contentRec.classList.add('active');
        contentDet.classList.remove('active');
    } else {
        tabDet.classList.add('active');
        tabRec.classList.remove('active');
        contentDet.classList.add('active');
        contentRec.classList.remove('active');
    }
};

// Player com Streamtape
document.getElementById('playBtn').onclick = () => openPlayer(movieData.StreamtapeID);
document.getElementById('trailerBtn').onclick = () => openPlayer(movieData.TrailerID); // Se for ID do Vimeo/YT

function openPlayer(id) {
    const modal = document.getElementById('videoModal');
    const target = document.getElementById('videoTarget');
    
    // Aqui usamos o embed do Streamtape como decidimos
    target.innerHTML = `<iframe src="https://streamtape.com/e/${id}" allowfullscreen></iframe>`;
    modal.style.display = 'flex';
}

document.getElementById('closeVideo').onclick = () => {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoTarget').innerHTML = '';
};

initDetails();
