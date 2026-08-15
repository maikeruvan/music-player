// DOM Displays
const coverImageDisplay = document.querySelector('.cover__image');
const titleDisplay = document.querySelector('.details__title');
const artistDisplay = document.querySelector('.details__artist');
const currentTimeDisplay = document.querySelector('.progress__current-time');
const durationDisplay = document.querySelector('.progress__duration');
const volumePercentageDisplay = document.querySelector('.volume__percentage');

// DOM Sliders
const progressSlider = document.querySelector('.progress__slider');
const volumeSlider = document.querySelector('.volume__slider');

// DOM Buttons
const controlButtons = document.querySelector('.control__buttons');
const shuffleBtn = document.querySelector('.buttons__shuffle');
const previousTrackBtn = document.querySelector('.buttons__previous-track');
const playPauseBtn = document.querySelector('.buttons__play-pause');
const nextTrackBtn = document.querySelector('.buttons__next-track');
const replayBtn = document.querySelector('.buttons__replay');
const volumeUpBtn = document.querySelector('.volume__up');
const volumeDownBtn = document.querySelector('.volume__down');

// State Variables
const musicLibrary = [
    {
        coverImage: 'images/hardtekk.jpg',
        title: 'Eins Zwei Polizei',
        artist: 'Hardtekk',
        src: 'songs/einszweipolizei.mp3'
    },
    {
        coverImage: 'images/maroon5.jpg',
        title: 'Animals',
        artist: 'Maroon 5',
        src: 'songs/animals.mp3'
    },
    {
        coverImage: 'images/linkinpark.jpg',
        title: 'In the end',
        artist: 'Linkin Park',
        src: 'songs/intheend.mp3'
    },
    {
        coverImage: 'images/theweeknd.jpg',
        title: 'Save your tears',
        artist: 'The Weeknd',
        src: 'songs/saveyourtears.mp3'
    },
    {
        coverImage: 'images/cover-image.jpg',
        title: 'Mortals',
        artist: 'Warriyo',
        src: 'songs/mortals.mp3'
    },
    {
        coverImage: 'images/loki.jpg',
        title: 'Kagome',
        artist: 'Lo Ki',
        src: 'songs/kagome.mp3'
    },
    {
        coverImage: 'images/neffex.jpg',
        title: 'Never Give Up',
        artist: 'NEFFEX',
        src: 'songs/nevergiveup.mp3'
    },
    {
        coverImage: 'images/giopika.jpg',
        title: 'Wild Head',
        artist: 'Gio Pika',
        src: 'songs/wildhead.mp3'
    },
];

let trackIndex = JSON.parse(localStorage.getItem('currentTrackIndex')) || 0;
let isShuffled = false;
const audio = new Audio();
audio.preload = 'metadata';

// On Load Function Calls
loadTrackAudio(trackIndex);

// Check if metadata is loaded
audio.addEventListener('loadedmetadata', (e) => {
    // Load the UI
    if (!isNaN(audio.duration)) {
        loadTrackUI(trackIndex);
        isReady = true;
    }
});

playPauseBtn.addEventListener('click', (e) => {
    if (!isNaN(audio.duration)) {
        playTrack();
    }
});

audio.addEventListener('timeupdate', (e) => {
    progressSlider.value = audio.currentTime;

    // Also update the currentTimeDisplay
    currentTimeDisplay.textContent = formatTrackTime(audio.currentTime);
});

progressSlider.addEventListener('change', (e) => {
    audio.currentTime = progressSlider.value;
});

replayBtn.addEventListener('click', () => {
    audio.load();
    playTrack();
});

shuffleBtn.addEventListener('click', () => {
    // Mutates the global in-memory trackIndex
    trackIndex = shuffleTrackIndex(musicLibrary.length);

    loadTrackUI(trackIndex);
    loadTrackAudio(trackIndex);

    if (isShuffled) {
        isShuffled = false;
    } else {
        isShuffled = true;
    }

    shuffleBtn.classList.toggle('buttons__shuffle--true');

    playTrack();
});

previousTrackBtn.addEventListener('click', () => {
    if (trackIndex > 0) {
        trackIndex = trackIndex - 1;
    }

    loadTrackUI(trackIndex);
    loadTrackAudio(trackIndex);

    playTrack();
});

nextTrackBtn.addEventListener('click', () => {
    if (trackIndex < musicLibrary.length - 1) {
        trackIndex = trackIndex + 1;
    }

    loadTrackUI(trackIndex);
    loadTrackAudio(trackIndex);

    playTrack();
});

audio.addEventListener('ended', () => {
    if (!isShuffled) {
        return;
    }

    // Mutates the global in-memory trackIndex
    trackIndex = shuffleTrackIndex(musicLibrary.length);

    loadTrackUI(trackIndex);
    loadTrackAudio(trackIndex);

    isShuffled = true;

    playTrack();
});

volumeSlider.addEventListener('change', () => {

    const volumeMuted = volumeDownBtn.querySelector('svg');

    audio.volume = volumeSlider.value;

    if (audio.volume === 0) {
        volumeMuted.classList.remove('fa-volume-low');
        volumeMuted.classList.add('fa-volume-xmark');
    } else {
        volumeMuted.classList.remove('fa-volume-xmark');
        volumeMuted.classList.add('fa-volume-low');
    }

    volumePercentageDisplay.textContent = audio.volume * 100 + '%';
});

// Functions
function loadTrackAudio(trackIndex) {
    audio.src = musicLibrary[trackIndex].src;
    audio.load();
}

function loadTrackUI(trackIndex) {
    if (isNaN(trackIndex)) {
        throw new Error(trackIndex + ' is not a valid number');
    }

    coverImageDisplay.src = musicLibrary[trackIndex].coverImage;
    titleDisplay.textContent = musicLibrary[trackIndex].title;
    artistDisplay.textContent = musicLibrary[trackIndex].artist;
    currentTimeDisplay.textContent = formatTrackTime(0);
    durationDisplay.textContent = formatTrackTime(audio.duration);
    progressSlider.min = audio.currentTime;
    progressSlider.max = audio.duration;
}

function formatTrackTime(rawTrackTime) {
    if (isNaN(rawTrackTime)) {
        throw new Error(rawTrackTime + ' is not a valid number!');
    }

    let minutes = Math.floor(rawTrackTime / 60);
    let seconds = Math.floor(rawTrackTime % 60);
    let timeDisplay = '';

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    timeDisplay = minutes + ':' + seconds;
    
    return timeDisplay;
}

function shuffleTrackIndex(totalIndex) {
    if (isNaN(totalIndex)) {
        throw new Error(totalIndex + ' is not a valid number');
    }

    return Math.floor(Math.random() * totalIndex);
}

function playTrack() {
    const playIcon = playPauseBtn.querySelector('svg');

    if (audio.paused) {
        audio.play();

        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        audio.pause();

        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
}