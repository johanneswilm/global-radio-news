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
        this.playAllBtn = document.getElementById('playAllPodcastsBtn');
        this.clearHistoryBtn = document.getElementById('clearPlayedHistoryBtn');

        // Mode toggle elements
        this.liveBtn = document.getElementById('liveBtn');
        this.podcastBtn = document.getElementById('podcastBtn');
        this.liveSection = document.getElementById('liveSection');
        this.podcastSection = document.getElementById('podcastSection');

        // Containers for dynamic content
        this.stationsContainer = document.getElementById('stationsContainer');
        this.podcastsContainer = document.getElementById('podcastsContainer');

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

        // Configuration
        this.config = null;

        this.init();
    }

    async init() {
        try {
            // Register service worker for PWA functionality
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('./sw.js');
                    console.log('Service Worker registered successfully:', registration.scope);

                    // Handle service worker updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker is available, show update notification
                                this.showStatus('App updated! Reload to get the latest features.', 'info', 10000);
                            }
                        });
                    });
                } catch (error) {
                    console.warn('Service Worker registration failed:', error);
                }
            }

            // Load configuration first
            this.config = await window.radioConfig.load();

            // Update page info from config
            this.updatePageInfo();

            // Setup offline detection and caching
            this.setupOfflineDetection();

            // Setup PWA install prompt
            this.setupPWAInstall();

            // Generate dynamic content
            this.generateStations();
            this.generatePodcasts();

            // Setup event listeners after content is generated
            this.setupEventListeners();
            this.setupAudioEvents();

            // Set default volume from config
            const defaultVolume = window.radioConfig.getDefaultVolume();
            this.setVolume(defaultVolume);

            this.showWelcomeMessage();
            this.loadPodcastFeeds();
            this.handleURLParameters();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.handleError('Configuration Error', 'Failed to load application configuration.');
        }
    }

    updatePageInfo() {
        const title = window.radioConfig.getTitle();
        const description = window.radioConfig.getDescription();

        document.getElementById('appTitle').textContent = `📻 ${title}`;
        document.getElementById('appDescription').textContent = description;
        document.title = title;
    }

    generateStations() {
        const stations = window.radioConfig.getStations();
        this.stationsContainer.innerHTML = '';

        for (const [country, countryData] of Object.entries(stations)) {
            const countrySection = document.createElement('div');
            countrySection.className = 'country-section';

            const countryHeader = document.createElement('h3');
            countryHeader.textContent = `${countryData.flag} ${country}`;
            countrySection.appendChild(countryHeader);

            const stationGrid = document.createElement('div');
            stationGrid.className = 'station-grid';

            for (const station of countryData.stations) {
                const stationBtn = document.createElement('button');
                stationBtn.className = 'station-btn';
                stationBtn.dataset.url = station.url;
                stationBtn.dataset.name = station.name;
                stationBtn.dataset.country = country;
                stationBtn.dataset.id = station.id;

                stationBtn.innerHTML = `
                    <div class="station-title">${station.name}</div>
                    <div class="station-desc">${station.description}</div>
                `;

                stationGrid.appendChild(stationBtn);
            }

            countrySection.appendChild(stationGrid);
            this.stationsContainer.appendChild(countrySection);
        }
    }

    generatePodcasts() {
        const podcasts = window.radioConfig.getPodcasts();
        this.podcastsContainer.innerHTML = '';

        for (const [country, countryData] of Object.entries(podcasts)) {
            const countrySection = document.createElement('div');
            countrySection.className = 'country-section';

            const countryHeader = document.createElement('h3');
            countryHeader.textContent = `${countryData.flag} ${country}`;
            countrySection.appendChild(countryHeader);

            const podcastGrid = document.createElement('div');
            podcastGrid.className = 'podcast-grid';

            for (const feed of countryData.feeds) {
                const podcastItem = document.createElement('div');
                podcastItem.className = 'podcast-item';
                podcastItem.dataset.feed = feed.feedUrl;
                podcastItem.dataset.type = feed.type || 'rss';
                podcastItem.dataset.id = feed.id;
                podcastItem.dataset.requiresProxy = feed.requiresProxy || false;

                podcastItem.innerHTML = `
                    <div class="podcast-header">
                        <div class="podcast-title">${feed.name}</div>
                        <div class="podcast-country">${country}</div>
                    </div>
                    <div class="podcast-episode" data-name="${feed.name}" data-disabled="true">
                        <div class="episode-info">
                            <div class="episode-title">Loading...</div>
                            <div class="episode-meta">
                                <span class="episode-date">--</span>
                                <span class="episode-duration">--</span>
                            </div>
                        </div>
                    </div>
                `;

                podcastGrid.appendChild(podcastItem);
            }

            countrySection.appendChild(podcastGrid);
            this.podcastsContainer.appendChild(countrySection);
        }
    }

    setupEventListeners() {
        // Get freshly generated elements
        this.stationButtons = document.querySelectorAll('.station-btn');
        this.podcastItems = document.querySelectorAll('.podcast-item');

        // Play/Pause button
        this.playPauseBtn?.addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });

        // Stop button
        this.stopBtn?.addEventListener('click', () => {
            this.stop();
        });

        // Volume slider
        this.volumeSlider?.addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });

        // Station buttons
        this.stationButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const stationData = {
                    url: btn.dataset.url,
                    name: btn.dataset.name,
                    country: btn.dataset.country,
                    id: btn.dataset.id
                };
                this.selectStation(stationData);
                this.play();
            });
        });

        // Mode toggle buttons
        this.liveBtn?.addEventListener('click', () => {
            this.switchMode('live');
        });

        this.podcastBtn?.addEventListener('click', () => {
            this.switchMode('podcast');
        });

        // Podcast items
        this.podcastItems.forEach(podcastItem => {
            podcastItem.addEventListener('click', (e) => {
                e.stopPropagation();
                const episodeElement = podcastItem.querySelector('.podcast-episode');
                const feedName = episodeElement.dataset.name;
                const feedId = podcastItem.dataset.id;
                this.playPodcastEpisode(episodeElement, feedName, feedId);
            });
        });

        // Play All Podcasts button
        this.playAllBtn?.addEventListener('click', () => {
            this.playAllPodcasts();
        });

        // Clear played history button
        this.clearHistoryBtn?.addEventListener('click', () => {
            if (confirm('This will clear all played episode history. Continue?')) {
                this.clearPlayedEpisodes();
                this.updatePlayAllButtonText();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return; // Don't trigger on form inputs

            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    if (this.isPlaying) {
                        this.pause();
                    } else {
                        this.play();
                    }
                    break;
                case 'KeyS':
                    e.preventDefault();
                    this.stop();
                    break;
            }
        });
    }

    setupAudioEvents() {
        this.audioPlayer.addEventListener('loadstart', () => {
            this.showLoading();
        });

        this.audioPlayer.addEventListener('canplay', () => {
            this.hideLoading();
            this.enableControls();
            this.retryCount = 0; // Reset retry count on successful load
        });

        this.audioPlayer.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.hideStatus();
        });

        this.audioPlayer.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });

        this.audioPlayer.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();

            // Mark current episode as played if it's a podcast
            if (this.currentEpisode) {
                const episodeId = this.getEpisodeId(this.currentEpisode.element, this.currentEpisode.feedName);
                this.markEpisodeAsPlayed(episodeId);
                this.updatePlayAllButtonText();
            }

            // If playing all podcasts, move to next
            if (this.playingAll && this.podcastQueue.length > 0) {
                this.playNextInQueue();
            }
        });

        this.audioPlayer.addEventListener('error', (e) => {
            this.handleError('Playback Error', 'Unable to play the selected station. The stream may be temporarily unavailable.');
            this.hideLoading();
        });

        this.audioPlayer.addEventListener('stalled', () => {
            this.showStatus('Buffering...', 'info');
        });

        this.audioPlayer.addEventListener('waiting', () => {
            this.showStatus('Buffering...', 'info');
        });
    }

    selectStation(stationData) {
        this.currentStation = stationData;
        this.currentEpisode = null; // Clear any podcast episode
        this.playingAll = false; // Stop "play all" mode

        this.audioPlayer.src = stationData.url;
        this.updateStationInfo(stationData.name, stationData.country);
        this.updateActiveButton(document.querySelector(`[data-url="${stationData.url}"]`));
        this.updateActivePodcast(null); // Clear podcast selection

        // Auto-play if supported
        if (this.audioPlayer.autoplay !== false) {
            this.play();
        }
    }

    play() {
        if (!this.audioPlayer.src) {
            this.showStatus('Please select a station first', 'error');
            return;
        }

        this.showLoading();
        this.audioPlayer.play().catch(error => {
            console.error('Play error:', error);
            this.handleError('Playback Error', 'Unable to start playback. Please try again.');
        });
    }

    pause() {
        this.audioPlayer.pause();
    }

    stop() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayButton();
        this.hideLoading();
        this.hideStatus();

        // Stop "play all" mode
        this.playingAll = false;
        this.currentQueueIndex = -1;

        // If we have a current episode, reload it
        if (this.currentEpisode && this.currentEpisode.audioUrl) {
            this.audioPlayer.src = this.currentEpisode.audioUrl;
            this.audioPlayer.load();
        } else if (this.currentStation) {
            // Reload the live stream
            this.audioPlayer.src = this.currentStation.url;
            this.audioPlayer.load();
        } else {
            // Clear the audio source
            this.audioPlayer.removeAttribute('src');
            this.audioPlayer.load();
            this.updateStationInfo('Select a station', '');
            this.updateActiveButton(null);
            this.updateActivePodcast(null);
            this.disableControls();
        }
    }

    setVolume(value) {
        this.audioPlayer.volume = value / 100;
        if (this.volumeSlider) {
            this.volumeSlider.value = value;
        }
    }

    updateStationInfo(name, country) {
        this.stationName.textContent = name;
        this.stationCountry.textContent = country;
    }

    updateActiveButton(activeButton) {
        this.stationButtons.forEach(btn => btn.classList.remove('active'));
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    updateActivePodcast(activeEpisode) {
        this.podcastItems.forEach(item => item.classList.remove('active'));
        if (activeEpisode) {
            const item = activeEpisode.closest('.podcast-item');
            if (item) {
                item.classList.add('active');
            }
        }
    }

    updatePlayButton() {
        const playIcon = this.playPauseBtn?.querySelector('.play-icon');
        const pauseIcon = this.playPauseBtn?.querySelector('.pause-icon');

        if (playIcon && pauseIcon) {
            if (this.isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline';
            } else {
                playIcon.style.display = 'inline';
                pauseIcon.style.display = 'none';
            }
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

    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.style.display = 'block';

        // Auto-hide after 5 seconds for non-error messages
        if (type !== 'error') {
            setTimeout(() => this.hideStatus(), 5000);
        }
    }

    hideStatus() {
        this.statusMessage.style.display = 'none';
    }

    showWelcomeMessage() {
        this.showStatus('Welcome! Select a station to start listening to live news.', 'info');
    }

    handleError(title, message) {
        console.error(title + ':', message);
        this.hideLoading();
        this.isPlaying = false;
        this.updatePlayButton();

        // Retry logic for network errors
        if (this.retryCount < this.maxRetries && (
            message.includes('network') ||
            message.includes('temporarily unavailable') ||
            message.includes('Unable to play')
        )) {
            this.retryCount++;
            this.showStatus(`Connection failed. Retrying... (${this.retryCount}/${this.maxRetries})`, 'info');

            setTimeout(() => {
                if (this.currentStation) {
                    this.play();
                }
            }, 2000 * this.retryCount); // Exponential backoff

            return;
        }

        // Show persistent error message
        this.showStatus(`${title}: ${message}`, 'error');

        // Check for audio support issues
        if (!this.checkAudioSupport()) {
            this.showStatus('Your browser does not support HTML5 audio. Please update your browser.', 'error');
        }
    }

    // Check if the browser supports audio playback
    checkAudioSupport() {
        const audio = document.createElement('audio');
        return !!(audio.canPlayType && (
            audio.canPlayType('audio/mpeg;').replace(/no/, '') ||
            audio.canPlayType('audio/mp3;').replace(/no/, '') ||
            audio.canPlayType('audio/ogg;').replace(/no/, '') ||
            audio.canPlayType('audio/wav;').replace(/no/, '')
        ));
    }

    // Switch between live and podcast modes
    switchMode(mode) {
        this.currentMode = mode;

        if (mode === 'live') {
            this.liveBtn.classList.add('active');
            this.podcastBtn.classList.remove('active');
            this.liveSection.style.display = 'block';
            this.podcastSection.style.display = 'none';
        } else {
            this.podcastBtn.classList.add('active');
            this.liveBtn.classList.remove('active');
            this.podcastSection.style.display = 'block';
            this.liveSection.style.display = 'none';
        }
    }

    // Load RSS feeds for all podcast items
    async loadPodcastFeeds() {
        // Disable Play All button until feeds are loaded
        if (this.playAllBtn) {
            this.playAllBtn.disabled = true;
        }

        const podcastItems = document.querySelectorAll('.podcast-item');

        for (const item of podcastItems) {
            const feedUrl = item.dataset.feed;
            const feedType = item.dataset.type || 'rss';
            const episodeElement = item.querySelector('.podcast-episode');
            const episodeName = episodeElement.dataset.name;

            try {
                await this.loadLatestEpisode(feedUrl, episodeElement, episodeName, feedType);
            } catch (error) {
                console.error(`Failed to load ${episodeName}:`, error);
                this.updateEpisodeUI(episodeElement, {
                    title: 'Failed to load episode',
                    date: '--',
                    duration: '--',
                    audioUrl: null
                });
            }
        }
    }

    // Load the latest episode from an RSS feed or JSON API
    async loadLatestEpisode(feedUrl, episodeElement, episodeName, feedType = 'rss') {
        let lastError = null;
        const timeout = window.radioConfig.getPodcastTimeout();

        // Check if this feed requires proxy
        const podcastItem = episodeElement.closest('.podcast-item');
        const requiresProxy = podcastItem?.dataset.requiresProxy === 'true';

        // Build URL list based on proxy requirement
        const urls = requiresProxy
            ? [this.corsProxy + encodeURIComponent(feedUrl)]  // Only try proxy
            : [feedUrl, this.corsProxy + encodeURIComponent(feedUrl)];  // Try direct first, then proxy

        for (const url of urls) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        'Accept': feedType === 'json' ? 'application/json' : 'application/rss+xml, application/xml, text/xml'
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const content = await response.text();
                const episodeData = this.parseEpisodeData(content, feedType, episodeName);

                if (episodeData && episodeData.audioUrl) {
                    this.updateEpisodeUI(episodeElement, episodeData);

                    // Enable Play All button when first successful feed loads
                    if (this.playAllBtn && this.playAllBtn.disabled) {
                        this.playAllBtn.disabled = false;
                    }

                    this.updatePlayAllButtonText();

                    return; // Success, exit the retry loop
                }
            } catch (error) {
                lastError = error;
                console.warn(`Failed to fetch ${episodeName} from ${url}:`, error.message);
            }
        }

        // If we get here, all attempts failed
        throw lastError || new Error('All fetch attempts failed');
    }

    // Parse episode data from RSS XML or JSON
    parseEpisodeData(content, feedType, feedName) {
        try {
            if (feedType === 'json') {
                // Handle JSON feeds
                const data = JSON.parse(content);

                if (data.items && data.items.length > 0) {
                    const item = data.items[0];
                    const audioAsset = item.assets?.find(asset => asset.kind === 'Audio');

                    return {
                        title: this.cleanText(item.title),
                        date: new Date(item.publishTime).toLocaleDateString(),
                        duration: this.formatDuration(item.duration?.totalMilliseconds),
                        audioUrl: audioAsset?.url || null,
                        description: this.cleanText(item.description || '')
                    };
                }
            } else {
                // Handle RSS/XML feeds
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(content, 'text/xml');

                // Check for parsing errors
                const parserError = xmlDoc.querySelector('parsererror');
                if (parserError) {
                    throw new Error('XML parsing failed: ' + parserError.textContent);
                }

                const items = xmlDoc.querySelectorAll('item');
                if (items.length === 0) {
                    throw new Error('No items found in RSS feed');
                }

                const latestItem = items[0];

                // Get basic info
                const title = latestItem.querySelector('title')?.textContent || 'Untitled';
                const pubDate = latestItem.querySelector('pubDate')?.textContent || '';
                const description = latestItem.querySelector('description')?.textContent || '';

                // Find audio URL
                let audioUrl = null;
                let duration = null;

                // Try enclosure first
                const enclosure = latestItem.querySelector('enclosure[type*="audio"]');
                if (enclosure) {
                    audioUrl = enclosure.getAttribute('url');
                }

                // Try media:content as fallback
                if (!audioUrl) {
                    const mediaContent = latestItem.querySelector('content[type*="audio"], content[medium="audio"]');
                    if (mediaContent) {
                        audioUrl = mediaContent.getAttribute('url');
                        const durationAttr = mediaContent.getAttribute('duration');
                        if (durationAttr) {
                            duration = parseInt(durationAttr) * 1000;
                        }
                    }
                }

                // Try iTunes duration
                if (!duration) {
                    const itunesDuration = latestItem.querySelector('duration')?.textContent;
                    if (itunesDuration) {
                        // Parse duration formats like "12:34" or "1:23:45"
                        const parts = itunesDuration.split(':').map(p => parseInt(p));
                        if (parts.length === 2) {
                            duration = (parts[0] * 60 + parts[1]) * 1000;
                        } else if (parts.length === 3) {
                            duration = (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
                        }
                    }
                }

                return {
                    title: this.cleanText(title),
                    date: pubDate ? new Date(pubDate).toLocaleDateString() : '--',
                    duration: this.formatDuration(duration),
                    audioUrl: audioUrl,
                    description: this.cleanText(description)
                };
            }
        } catch (error) {
            console.error('Error parsing episode data:', error);
            throw error;
        }

        return null;
    }

    // Clean text content (remove HTML tags, extra whitespace)
    cleanText(text) {
        return text?.replace(/<[^>]*>/g, '').trim() || '';
    }

    // Format duration from milliseconds
    formatDuration(milliseconds) {
        if (!milliseconds || milliseconds === 0) return '--';

        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        } else {
            return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
        }
    }

    // Update episode UI with loaded data
    updateEpisodeUI(episodeElement, episodeData) {
        const titleElement = episodeElement.querySelector('.episode-title');
        const dateElement = episodeElement.querySelector('.episode-date');
        const durationElement = episodeElement.querySelector('.episode-duration');
        const episodeItem = episodeElement.closest('.podcast-item');

        if (titleElement) titleElement.textContent = episodeData.title || 'Untitled';
        if (dateElement) dateElement.textContent = episodeData.date || '--';
        if (durationElement) durationElement.textContent = episodeData.duration || '--';

        if (episodeItem) {
            if (episodeData.audioUrl) {
                episodeItem.title = 'Play episode';

                // Store audio URL in the episode element
                episodeElement.dataset.audioUrl = episodeData.audioUrl;
                episodeElement.dataset.disabled = "false";

                // Check if this episode has been played and add visual indicator
                const feedName = episodeElement.dataset.name;
                const episodeId = this.getEpisodeId(episodeElement, feedName);
                if (this.isEpisodePlayed(episodeId)) {
                    episodeItem.classList.add('played');
                    if (titleElement) {
                        titleElement.textContent = '✓ ' + (episodeData.title || 'Untitled');
                    }
                } else {
                    episodeItem.classList.remove('played');
                }
            } else {
                episodeElement.dataset.disabled = "true";
                episodeItem.title = 'No audio available';
            }
        }
    }

    // Play a specific podcast episode
    playPodcastEpisode(episodeElement, feedName, feedId) {
        const audioUrl = episodeElement.dataset.audioUrl;
        const title = episodeElement.querySelector('.episode-title')?.textContent || feedName;

        if (!audioUrl) {
            this.showStatus('No audio available for this episode', 'error');
            return;
        }

        // Store current episode info
        this.currentEpisode = {
            audioUrl: audioUrl,
            title: title,
            feedName: feedName,
            feedId: feedId,
            element: episodeElement
        };

        this.currentStation = null; // Clear live station selection
        this.playingAll = false; // Stop "play all" mode

        this.audioPlayer.src = audioUrl;
        this.updateStationInfo(title, feedName);
        this.updateActiveButton(null); // Clear station selection
        this.updateActivePodcast(episodeElement);

        this.play();
    }

    // Play all podcasts in sequence
    playAllPodcasts() {
        const allEpisodes = Array.from(document.querySelectorAll('.podcast-episode'))
            .filter(episode => episode.dataset.disabled === "false" && episode.dataset.audioUrl);

        if (allEpisodes.length === 0) {
            this.showStatus('No podcast episodes available to play', 'error');
            return;
        }

        // Filter out already played episodes
        const unplayedEpisodes = allEpisodes.filter(episode => {
            const feedName = episode.dataset.name;
            const episodeId = this.getEpisodeId(episode, feedName);
            return !this.isEpisodePlayed(episodeId);
        });

        if (unplayedEpisodes.length === 0) {
            const playedCount = allEpisodes.length;
            this.showStatus(`All ${playedCount} episodes have been played already. Clear history to play again.`, 'info');
            return;
        }

        this.podcastQueue = unplayedEpisodes;
        this.currentQueueIndex = 0;
        this.playingAll = true;

        // Start with the first unplayed episode
        this.playNextInQueue();

        const skippedCount = allEpisodes.length - unplayedEpisodes.length;
        const statusMessage = skippedCount > 0
            ? `Playing ${unplayedEpisodes.length} unplayed podcasts (skipped ${skippedCount} already played)`
            : `Playing all podcasts (${unplayedEpisodes.length} episodes)`;

        this.showStatus(statusMessage, 'info');
    }

    // Play the next episode in the queue
    playNextInQueue() {
        if (!this.playingAll || this.currentQueueIndex >= this.podcastQueue.length) {
            this.playingAll = false;
            this.currentQueueIndex = -1;
            this.showStatus('Finished playing all podcasts', 'info');
            return;
        }

        const episodeElement = this.podcastQueue[this.currentQueueIndex];
        const podcastItem = episodeElement.closest('.podcast-item');
        const feedName = episodeElement.dataset.name;
        const feedId = podcastItem?.dataset.id;

        this.playPodcastEpisode(episodeElement, feedName, feedId);

        this.currentQueueIndex++;

        // Update status
        this.showStatus(`Playing ${this.currentQueueIndex}/${this.podcastQueue.length}: ${feedName}`, 'info');
    }

    // Handle podcast-specific errors
    handlePodcastError(feedName, error) {
        console.error(`Podcast error for ${feedName}:`, error);

        if (this.playingAll) {
            // Skip to next episode in queue
            this.showStatus(`Skipping ${feedName} due to error. Moving to next...`, 'info');
            setTimeout(() => {
                this.playNextInQueue();
            }, 2000);
        } else {
            this.handleError('Podcast Error', `Unable to load ${feedName}: ${error.message}`);
        }
    }

    // Handle URL parameters for direct station/podcast links and manifest shortcuts
    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const stationParam = urlParams.get('station');
        const podcastParam = urlParams.get('podcast');
        const modeParam = urlParams.get('mode');

        // Set mode first if specified
        if (modeParam === 'podcast') {
            this.switchMode('podcast');
        } else if (modeParam === 'live') {
            this.switchMode('live');
        }

        // Handle station parameter with support for manifest shortcuts
        if (stationParam) {
            let station = window.radioConfig.findStationById(stationParam);

            // If not found by ID, try to match by common shortcut names
            if (!station) {
                const shortcuts = {
                    'bbc': ['bbc', 'radio4', 'bbc4'],
                    'npr': ['npr', 'national-public-radio'],
                    'dlf': ['dlf', 'deutschlandfunk', 'deutschland-funk'],
                    'dr': ['dr', 'danmarks-radio'],
                    'nrk': ['nrk', 'norsk-rikskringkasting'],
                    'sr': ['sr', 'sveriges-radio']
                };

                for (const [stationId, aliases] of Object.entries(shortcuts)) {
                    if (aliases.includes(stationParam.toLowerCase())) {
                        station = window.radioConfig.findStationById(stationId);
                        break;
                    }
                }
            }

            if (station) {
                // Show status that we're loading from shortcut
                this.showStatus(`Loading ${station.name}...`, 'info', 2000);

                setTimeout(() => {
                    this.selectStation({
                        url: station.url,
                        name: station.name,
                        country: station.country,
                        id: station.id
                    });
                }, 500); // Small delay to ensure UI is ready
            } else {
                console.warn(`Station not found for parameter: ${stationParam}`);
                this.showStatus('Station not found. Please select from available stations.', 'warning', 3000);
            }
        }

        // Handle podcast parameter
        if (podcastParam) {
            const podcast = window.radioConfig.findPodcastById(podcastParam);
            if (podcast) {
                this.switchMode('podcast');
                // Wait for podcast feeds to load, then try to play
                setTimeout(() => {
                    const podcastElement = document.querySelector(`[data-id="${podcastParam}"]`);
                    if (podcastElement) {
                        const episodeElement = podcastElement.querySelector('.podcast-episode');
                        if (episodeElement && episodeElement.dataset.disabled === 'false') {
                            this.playPodcastEpisode(episodeElement, podcast.name, podcast.id);
                        }
                    }
                }, 3000); // Wait for feeds to load
            }
        }
    }

    // Service Worker and PWA utilities
    setupOfflineDetection() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.showStatus('Connection restored!', 'success', 3000);
            this.hideOfflineIndicator();
        });

        window.addEventListener('offline', () => {
            this.showStatus('You are offline. Some features may not be available.', 'warning', 0);
            this.showOfflineIndicator();
        });

        // Initial check
        if (!navigator.onLine) {
            this.showOfflineIndicator();
        }
    }

    showOfflineIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'offlineIndicator';
        indicator.className = 'offline-indicator';
        indicator.innerHTML = '📶 Offline Mode';
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff9800;
            color: white;
            text-align: center;
            padding: 8px;
            z-index: 1000;
            font-size: 14px;
        `;

        if (!document.getElementById('offlineIndicator')) {
            document.body.appendChild(indicator);
        }
    }

    hideOfflineIndicator() {
        const indicator = document.getElementById('offlineIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Send message to service worker
    async sendMessageToSW(message) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            try {
                navigator.serviceWorker.controller.postMessage(message);
            } catch (error) {
                console.warn('Failed to send message to service worker:', error);
            }
        }
    }

    // Cache important URLs for offline access
    async cacheImportantUrls() {
        const urls = [
            './config.json',
            './combined-feed.php'
        ];

        await this.sendMessageToSW({
            type: 'CACHE_URLS',
            data: { urls }
        });
    }

    // Check if app update is available
    async checkForUpdates() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                registration.update();
            }
        }
    }

    // Clear cache (useful for debugging or forced refresh)
    async clearCache() {
        await this.sendMessageToSW({ type: 'CLEAR_CACHE' });
        this.showStatus('Cache cleared. Refresh the page for changes to take effect.', 'info', 5000);
    }

    // PWA Install Prompt
    setupPWAInstall() {
        let deferredPrompt;

        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (event) => {
            // Prevent the mini-infobar from appearing
            event.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = event;
            // Show install prompt after user has used the app a bit
            setTimeout(() => {
                this.showInstallPrompt(deferredPrompt);
            }, 30000); // Show after 30 seconds
        });

        // Listen for the app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.showStatus('App installed successfully! 📱', 'success', 3000);
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt(deferredPrompt) {
        // Don't show if already dismissed or installed
        if (localStorage.getItem('pwaInstallDismissed') || window.navigator.standalone) {
            return;
        }

        const installPrompt = document.createElement('div');
        installPrompt.id = 'installPrompt';
        installPrompt.className = 'install-prompt';
        installPrompt.innerHTML = `
            <div>
                <strong>📱 Install Global Radio News</strong>
                <p>Add to your home screen for quick access to your favorite news stations!</p>
                <div class="install-buttons">
                    <button class="primary" id="installApp">Install</button>
                    <button id="dismissInstall">Not now</button>
                </div>
            </div>
        `;

        document.body.appendChild(installPrompt);

        // Handle install button
        document.getElementById('installApp').addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                // Clear the deferredPrompt
                deferredPrompt = null;
            }
            this.hideInstallPrompt();
        });

        // Handle dismiss button
        document.getElementById('dismissInstall').addEventListener('click', () => {
            localStorage.setItem('pwaInstallDismissed', 'true');
            this.hideInstallPrompt();
        });
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.remove();
        }
    }

    // Check if app is installed
    isAppInstalled() {
        return window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    }

    // Episode tracking methods using localStorage
    getEpisodeId(episodeElement, feedName) {
        // Create a unique identifier for the episode using feed name and episode title/URL
        let title = episodeElement.querySelector('.episode-title')?.textContent || '';

        if (title.startsWith('✓ ')) {
            title = title.substring(2);
        }

        const audioUrl = episodeElement.dataset.audioUrl || '';
        const pubDate = episodeElement.querySelector('.episode-date')?.textContent || '';

        // Create a hash-like ID using feed name, title, and date to uniquely identify episodes
        const identifier = `${feedName}::${title}::${pubDate}::${audioUrl}`;
        return btoa(identifier).replace(/[^a-zA-Z0-9]/g, ''); // Base64 encode and clean
    }

    isEpisodePlayed(episodeId) {
        const playedEpisodes = this.getPlayedEpisodes();
        return playedEpisodes.includes(episodeId);
    }

    markEpisodeAsPlayed(episodeId) {
        const playedEpisodes = this.getPlayedEpisodes();
        if (!playedEpisodes.includes(episodeId)) {
            playedEpisodes.push(episodeId);
            localStorage.setItem('playedEpisodes', JSON.stringify(playedEpisodes));

            // Update visual indicator for this episode
            if (this.currentEpisode) {
                const episodeItem = this.currentEpisode.element.closest('.podcast-item');
                const titleElement = this.currentEpisode.element.querySelector('.episode-title');
                if (episodeItem) {
                    episodeItem.classList.add('played');
                }
                if (titleElement && !titleElement.textContent.startsWith('✓ ')) {
                    titleElement.textContent = '✓ ' + titleElement.textContent;
                }
            }
        }
    }

    getPlayedEpisodes() {
        try {
            const stored = localStorage.getItem('playedEpisodes');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Error reading played episodes from localStorage:', error);
            return [];
        }
    }

    clearPlayedEpisodes() {
        const playedCount = this.getPlayedEpisodesCount();
        localStorage.removeItem('playedEpisodes');

        // Remove visual indicators from all episodes
        const allPlayedItems = document.querySelectorAll('.podcast-item.played');
        allPlayedItems.forEach(item => {
            item.classList.remove('played');
            const titleElement = item.querySelector('.episode-title');
            if (titleElement && titleElement.textContent.startsWith('✓ ')) {
                titleElement.textContent = titleElement.textContent.substring(2);
            }
        });

        this.showStatus(`${playedCount} played episode${playedCount === 1 ? '' : 's'} cleared from history`, 'info');
    }

    getPlayedEpisodesCount() {
        return this.getPlayedEpisodes().length;
    }

    updatePlayAllButtonText() {
        if (!this.playAllBtn) return;

        const allEpisodes = Array.from(document.querySelectorAll('.podcast-episode'))
            .filter(episode => episode.dataset.disabled === "false" && episode.dataset.audioUrl);

        const unplayedEpisodes = allEpisodes.filter(episode => {
            const feedName = episode.dataset.name;
            const episodeId = this.getEpisodeId(episode, feedName);
            return !this.isEpisodePlayed(episodeId);
        });

        const totalCount = allEpisodes.length;
        const unplayedCount = unplayedEpisodes.length;
        const playedCount = totalCount - unplayedCount;

        if (playedCount === 0) {
            this.playAllBtn.textContent = '🔄 Play All News Podcasts';
        } else if (unplayedCount === 0) {
            this.playAllBtn.textContent = `🔄 All ${totalCount} Episodes Played`;
            this.playAllBtn.disabled = true;
        } else {
            this.playAllBtn.textContent = `🔄 Play ${unplayedCount} Unplayed Episodes`;
            this.playAllBtn.disabled = false;
        }

        // Update clear history button
        if (this.clearHistoryBtn) {
            const playedCount = this.getPlayedEpisodesCount();
            if (playedCount === 0) {
                this.clearHistoryBtn.textContent = '🗑️ Clear History';
                this.clearHistoryBtn.disabled = true;
            } else {
                this.clearHistoryBtn.textContent = `🗑️ Clear History (${playedCount})`;
                this.clearHistoryBtn.disabled = false;
            }
        }
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.radioApp = new RadioNewsApp();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed');
            });
    });
}
