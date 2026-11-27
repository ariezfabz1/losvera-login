
document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("music-audio");
    const playButton = document.getElementById("music-play");
    const volumeSlider = document.querySelector(".volume-slider");
    const progressFill = document.querySelector(".progress-fill");
    const progressBar = document.querySelector(".progress-bar");
    const musicTitle = document.querySelector(".music-title");
    const musicArtist = document.querySelector(".music-artist");
    const timeLabels = document.querySelectorAll(".music-progress p");
    const previousButton = document.querySelector(".skip-back");
    const nextButton = document.querySelector(".skip-forward");

    if (!audio || !playButton) {
        console.error("Music Player elements not found.");
        return;
    }

    const playlist = [
        {
            title: "Pura-Pura Lupa",
            artist: "Mahen",
            src: "assets/music/purapuralupa.mp3"
        }
    ];

    let currentTrack = 0;

    audio.volume = volumeSlider
        ? Number(volumeSlider.value) / 100
        : 0.7;

    // Play / Pause Icon
    function updatePlayIcon(isPlaying) {
        playButton.innerHTML = isPlaying
            ? '<path d="M8 5H11V19H8V5Z" fill="currentColor"></path><path d="M13 5H16V19H13V5Z" fill="currentColor"></path>'
            : '<path d="M8 5V19L19 12L8 5Z" fill="currentColor"></path>';
    }

    // Format Time
    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "00:00";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return String(minutes).padStart(2, "0") + ":" +
            String(remainingSeconds).padStart(2, "0");
    }

    // Load Track
    function loadTrack(index) {
        const track = playlist[index];

        audio.src = track.src;
        audio.load();

        musicTitle.textContent = track.title;
        musicArtist.textContent = track.artist;

        progressFill.style.width = "0%";

        if (timeLabels.length >= 2) {
            timeLabels[0].textContent = "00:00";
            timeLabels[1].textContent = "00:00";
        }

        updatePlayIcon(false);
    }

    // Play Music
    function playMusic() {
        audio.play().catch(error => {
            console.log("Music playback blocked:", error);
        });
    }

    // Pause Music
    function pauseMusic() {
        audio.pause();
    }

    // Play / Pause Button
    playButton.addEventListener("click", function () {
        if (audio.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    audio.addEventListener("play", function () {
        updatePlayIcon(true);
    });

    audio.addEventListener("pause", function () {
        updatePlayIcon(false);
    });

    // Volume
    if (volumeSlider) {
        volumeSlider.addEventListener("input", function () {
            audio.volume = Number(this.value) / 100;
        });
    }

    // Progress
    audio.addEventListener("timeupdate", function () {
        if (!audio.duration) return;

        const progress = (audio.currentTime / audio.duration) * 100;

        progressFill.style.width = progress + "%";

        if (timeLabels.length >= 2) {
            timeLabels[0].textContent = formatTime(audio.currentTime);
            timeLabels[1].textContent = formatTime(audio.duration);
        }
    });

    // Seek
    if (progressBar) {
        progressBar.addEventListener("click", function (event) {
            if (!audio.duration) return;

            const rect = progressBar.getBoundingClientRect();
            const position = (event.clientX - rect.left) / rect.width;

            audio.currentTime = Math.max(0, Math.min(1, position)) * audio.duration;
        });
    }

    // Previous / Next
    function changeTrack(direction) {
        currentTrack = (
            currentTrack + direction + playlist.length
        ) % playlist.length;

        loadTrack(currentTrack);
        playMusic();
    }

    if (previousButton) {
        previousButton.addEventListener("click", function () {
            changeTrack(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            changeTrack(1);
        });
    }

    // Auto Next
    audio.addEventListener("ended", function () {
        changeTrack(1);
    });

    // First User Interaction Fallback
    function startMusicOnInteraction() {
        if (audio.paused) {
            playMusic();
        }

        document.removeEventListener("click", startMusicOnInteraction);
        document.removeEventListener("keydown", startMusicOnInteraction);
        document.removeEventListener("touchstart", startMusicOnInteraction);
    }

    document.addEventListener("click", startMusicOnInteraction);
    document.addEventListener("keydown", startMusicOnInteraction);
    document.addEventListener("touchstart", startMusicOnInteraction);

    // Load First Track
    loadTrack(currentTrack);

    // Attempt Autoplay
    playMusic();
});
