    const express = require('express');
    const http = require('http');
    const { Server } = require('socket.io');
    const ytSearch = require('yt-search');
    const path = require('path');
    const { exec } = require('child_process'); // For executing yt-dlp commands

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json()); // Middleware to parse JSON bodies

    let playlist = [];

    // Serve the search page
    app.get('/', (req, res) => {
        res.render('index', { playlist });
    });

    // Serve the player page
    app.get('/player', (req, res) => {
        res.render('player', { playlist });
    });
    app.get('/control', (req, res) => {
        res.render('control', { playlist });
    });
    // Function to get direct video and audio URLs using yt-dlp
    const getVideoStreamUrl = (videoUrl) => {
        return new Promise((resolve, reject) => {
            // Use yt-dlp to get video and audio streams separately
            const command = `yt-dlp --cookies-from-browser firefox -f "bestvideo[height<730]+bestaudio" -g "${videoUrl}"`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error running yt-dlp: ${error}`);
                    return reject(error);
                }

                const videoStreamUrls = stdout.trim().split("\n"); 
                if (videoStreamUrls.length < 2) {
                    return reject('Failed to retrieve both video and audio URLs');
                }

                const videoUrlStream = videoStreamUrls[0]; // Best video stream.
                const audioUrlStream = videoStreamUrls[1]; // Best audio stream
                resolve({ videoUrlStream, audioUrlStream }); // Return both streams
            });
        });
    };

    // Socket.io connection handler
    io.on('connection', (socket) => {
        socket.on('search', async (query, region) => {
            try {
                let videoaurl;
                let results;
                let videos = [];
    
                const performSearch = async (querySuffix, url) => {
                    const searchResults = await ytSearch(query + querySuffix);
                    return searchResults.videos
                        .filter(video => video.author.url === url)
                        .slice(0, 10)
                        .map(video => ({
                            title: video.title
                                .replace("[KY ENTERTAINMENT]", "")
                                .replace(" / KY Karaoke", "")
                                .replace("[KY 금영노래방]", "")
                                .replace("(Karaoke Version)", "")
                                .replace(" / KY KARAOKE", "")
                                .replace(" | Karaoke Version | KaraFun", "")
                                .replace("Karaoke ", ""),
                            videoUrl: video.url
                        }));
                };
    
                if (region === 'korea') {
                    videoaurl = 'https://youtube.com/@KARAOKEKY';
                    videos = await performSearch('"KY Karaoke"', videoaurl);
                } else if (region === 'international') {
                    videoaurl = 'https://youtube.com/@karafun';
                    videos = await performSearch('"Karaoke"', videoaurl);
                } else if (region === 'auto') {
                    // First attempt: Karafun
                    videoaurl = 'https://youtube.com/@karafun';
                    videos = await performSearch('"Karaoke"', videoaurl);
    
                    // Fallback 1: Sing King Karaoke
                    if (videos.length === 0) {
                        console.log("No results from Karafun, trying Sing King Karaoke...");
                        videoaurl = 'https://www.youtube.com/@singkingkaraoke';
                        videos = await performSearch('"Karaoke"', videoaurl);
                    }
    
                    // Fallback 2: KY Karaoke
                    if (videos.length === 0) {
                        console.log("No results from Sing King Karaoke, trying KY Karaoke...");
                        videoaurl = 'https://youtube.com/@KARAOKEKY';
                        videos = await performSearch('"KY Karaoke"', videoaurl);
                    }
    
                    // Fallback 3: Karaoke Media Plus
                    if (videos.length === 0) {
                        console.log("No results from KY Karaoke, trying Karaoke Media Plus...");
                        videoaurl = 'https://youtube.com/@KaraokeMediaPlus';
                        videos = await performSearch('Karaoke', videoaurl);
                        console.log('Search results:', videos);
                    }
                }
    
                console.log('Search results:', videos);
                socket.emit('searchResults', videos); // Send search results back to the client
            } catch (error) {
                console.error('Error fetching YouTube results:', error);
                socket.emit('searchResults', []); // Send empty array in case of error
            }
        });
    

        socket.emit('playlistUpdated', playlist);

        // Handle requests for the current playlist
        socket.on('getPlaylist', () => {
            socket.emit('playlistUpdated', playlist); // Send the current playlist to the client
        });


        // Handle adding a video to the playlist
        socket.on('addVideo', async ({ videoUrl, title }) => {
            try {
                const { videoUrlStream, audioUrlStream } = await getVideoStreamUrl(videoUrl);
                playlist.push({ title, videoUrlStream, audioUrlStream }); // Add to playlist
                io.emit('playlistUpdated', playlist); // Broadcast updated playlist to all clients
            } catch (error) {
                console.error(`Error fetching stream URL: ${error}`);
                socket.emit('error', 'Failed to fetch stream URL');
            }
        });

        // Handle removing a song from the playlist
        socket.on('removeSong', (index) => {
            if (index >= 0 && index < playlist.length) {
                playlist.splice(index, 1); // Remove the song
                io.emit('playlistUpdated', playlist); // Broadcast updated playlist to all clients
            } else {
                socket.emit('error', 'Invalid index');
            }
        });

        // Handle the song ended event
        socket.on('songEnded', () => {
            if (playlist.length > 0) {
                playlist.shift(); // Remove the first song
                io.emit('playlistUpdated', playlist); // Broadcast updated playlist to all clients
            }
        });

        // Handle client disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
