import { defineStore } from 'pinia'
import Profile from '@/models/Profile'

export const useSocketStore = defineStore('socket', {
    state: () => {
        return {
            socket : null,
            isConnected : false,
            roomId : null,
            playerId : null,
            opponent : null,
            color : null,
            listeners: {}
        }
    },
    actions : {
        on(event, callback) {
            this.listeners[event] = callback
        },
        emit(event, data) {
            if (this.listeners[event]) this.listeners[event](data)
        },
        connect(profile) {
            this.socket = new WebSocket(`ws://${window.location.hostname}:8081`)

            this.socket.onopen = () => {
                this.isConnected = true
                this.send('LOGIN', profile);
                console.log('✅ Connecté au serveur WebSocket')
            }

            this.socket.onclose = () => {
                this.isConnected = false
                console.log('❌ Déconnecté du serveur WebSocket')
            }

            this.socket.onmessage = (event) => {
                const msg = JSON.parse(event.data)
                this.handleMessage(msg)
            }
        },
        disconnect() {
            if (this.socket) {
                console.log('[WS] Closing connection…');
                this.socket.close();
                this.socket = null;
                this.isConnected = false;
            }
        },
        send(type, data = null) {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return
            this.socket.send(JSON.stringify({ type, data }))
        },
        handleMessage(msg) {
            switch (msg.type) {
                case 'CONNECTED':
                    this.playerId = msg.id
                    this.emit('CONNECTED', msg)
                    break

                case 'WAITING':
                    this.emit('WAITING', msg.data)
                    break

                case 'MATCH_FOUND':
                    this.opponent = {
                        'id' : msg.data.opponent.id,
                        'profile' : Profile.loadJSONModel(msg.data.opponent.profile),
                    };
                    this.color = msg.data.color;
                    this.roomId = msg.data.roomId;
                    this.emit('MATCH_FOUND', msg.data);
                    break

                case 'MOVE':
                    // ici tu mets à jour le plateau dans un autre store par exemple
                    this.emit('MOVE', msg.data);
                    break

                case 'CHAT':
                    this.emit('CHAT', msg.data)
                    break

                case 'OPPONENT_LEFT':
                    this.emit('OPPONENT_LEFT', null);
                    break
            }
        },
        sendChat(text) {
            this.send('CHAT', text)
        },
        sendMove(move) {
            this.send('MOVE', move)
        },
        findGame(options = {}) {
            this.send('FIND_GAME', options)
        },
    }
})