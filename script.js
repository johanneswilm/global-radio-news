// Global Radio News - JavaScript Functionality

class RadioNewsApp {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.stationName = document.getElementById('stationName');
        this.stationCountry = document.getElementById('stationCountry');
        this.loading = document.getElementById('loading');
        this.statusMessage = document.getElementById('statusMessage');
        this.stationButtons = document.querySelectorAll('.station-btn');
        this.playAllBtn = document.getElementById('playAllPodcastsBtn');

        // Mode toggle elements
        this.liveBtn = document.getElementById('liveBtn');
        this.podcastBtn = document.getElementById('podcastBtn');
        this.liveSection = document.getElementById('liveSection');
        this.podcastSection = document.getElementById('podcastSection');
        this.podcastItems = document.querySelectorAll('.podcast-item');
        this.podcastPlayButtons = document.querySelectorAll('.podcast-play-btn');

        this.currentStation = null;
        this.currentEpisode = null;
        this.isPlaying = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.currentMode = 'live'; // 'live' or 'podcast'

        // Play All Podcasts feature
        this.podcastQueue = []; // Queue for "play all" feature
        this.currentQueueIndex = -1; // Current index in the podcast queue
        this.playingAll = false; // Flag for "play all" mode

        // CORS proxy for RSS feeds
        this.corsProxy = './proxy.php?url=';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudioEvents();
        this.setVolume(70); // Default volume
        this.showWelcomeMessage();
        this.loadPodcastFeeds();
        this.handleURLParameters();
    }

    setupEventListeners() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });

        // Stop button
        this.stopBtn.addEventListener('click', () => {
            this.stop();
        });

        // Volume slider
        this.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });

        // Station buttons
        this.stationButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.dataset.url;
                const name = btn.dataset.name;
                const country = btn.dataset.country;
                this.selectStation(url, name, country, btn);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        if (this.currentStation) {
                            if (this.isPlaying) {
                                this.pause();
                            } else {
                                this.play();
                            }
                        }
                        break;
                    case 'Escape':
                        this.stop();
                        break;
                }
            }
        });

        // Mode toggle listeners
        this.liveBtn.addEventListener('click', () => {
            this.switchMode('live');
        });

        this.podcastBtn.addEventListener('click', () => {
            this.switchMode('podcast');
        });

        // Podcast play button listeners
        this.podcastPlayButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const podcastItem = btn.closest('.podcast-item');
                const episodeData = podcastItem.querySelector('.podcast-episode').dataset;
                if (episodeData.audioUrl) {
                    this.playPodcastEpisode(episodeData, podcastItem);
                    this.playingAll = false; // Exit "play all" mode when manually selecting
                }
            });
        });

        // Play All Podcasts button
        if (this.playAllBtn) {
            this.playAllBtn.addEventListener('click', () => {
                this.playAllPodcasts();
            });
        }

        // Handle visibility change (for mobile battery optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying) {
                // Optional: pause when tab is hidden to save battery
                // this.pause();
            }
        });
    }

    setupAudioEvents() {
        this.audioPlayer.addEventListener('loadstart', () => {
            this.showLoading();
        });

        this.audioPlayer.addEventListener('canplay', () => {
            this.hideLoading();
            this.showStatus('Connected to station', 'success');
            this.retryCount = 0;
        });

        this.audioPlayer.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.enableControls();
        });

        this.audioPlayer.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });

        this.audioPlayer.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();

            // If in "play all" mode, move to the next podcast
            if (this.playingAll) {
                this.playNextInQueue();
            } else {
                this.showStatus('Playback ended', 'success');
            }
        });

        this.audioPlayer.addEventListener('error', (e) => {
            this.hideLoading();
            this.handleError(e);
        });

        this.audioPlayer.addEventListener('stalled', () => {
            this.showStatus('Connection stalled, trying to reconnect...', 'error');
        });
    }

    selectStation(url, name, country, button) {
        // Update UI
        this.updateStationInfo(name, country);
        this.updateActiveButton(button);
        this.updateActivePodcast(null); // Clear podcast selection

        // Stop current stream if playing
        if (this.isPlaying) {
            this.audioPlayer.pause();
        }

        // Set new source
        this.audioPlayer.src = url;
        this.currentStation = { url, name, country, button };
        this.currentEpisode = null; // Clear podcast episode

        // Enable controls
        this.enableControls();

        // Auto-play
        this.play();
    }

    play() {
        if (!this.audioPlayer.src) {
            if (this.currentStation) {
                this.audioPlayer.src = this.currentStation.url;
            } else {
                this.showStatus('No station selected', 'error');
                return;
            }
        }

        const playPromise = this.audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Play error:', error);
                // Autoplay prevented by browser
                if (error.name === 'NotAllowedError') {
                    this.showStatus('Autoplay blocked: Click Play to listen', 'error');
                } else {
                    this.handleError(error);
                }
            });
        }
    }

    pause() {
        this.audioPlayer.pause();
    }

    stop() {
        if (this.isPlaying) {
            this.audioPlayer.pause();
        }

        // Reset player
        this.audioPlayer.src = '';
        this.isPlaying = false;
        this.updatePlayButton();

        // Reset UI
        this.stationName.textContent = 'Select a station';
        this.stationCountry.textContent = '';

        // Update buttons
        this.updateActiveButton(null);
        this.updateActivePodcast(null);

        // Reset current selection
        this.currentStation = null;
        this.currentEpisode = null;

        // Disable controls
        this.disableControls();

        // Stop "play all" mode
        this.playingAll = false;
        if (this.playAllBtn) {
            this.playAllBtn.classList.remove('active');
        }
    }

    setVolume(value) {
        // Ensure volume is between 0 and 1
        const volume = Math.max(0, Math.min(100, value)) / 100;

        this.audioPlayer.volume = volume;
        this.volumeSlider.value = value;

        // Save to localStorage for persistence
        try {
            localStorage.setItem('radioNewsVolume', value);
        } catch (e) {
            console.warn('Could not save volume to localStorage', e);
        }
    }

    updateStationInfo(name, info) {
        this.stationName.textContent = name;
        this.stationCountry.textContent = info;
    }

    updateActiveButton(activeButton) {
        this.stationButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeButton) activeButton.classList.add('active');
    }

    updateActivePodcast(activePodcast) {
        document.querySelectorAll('.podcast-item').forEach(item => {
            item.classList.remove('playing');
        });
        if (activePodcast) activePodcast.classList.add('playing');
    }

    updatePlayButton() {
        const playIcon = this.playPauseBtn.querySelector('.play-icon');
        const pauseIcon = this.playPauseBtn.querySelector('.pause-icon');

        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }

    enableControls() {
        this.playPauseBtn.disabled = false;
        this.stopBtn.disabled = false;
    }

    disableControls() {
        this.playPauseBtn.disabled = true;
        this.stopBtn.disabled = true;
    }

    showLoading() {
        this.loading.style.display = 'block';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showStatus(message, type = 'success') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = 'status-message';
        this.statusMessage.classList.add(type);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideStatus();
        }, 5000);
    }

    hideStatus() {
        this.statusMessage.className = 'status-message';
        this.statusMessage.textContent = '';
    }

    showWelcomeMessage() {
        this.showStatus('Welcome to Global Radio News! Select a station to begin.', 'success');
    }

    handleError(error) {
        console.error('Audio Error:', error);

        let errorMessage = 'Connection error. Please try again.';

        // Check if we have a specific error from the audio element
        if (this.audioPlayer.error) {
            switch (this.audioPlayer.error.code) {
                case 1: // MEDIA_ERR_ABORTED
                    errorMessage = 'Playback aborted by the user.';
                    break;
                case 2: // MEDIA_ERR_NETWORK
                    errorMessage = 'Network error. Please check your connection.';

                    // Auto-retry for network errors
                    if (this.retryCount < this.maxRetries) {
                        this.retryCount++;
                        errorMessage += ` Retrying (${this.retryCount}/${this.maxRetries})...`;

                        setTimeout(() => {
                            if (this.currentStation) {
                                this.audioPlayer.src = this.currentStation.url;
                                this.play();
                            }
                        }, 3000);
                    }
                    break;
                case 3: // MEDIA_ERR_DECODE
                    errorMessage = 'Audio decoding error. The stream may be unavailable.';
                    break;
                case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                    errorMessage = 'This audio format is not supported by your browser.';
                    break;
                default:
                    errorMessage = `Audio error: ${this.audioPlayer.error.message || 'Unknown error'}`;
            }
        }

        // If we're in "play all" mode and encounter an error, try the next podcast
        if (this.playingAll) {
            errorMessage += ' Skipping to next podcast...';
            setTimeout(() => this.playNextInQueue(), 1000);
        }

        this.showStatus(errorMessage, 'error');
    }

    // Check for browser audio support
    checkAudioSupport() {
        const audioTest = document.createElement('audio');

        if (!audioTest.canPlayType) {
            this.showStatus('Your browser does not support HTML5 audio. Please update your browser.', 'error');
            return false;
        }

        const formats = {
            mp3: audioTest.canPlayType('audio/mpeg;'),
            aac: audioTest.canPlayType('audio/aac;'),
            ogg: audioTest.canPlayType('audio/ogg; codecs="vorbis"')
        };

        return formats;
    }

    // Switch between live and podcast modes
    switchMode(mode) {
        if (mode === this.currentMode) return;

        this.currentMode = mode;

        // Update UI
        if (mode === 'live') {
            this.liveBtn.classList.add('active');
            this.podcastBtn.classList.remove('active');
            this.liveSection.style.display = 'block';
            this.podcastSection.style.display = 'none';
        } else {
            this.liveBtn.classList.remove('active');
            this.podcastBtn.classList.add('active');
            this.liveSection.style.display = 'none';
            this.podcastSection.style.display = 'block';
        }

        // Stop current playback
        this.stop();
    }

    // Load RSS feeds for all podcast items
    async loadPodcastFeeds() {
        // Disable Play All button until feeds are loaded
        if (this.playAllBtn) {
            this.playAllBtn.disabled = true;
        }

        this.podcastItems.forEach(async (item) => {
            const feedUrl = item.dataset.feed;
            const episodeElement = item.querySelector('.podcast-episode');
            const episodeName = episodeElement.dataset.name;

            try {
                await this.loadLatestEpisode(feedUrl, episodeElement, episodeName);
            } catch (error) {
                console.error(`Failed to load ${episodeName}:`, error);
                this.updateEpisodeUI(episodeElement, {
                    title: 'Failed to load episode',
                    date: '--',
                    duration: '--',
                    audioUrl: null
                });
            }
        });
    }

    // Load the latest episode from an RSS feed or JSON API
    async loadLatestEpisode(feedUrl, episodeElement, episodeName) {
        let lastError = null;

        try {
            const proxyUrl = this.corsProxy + encodeURIComponent(feedUrl);
            const proxyResp = await fetch(proxyUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (proxyResp.ok) {
                const data = await proxyResp.json();
                if (data.error) throw new Error(data.error);
                const rssText = data.contents;
                if (!rssText) throw new Error('Empty RSS content');

                // Parse RSS XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(rssText, 'text/xml');
                const parserError = xmlDoc.querySelector('parsererror');
                if (parserError) throw new Error('XML parsing failed');

                const firstItem = xmlDoc.querySelector('item');
                if (!firstItem) throw new Error('No episodes found in feed');

                const episodeData = this.parseEpisodeData(firstItem);
                if (!episodeData.audioUrl) throw new Error('No audio URL found in episode');

                this.updateEpisodeUI(episodeElement, episodeData);
                episodeElement.dataset.audioUrl = episodeData.audioUrl;
                episodeElement.dataset.title = episodeData.title;
                return;
            } else {
                throw new Error(`HTTP error ${proxyResp.status}`);
            }
        } catch (error) {
            lastError = error;
            console.error(`Failed to load via proxy: ${error.message}`);
            // Fallback to CORS proxy (continue to next method)
        }
    }

    // Parse episode data from RSS item
    parseEpisodeData(item) {
        console.log({item, html: item.outerHTML});
        const title = this.cleanText(item.querySelector('title')?.textContent || 'Untitled Episode');
        const pubDate = item.querySelector('pubDate')?.textContent || '';

        // Try multiple duration selectors
        const durationSelectors = [
            'itunes\\:duration',
            'duration',
            'podcast\\:duration'
        ];

        let duration = '';
        for (const selector of durationSelectors) {
            const element = item.querySelector(selector);
            if (element?.textContent) {
                duration = element.textContent;
                break;
            }
        }

        // Find audio enclosure - try multiple approaches
        let audioUrl = null;

        // Method 1: Standard RSS enclosure
        const enclosure = item.querySelector('enclosure[type*="audio"]');
        if (enclosure) {
            audioUrl = enclosure.getAttribute('url');
        }

        // Method 2: Any enclosure if audio-specific not found
        if (!audioUrl) {
            const anyEnclosure = item.querySelector('enclosure');
            if (anyEnclosure) {
                const url = anyEnclosure.getAttribute('url');
                // Check if URL looks like audio
                if (url && (url.includes('.mp3') || url.includes('.m4a') || url.includes('.wav'))) {
                    audioUrl = url;
                }
            }
        }

        // Method 3: Look for media:content
        if (!audioUrl) {
            const mediaContent = item.querySelector('media\\:content[type*="audio"], media\\:content[medium="audio"]');
            if (mediaContent) {
                audioUrl = mediaContent.getAttribute('url');
            }
        }

        // Method 4: Look inside content or description for audio links
        if (!audioUrl) {
            const contentElements = [
                item.querySelector('content\\:encoded'),
                item.querySelector('description')
            ];

            for (const element of contentElements) {
                if (element && element.textContent) {
                    const mp3Match = element.textContent.match(/https?:\/\/[^"'\s]+\.(?:mp3|m4a|wav)/i);
                    if (mp3Match) {
                        audioUrl = mp3Match[0];
                        break;
                    }
                }
            }
        }

        // Format date
        let formattedDate = '';
        if (pubDate) {
            try {
                formattedDate = new Date(pubDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (e) {
                formattedDate = pubDate;
            }
        }

        // Format duration
        let formattedDuration = duration;
        if (duration) {
            // If duration is in seconds (just a number)
            if (/^\d+$/.test(duration)) {
                const seconds = parseInt(duration, 10);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                formattedDuration = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
            // If duration is already in MM:SS format, leave as is
        }

        return {
            title,
            date: formattedDate,
            duration: formattedDuration,
            audioUrl
        };
    }

    // Utility function to clean text from RSS feeds
    cleanText(text) {
        return text ? text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim() : '';
    }

    // Format duration from milliseconds
    formatDuration(ms) {
        if (!ms) return '';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Update episode UI with data
    updateEpisodeUI(episodeElement, episodeData) {
        const titleElement = episodeElement.querySelector('.episode-title');
        const dateElement = episodeElement.querySelector('.episode-date');
        const durationElement = episodeElement.querySelector('.episode-duration');
        const playButton = episodeElement.querySelector('.podcast-play-btn');

        titleElement.textContent = episodeData.title;
        dateElement.textContent = episodeData.date;
        durationElement.textContent = episodeData.duration;

        if (episodeData.audioUrl) {
            playButton.disabled = false;
            episodeElement.parentElement.classList.remove('loading');

            // Enable Play All button once at least one episode is loaded
            if (this.playAllBtn) {
                this.playAllBtn.disabled = false;
            }
        } else {
            playButton.disabled = true;
            titleElement.textContent = 'Audio not available';
        }
    }

    // Play a podcast episode
    playPodcastEpisode(episodeData, podcastItem) {
        const episodeName = episodeData.name || 'Podcast Episode';
        const audioUrl = episodeData.audioUrl;
        const title = episodeData.title || 'Latest Episode';

        if (!audioUrl) {
            this.showStatus('Audio not available for this episode', 'error');
            return;
        }

        // Update UI
        this.updateStationInfo(episodeName, title);
        this.updateActivePodcast(podcastItem);
        this.updateActiveButton(null); // Clear live stream selection

        // Stop current stream if playing
        if (this.isPlaying) {
            this.audioPlayer.pause();
        }
        // Set new source
        this.audioPlayer.src = audioUrl;
        this.currentEpisode = { episodeData, podcastItem };
        this.currentStation = null; // Clear live station

        // Enable controls
        this.enableControls();

        // Auto-play the episode
        this.play();

        // Only show status message if not in "play all" mode
        if (!this.playingAll) {
            this.showStatus(`Playing: ${title}`, 'success');
        }
    }

    // Play all podcasts in sequence
    playAllPodcasts() {
        // Stop any current playback
        this.stop();

        // Build queue of all available podcasts
        this.podcastQueue = [];
        this.currentQueueIndex = -1;

        const podcastItems = document.querySelectorAll('.podcast-item');
        podcastItems.forEach(item => {
            const episodeElement = item.querySelector('.podcast-episode');
            const episodeData = episodeElement.dataset;

            if (episodeData.audioUrl) {
                this.podcastQueue.push({
                    episodeData,
                    podcastItem: item
                });
            }
        });

        if (this.podcastQueue.length === 0) {
            this.showStatus('No podcasts available to play', 'error');
            return;
        }

        // Start playing the queue
        this.playingAll = true;
        this.showStatus(`Playing all podcasts (${this.podcastQueue.length} episodes)`, 'success');

        // Visually highlight the Play All button
        if (this.playAllBtn) {
            this.playAllBtn.classList.add('active');
        }

        // Start playing the first item
        this.playNextInQueue();
    }

    // Play the next podcast in the queue
    playNextInQueue() {
        this.currentQueueIndex++;

        if (this.currentQueueIndex < this.podcastQueue.length) {
            const nextItem = this.podcastQueue[this.currentQueueIndex];
            this.playPodcastEpisode(nextItem.episodeData, nextItem.podcastItem);

            // Update status with queue position
            this.showStatus(`Playing ${this.currentQueueIndex + 1} of ${this.podcastQueue.length}: ${nextItem.episodeData.title}`, 'success');
        } else {
            // End of queue reached
            this.playingAll = false;
            this.currentQueueIndex = -1;
            this.showStatus('Finished playing all podcasts', 'success');
            this.stop();

            // Remove highlight from Play All button
            if (this.playAllBtn) {
                this.playAllBtn.classList.remove('active');
            }
        }
    }

    // Enhanced error handling for podcast loading
    handlePodcastError(episodeName, error) {
        console.error(`Podcast error for ${episodeName}:`, error);

        // Find the podcast element
        const podcastItem = Array.from(this.podcastItems).find(item => {
            const episodeElement = item.querySelector('.podcast-episode');
            return episodeElement && episodeElement.dataset.name === episodeName;
        });

        if (podcastItem) {
            const episodeElement = podcastItem.querySelector('.podcast-episode');
            const titleElement = episodeElement.querySelector('.episode-title');
            const dateElement = episodeElement.querySelector('.episode-date');
            const durationElement = episodeElement.querySelector('.episode-duration');
            const playButton = episodeElement.querySelector('.podcast-play-btn');

            titleElement.textContent = 'Unable to load episode';
            dateElement.textContent = '--';
            durationElement.textContent = '--';
            playButton.disabled = true;
        }
    }

    // Handle URL parameters for direct station access
    handleURLParameters() {
        const params = new URLSearchParams(window.location.search);

        // Check for station parameter
        const stationParam = params.get('station');
        if (stationParam) {
            // Find the station button by name
            const stationButton = Array.from(this.stationButtons).find(btn =>
                btn.dataset.name.toLowerCase() === stationParam.toLowerCase()
            );

            if (stationButton) {
                // Auto-select the station
                const url = stationButton.dataset.url;
                const name = stationButton.dataset.name;
                const country = stationButton.dataset.country;
                this.selectStation(url, name, country, stationButton);
            }
        }

        // Check for mode parameter
        const modeParam = params.get('mode');
        if (modeParam && (modeParam === 'podcast' || modeParam === 'live')) {
            this.switchMode(modeParam);
        }

        // Check for podcast parameter
        const podcastParam = params.get('podcast');
        if (podcastParam) {
            // Switch to podcast mode
            this.switchMode('podcast');

            // Find the podcast by name
            const podcastItem = Array.from(this.podcastItems).find(item => {
                const episodeElement = item.querySelector('.podcast-episode');
                return episodeElement && episodeElement.dataset.name.toLowerCase() === podcastParam.toLowerCase();
            });

            // Auto-play when loaded
            if (podcastItem) {
                const checkPodcastLoaded = setInterval(() => {
                    const episodeElement = podcastItem.querySelector('.podcast-episode');
                    if (episodeElement.dataset.audioUrl) {
                        clearInterval(checkPodcastLoaded);
                        this.playPodcastEpisode(episodeElement.dataset, podcastItem);
                    }
                }, 500);

                // Clear interval after 10 seconds to prevent infinite checking
                setTimeout(() => clearInterval(checkPodcastLoaded), 10000);
            }
        }

        // Check for action parameter
        const actionParam = params.get('action');
        if (actionParam === 'playall') {
            // Switch to podcast mode first
            this.switchMode('podcast');

            // Wait for podcasts to load
            const checkPlayAllReady = setInterval(() => {
                // Check if we have at least one playable podcast
                const playablePodcasts = document.querySelectorAll('.podcast-play-btn:not(:disabled)');
                if (playablePodcasts.length > 0) {
                    clearInterval(checkPlayAllReady);
                    // Play all podcasts
                    this.playAllPodcasts();
                }
            }, 1000);

            // Clear interval after 15 seconds to prevent infinite checking
            setTimeout(() => clearInterval(checkPlayAllReady), 15000);
        }
    }
}

// Initialize app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new RadioNewsApp();
});
