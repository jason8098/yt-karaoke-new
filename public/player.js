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
                        videoElement.muted = false;
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
                playlistContent = '@@ Bitte reservieren Sie. (QR-CODE Scannen / https://karaoke.jkloud.tk) @@';  // Empty playlist message
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
                setTimeout(() => {
                    console.log('Playing next song.');
                    socket.emit('removeSong', 0);  // Remove the first song from the playlist
                }, 10000); // Wait for 10 seconds
            } else {
                playIntroVideo();  // Play intro if the playlist is empty
            }
        }

        // Listen for playlist updates from WebSocket
        socket.on('playlistUpdated', (updatedPlaylist) => {
            console.log('Playlist updated:', updatedPlaylist);
            currentPlaylist = updatedPlaylist;
            updateMarquee(currentPlaylist);

            // Only play the next song if the current song has ended
            if (!isPlaying) {
                playNextOrIntro();
            }
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