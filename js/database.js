// Firebase Database Module - Watch Progress Synchronization
class StreamlyDatabase {
    constructor() {
        this.db = null;
        this.auth = null;
        this.initDatabase();
    }

    initDatabase() {
        this.db = firebase.database();
        this.auth = firebase.auth();
    }

    // Guardar progresso do vídeo
    async saveWatchProgress(movieId, currentTime, duration) {
        try {
            const userId = this.auth.currentUser.uid;
            const timestamp = new Date().getTime();

            await this.db.ref(`users/${userId}/watching/${movieId}`).set({
                currentTime: currentTime,
                duration: duration,
                timestamp: timestamp
            });

            console.log(`Progresso guardado: ${movieId} - ${currentTime}s/${duration}s`);
        } catch (error) {
            console.error('Erro ao guardar progresso:', error.message);
            throw error;
        }
    }

    // Obter progresso do vídeo
    async getWatchProgress(movieId) {
        try {
            const userId = this.auth.currentUser.uid;
            const snapshot = await this.db.ref(`users/${userId}/watching/${movieId}`).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Erro ao obter progresso:', error.message);
            return null;
        }
    }

    // Obter todos os filmes em progresso (para "Continuar a Ver")
    async getContinueWatching() {
        try {
            const userId = this.auth.currentUser.uid;
            const snapshot = await this.db.ref(`users/${userId}/watching`).once('value');
            const data = snapshot.val();

            if (!data) return [];

            // Converter para array e ordenar por timestamp (mais recente primeiro)
            return Object.keys(data)
                .map(movieId => ({
                    movieId: movieId,
                    ...data[movieId]
                }))
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10); // Limitar a 10 filmes
        } catch (error) {
            console.error('Erro ao obter "Continuar a Ver":', error.message);
            return [];
        }
    }

    // Obter tempo atual de um filme
    async getCurrentTime(movieId) {
        try {
            const progress = await this.getWatchProgress(movieId);
            return progress ? progress.currentTime : 0;
        } catch (error) {
            console.error('Erro ao obter tempo atual:', error.message);
            return 0;
        }
    }

    // Verificar se filme foi visto completamente
    async isMovieWatched(movieId) {
        try {
            const progress = await this.getWatchProgress(movieId);
            if (!progress) return false;

            // Considerar visto se passou 90% do filme
            const percentage = (progress.currentTime / progress.duration) * 100;
            return percentage >= 90;
        } catch (error) {
            console.error('Erro ao verificar se filme foi visto:', error.message);
            return false;
        }
    }

    // Eliminar progresso de um filme
    async deleteWatchProgress(movieId) {
        try {
            const userId = this.auth.currentUser.uid;
            await this.db.ref(`users/${userId}/watching/${movieId}`).remove();
            console.log(`Progresso eliminado: ${movieId}`);
        } catch (error) {
            console.error('Erro ao eliminar progresso:', error.message);
            throw error;
        }
    }

    // Listen para mudanças em tempo real
    onWatchProgressChange(movieId, callback) {
        try {
            const userId = this.auth.currentUser.uid;
            this.db.ref(`users/${userId}/watching/${movieId}`).on('value', (snapshot) => {
                callback(snapshot.val());
            });
        } catch (error) {
            console.error('Erro ao configurar listener:', error.message);
        }
    }

    // Remover listener
    offWatchProgressChange(movieId) {
        try {
            const userId = this.auth.currentUser.uid;
            this.db.ref(`users/${userId}/watching/${movieId}`).off();
        } catch (error) {
            console.error('Erro ao remover listener:', error.message);
        }
    }
}

// Instanciar globalmente
const streamlyDatabase = new StreamlyDatabase();