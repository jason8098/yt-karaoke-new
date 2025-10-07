let socket = io();  // Connect to the WebSocket server
let videoElement;
let audioElement;
let currentPlaylist = [];
let isPlaying = false;

// Function to play the next video or intro if the playlist is empty
function playNextOrIntro() {
    videoElement.loop = false;
    if (currentPlaylist.length > 0) {
        const nextVideo = currentPlaylist[0];  // Always get the first item

        if (nextVideo.videoUrlStream && nextVideo.audioUrlStream) {
            console.log(`Playing video: ${nextVideo.title}`);
            
            videoElement.src = nextVideo.videoUrlStream;
            audioElement.src = nextVideo.audioUrlStream;
            videoElement.muted = true;

            videoElement.play().then(() => {
                videoElement.muted = true;
                audioElement.play();
                isPlaying = true;
            }).catch(err => console.error('Error playing video:', err));
        } else {
            console.error("Video or audio URL is missing");
        }
    } else {
        playIntroVideo();  // Only play intro if the playlist is empty
    }
}
function playCurrntVideo() {
    videoElement.loop = false;
    if (currentPlaylist.length > 0) {
        const nextVideo = currentPlaylist[0];  // Always get the first item

        if (nextVideo.videoUrlStream && nextVideo.audioUrlStream) {
            console.log(`Playing video: ${nextVideo.title}`);
            
            videoElement.src = nextVideo.videoUrlStream;
            audioElement.src = nextVideo.audioUrlStream;
            videoElement.muted = true;

            videoElement.play().then(() => {
                videoElement.muted = true;
                audioElement.play();
                isPlaying = true;
            }).catch(err => console.error('Error playing video:', err));
        } else {
            console.error("Video or audio URL is missing");
        }
    } else {
        playIntroVideo();  // Only play intro if the playlist is empty
    }
}
// Function to play the intro video
function playIntroVideo() {
    console.log('Playing intro video');
    videoElement.src = '/intro.mp4';
    audioElement.src = '';  // Clear audio when intro plays
    videoElement.loop = true;
    videoElement.play().then(() => console.log('Intro playing'))
        .catch(err => console.error('Error playing intro:', err));
}

// Function to update the playlist marquee
function updateMarquee(playlist) {
    const marqueeSpan = document.getElementById('playlist-marquee');
    let playlistContent = '';

    if (playlist.length === 0) {
        playlistContent = '@@ 예약해 주세요. (QR-CODE 스캔) @@';  // Empty playlist message
        playIntroVideo();
        isPlaying = false;
    } else {
        playlistContent = '';
        playlist.forEach((item, index) => {
            playlistContent += `#${index + 1}: ${item.title} || `;
        });
    }
    
    const invisibleContent = '&nbsp;'.repeat(120);  // Add non-breaking spaces
    marqueeSpan.innerHTML = invisibleContent + playlistContent + invisibleContent;  // Add invisible content for smooth scrolling
    adjustMarqueeSpeed();
}

// Adjust marquee scroll speed
function adjustMarqueeSpeed() {
    const marqueeSpan = document.getElementById('playlist-marquee');
    const contentWidth = marqueeSpan.scrollWidth;
    const containerWidth = document.querySelector('.playlist-marquee').clientWidth;
    const totalDistance = contentWidth + containerWidth;

    const speed = 100;  // pixels per second
    const duration = totalDistance / speed;

    marqueeSpan.style.animation = `scroll-left ${duration}s linear infinite`;
}

// Sync audio and video
function syncAudioWithVideo() {
    if (Math.abs(videoElement.currentTime - audioElement.currentTime) > 0.3) {
        audioElement.currentTime = videoElement.currentTime;  // Sync audio with video
    }
}

// Function to play the next song if it exists
function playNextSong() {
    if (currentPlaylist.length > 0) {
        
        socket.emit('removeSongAuto', 0);
        
        
    } else {
        playIntroVideo();  // Play intro if the playlist is empty
    }
}

// Listen for playlist updates from WebSocket
socket.on('playlistUpdated', (updatedPlaylist, action) => {
    console.log('Playlist updated:', updatedPlaylist);
    currentPlaylist = updatedPlaylist;
    updateMarquee(currentPlaylist);

    console.log('Is playing:', action);
    if (action == "cancel") {
        if(currentPlaylist.length > 1){
            var nSong = document.getElementById('nextSong');
            var lTime = document.getElementById('timeLeft');
            var cont = document.getElementById('ct');
            cont.style.display = "block";

            playIntroVideo();  
            nSong.innerText = currentPlaylist[0].title;
            var timeLeft = 10;
            var interval = setInterval(() => {
                timeLeft--;
                lTime.innerText = `${timeLeft}초 후 시작...`;  // Update text to show countdown in seconds
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    cont.style.display = "none";
                    playNextOrIntro();
                    lTime.innerText = "10초 후 시작...";
                }
            }, 1000);
        }
    }
    else if (currentPlaylist.length == 1 && action=="add"){
        playNextOrIntro();
    }
   else if (!isPlaying && action!="cancelauto") {
        playCurrntVideo();
        console.log("Started playing the next song.");
    }
    else if (action == "cancelauto") {
        console.log("Auto removed the current song.");
        if(currentPlaylist.length > 0){
            var nSong = document.getElementById('nextSong');
            var lTime = document.getElementById('timeLeft');
            var cont = document.getElementById('ct');
            cont.style.display = "block";

            playIntroVideo();  
            nSong.innerText = currentPlaylist[0].title;
            var timeLeft = 10;
            
            
            var interval = setInterval(() => {
                timeLeft--;
                lTime.innerText = `${timeLeft}초 후 시작...`;  // Update text to show countdown in seconds
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    cont.style.display = "none";
                    playNextOrIntro();
                    lTime.innerText = "10초 후 시작...";
                }
            }, 1000);
        }
        else{
            playNextOrIntro();
        }
    }
});

socket.on('qrcode', (qrcodeUrl) => {
    const qrImg = document.getElementById('qrc');
    qrImg.src = qrcodeUrl;
    console.log('QR Code updated:', qrcodeUrl);
});
// When the video ends, play the next song
function handleVideoEnd() {
    console.log('Video ended, playing next song.');
    isPlaying = false;  // Mark the current song as ended
    playNextSong();
}

window.onload = function() {
    videoElement = document.getElementById('video-player');
    audioElement = document.getElementById('audio-player');

    videoElement.addEventListener('timeupdate', syncAudioWithVideo);
    videoElement.addEventListener('ended', handleVideoEnd);
    videoElement.addEventListener('pause', () => {
        console.log('Video is paused, pausing audio');
        audioElement.pause();
    });
    videoElement.addEventListener('waiting', () => {
        console.log('Video is buffering, pausing audio');
        audioElement.pause();
    });

    videoElement.addEventListener('playing', () => {
        console.log('Video is playing, resuming audio');
        audioElement.play();
    });

    // Request the current playlist from the server when the page loads
    socket.emit('getPlaylist');
};
