// TV Pairing Module
class StreamlyTV {
    constructor() {
        this.database = null;
        this.pairingTimeout = 5 * 60 * 1000; // 5 minutos
    }

    init() {
        this.database = firebase.database();
    }

    // Gerar código de pairing aleatório (6 caracteres alfanuméricos)
    generatePairingCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Criar novo código de pairing (chamado pela app da TV)
    async createPairingCode() {
        try {
            const code = this.generatePairingCode();
            const now = Date.now();
            const expiresAt = now + this.pairingTimeout;

            await this.database.ref(`tv_pairing/${code}`).set({
                createdAt: now,
                expiresAt: expiresAt,
                status: 'pending',
                userId: null
            });

            return code;
        } catch (error) {
            console.error('Erro ao criar código de pairing:', error);
            return null;
        }
    }

    // Validar código de pairing
    async validatePairingCode(code) {
        try {
            const ref = this.database.ref(`tv_pairing/${code}`);
            const snapshot = await ref.once('value');
            const pairingData = snapshot.val();

            if (!pairingData) {
                return null; // Código não existe
            }

            const now = Date.now();
            if (now > pairingData.expiresAt) {
                return null; // Código expirado
            }

            return pairingData;
        } catch (error) {
            console.error('Erro ao validar código de pairing:', error);
            return null;
        }
    }

    // Completar o pairing (associar utilizador ao código)
    async completePairing(code, userId) {
        try {
            await this.database.ref(`tv_pairing/${code}`).update({
                userId: userId,
                status: 'completed',
                completedAt: firebase.database.ServerValue.TIMESTAMP
            });

            return true;
        } catch (error) {
            console.error('Erro ao completar pairing:', error);
            return false;
        }
    }

    // Obter dados do pairing (para a app da TV escutar mudanças)
    async getPairingData(code) {
        try {
            const ref = this.database.ref(`tv_pairing/${code}`);
            const snapshot = await ref.once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Erro ao obter dados do pairing:', error);
            return null;
        }
    }

    // Listener real-time para mudanças no pairing (para a app da TV)
    onPairingCompleted(code, callback) {
        const ref = this.database.ref(`tv_pairing/${code}`);
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && data.status === 'completed' && data.userId) {
                callback(data);
            }
        });

        // Retornar função para desligar o listener
        return () => ref.off('value');
    }

    // Limpar código de pairing (após a TV fazer login)
    async removePairingCode(code) {
        try {
            await this.database.ref(`tv_pairing/${code}`).remove();
            return true;
        } catch (error) {
            console.error('Erro ao remover código de pairing:', error);
            return false;
        }
    }
}

// Initialize TV module
const streamlyTV = new StreamlyTV();
streamlyTV.init();