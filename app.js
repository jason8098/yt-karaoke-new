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
    // this has to be blah blah
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
            const command = `yt-dlp --cookies-from-browser firefox -f "bestvideo[height<700]+bestaudio" -g "${videoUrl}"`;
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
                let results = []; // Initialize results as an array
                let videos = [];

                const performSearch = async (querySuffix, url) => {
                    const r = await ytSearch(query + querySuffix);
                    console.log(r.all);
                    for (let i = 0; i < r.all.length; i++) {
                        if (r.all[i].author.url === url) {
                            results.push(r.all[i]); // Push matching results into the array
                        }
                    }
                    if (results.length === 0) {
                        console.log(`No results found for query: ${query} with suffix: ${querySuffix} in channel: ${url}`);
                    }
                 //   console.log(results);
                    return results.map(video => ({ // Return the mapped results
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
                    videos = await performSearch('karafun', videoaurl);
                } else if (region === 'auto') {
                    //todo: sort the list after search according to the query => before displaying
                    var ch1 = 'https://youtube.com/@karafun';
                    var ch2 = 'https://youtube.com/@singkingkaraoke';
                    var ch3 = 'https://youtube.com/@KARAOKEKY';
                    var ch4 = 'https://youtube.com/@karafunespana';
                    var ch5 = 'https://youtube.com/@gerarkaraokes7255';

                    var videos1 = await performSearch('karafun"', ch1);
                    var videos2 = await performSearch('sing king', ch2);
                    var videos3 = await performSearch('"KY Karaoke"', ch3);
                    var videos4 = await performSearch('Karaoke', ch4);
                    var videos5 = await performSearch('Karaoke', ch5);
                    
                    console.log('Waiting for 2 seconds before searching for Spanish and other channels...');
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

                    var videos4 = await performSearch('karaoke', ch4);

                    videos = videos1.concat(videos2, videos3, videos4, videos5); // Combine all results

                }
                
            //    console.log('Search results:', videos);
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
            console.log(`Adding video: ${title} with URL: ${videoUrl}`);
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