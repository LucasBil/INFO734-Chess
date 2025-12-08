import { ref, computed } from 'vue';

/**
 * Chess Timer Logic
 * Manages time controls for both players with increment support
 */
export class ChessTimer {
    constructor(timeControl = { initial: 600000, increment: 0 }) {
        // Time in milliseconds
        this.whiteTime = ref(timeControl.initial); // 10 minutes default
        this.blackTime = ref(timeControl.initial);
        this.increment = timeControl.increment; // Increment in ms (e.g., 3000 for 3 seconds)
        
        this.activePlayer = ref(null); // 'w' or 'b'
        this.isRunning = ref(false);
        this.intervalId = null;
        this.lastTick = null;
    }

    /**
     * Start the timer for a specific player
     * @param {string} player - 'w' for white, 'b' for black
     */
    start(player) {
        if (this.isRunning.value && this.activePlayer.value === player) {
            return; // Already running for this player
        }

        this.stop(); // Stop any existing timer
        this.activePlayer.value = player;
        this.isRunning.value = true;
        this.lastTick = Date.now();

        this.intervalId = setInterval(() => {
            const now = Date.now();
            const elapsed = now - this.lastTick;
            this.lastTick = now;

            if (player === 'w') {
                this.whiteTime.value = Math.max(0, this.whiteTime.value - elapsed);
                if (this.whiteTime.value === 0) {
                    this.stop();
                    this.onTimeOut?.('w');
                }
            } else {
                this.blackTime.value = Math.max(0, this.blackTime.value - elapsed);
                if (this.blackTime.value === 0) {
                    this.stop();
                    this.onTimeOut?.('b');
                }
            }
        }, 100); // Update every 100ms for smooth display
    }

    /**
     * Stop the timer
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        this.lastTick = null;
    }

    /**
     * Switch timer to the other player and add increment
     * @param {string} fromPlayer - Player who just moved ('w' or 'b')
     */
    switchPlayer(fromPlayer) {
        this.stop();
        
        // Add increment to the player who just moved
        if (this.increment > 0) {
            if (fromPlayer === 'w') {
                this.whiteTime.value += this.increment;
            } else {
                this.blackTime.value += this.increment;
            }
        }

        // Start timer for the other player
        const nextPlayer = fromPlayer === 'w' ? 'b' : 'w';
        this.start(nextPlayer);
    }

    /**
     * Pause the timer
     */
    pause() {
        this.stop();
    }

    /**
     * Resume the timer for the current active player
     */
    resume() {
        if (this.activePlayer.value) {
            this.start(this.activePlayer.value);
        }
    }

    /**
     * Reset timers to initial time
     * @param {Object} timeControl - Optional new time control
     */
    reset(timeControl) {
        this.stop();
        if (timeControl) {
            this.whiteTime.value = timeControl.initial;
            this.blackTime.value = timeControl.initial;
            this.increment = timeControl.increment;
        } else {
            this.whiteTime.value = 600000; // Default 10 minutes
            this.blackTime.value = 600000;
            this.increment = 0;
        }
        this.activePlayer.value = null;
    }

    /**
     * Format time in MM:SS format
     * @param {number} ms - Time in milliseconds
     * @returns {string} Formatted time string
     */
    static formatTime(ms) {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Get formatted time for white
     */
    getWhiteTimeFormatted() {
        return computed(() => ChessTimer.formatTime(this.whiteTime.value));
    }

    /**
     * Get formatted time for black
     */
    getBlackTimeFormatted() {
        return computed(() => ChessTimer.formatTime(this.blackTime.value));
    }

    /**
     * Check if a player is low on time (under 20 seconds)
     * @param {string} player - 'w' or 'b'
     * @returns {boolean}
     */
    isLowTime(player) {
        const time = player === 'w' ? this.whiteTime.value : this.blackTime.value;
        return time < 20000; // Less than 20 seconds
    }

    /**
     * Set callback for when time runs out
     * @param {Function} callback - Function to call when time expires
     */
    onTimeOut(callback) {
        this.onTimeOut = callback;
    }

    /**
     * Destroy timer and clean up
     */
    destroy() {
        this.stop();
        this.whiteTime.value = 0;
        this.blackTime.value = 0;
    }
}

/**
 * Common time control presets (in milliseconds)
 */
export const TimePresets = {
    BULLET_1_0: { initial: 60000, increment: 0, name: '1+0 Bullet' },
    BULLET_1_1: { initial: 60000, increment: 1000, name: '1+1 Bullet' },
    BULLET_2_1: { initial: 120000, increment: 1000, name: '2+1 Bullet' },
    BLITZ_3_0: { initial: 180000, increment: 0, name: '3+0 Blitz' },
    BLITZ_3_2: { initial: 180000, increment: 2000, name: '3+2 Blitz' },
    BLITZ_5_0: { initial: 300000, increment: 0, name: '5+0 Blitz' },
    BLITZ_5_3: { initial: 300000, increment: 3000, name: '5+3 Blitz' },
    RAPID_10_0: { initial: 600000, increment: 0, name: '10+0 Rapid' },
    RAPID_10_5: { initial: 600000, increment: 5000, name: '10+5 Rapid' },
    RAPID_15_10: { initial: 900000, increment: 10000, name: '15+10 Rapid' },
    CLASSICAL_30_0: { initial: 1800000, increment: 0, name: '30+0 Classical' },
    UNLIMITED: { initial: Infinity, increment: 0, name: 'Unlimited' }
};

export default ChessTimer;