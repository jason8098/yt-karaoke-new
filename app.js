    const express = require('express');
    const http = require('http');
    const { Server } = require('socket.io');
    const ytSearch = require('yt-search');
    const path = require('path');
    const { exec } = require('child_process'); // For executing yt-dlp commands
    const QRCode = require('qrcode');
const os = require('os');

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

    


    const getVideoStreamUrl = (videoUrl) => {
        return new Promise((resolve, reject) => {
            const command = `yt-dlp -f "bv*[ext=mp4][height<700],ba[ext=m4a][filesize<20M]" -g "${videoUrl}"`;
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
                console.log(`Video URL: ${videoUrlStream}`);
                console.log(`Audio URL: ${audioUrlStream}`);
                resolve({ videoUrlStream, audioUrlStream }); // Return both streams
            });
        });
    };
    function chkLng(text) {
        if (/^[\x00-\x7F]+$/.test(text)) {
          return "eng"; // basic English (ASCII)
        }
        if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) {
          return "jpn"; // Japanese (Hiragana, Katakana, Kanji)
        }
        if (/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(text)) {
          return "kor"; // Korean (Hangul Jamo, Compatibility Jamo, Syllables)
        }
        return "unknown";
      }
      let qrCodeGenerated = false; 
    // Socket.io connection handler
    io.on('connection', (socket) => {

        const getLocalIp = () => {
            const interfaces = os.networkInterfaces();
            for (const interfaceName in interfaces) {
            for (const iface of interfaces[interfaceName]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
                }
            }
            }
            return '127.0.0.1'; // Fallback to localhost if no external IP is found
        };

        if (!qrCodeGenerated) { // Check if QR code has not been generated
            const localIp = "http://" + getLocalIp() + ":3000";
            QRCode.toDataURL(localIp, function (err, url) {
            if (err) {
                console.error('Error generating QR code:', err);
                return;
            }
            io.emit('qrcode', url);
            qrCodeGenerated = true; // Set flag to true after generating QR code
            });
        }

        socket.on('search', async (query, region) => {
            try {
                let videoaurl;
                let results = []; // Initialize results as an array
                let videos = [];
                const performSearch = async (querySuffix, url) => {
                    const r = await ytSearch(query + querySuffix);
                    console.log(r.all);
                    if(url=='https://youtube.com/'){
                        for (let i = 0; i < r.all.length; i++) {
                            const authorUrl = r.all[i].author.url;
                            if (authorUrl.includes('@KARAOKEKY') || 
                                authorUrl.includes('@TJ%EB%85%B8%EB%9E%98%EB%B0%A9TJKaraoke') || 
                                authorUrl.includes('@singkingkaraoke') || 
                                authorUrl.includes('@karafun') || 
                                authorUrl.includes('@karafunespana') || 
                                authorUrl.includes('@zzangkaraoke') || 
                                authorUrl.includes('@isisbrand2706') ||
                                authorUrl.includes('@karaoke-basic') ||
                                authorUrl.includes('UCgJdYYa_ikkx_2eU5pNU3nw')) {
                                results.push(r.all[i]); // Push matching results into the array
                            }
                        }
                    }
                    else{
                        for (let i = 0; i < r.all.length; i++) {
                            if (r.all[i].author.url === url) {
                                results.push(r.all[i]); // Push matching results into the array
                            }
                        }
                    }
                    
                    if (results.length === 0) {
                        console.log(`No results found for query: ${query} with suffix: ${querySuffix} in channel: ${url}`);
                    }
                    console.log(results);
                    return results.map(video => ({ // Return the mapped results
                        title: video.title
                            .replace("[KY ENTERTAINMENT]", "")
                            .replace(" / KY Karaoke", "")
                            .replace("[KY 금영노래방]", "[KY]")
                            .replace("[TJ노래방]", "[TJ]")
                            .replace("[TJ노래방", "[TJ")
                            .replace(" / TJ Karaoke", "")
                            .replace("(Karaoke Version)", "[SK]")
                            .replace(" / KY KARAOKE", "")
                            .replace("*", "")
                            .replace("カラオケ，　", "[JP]")
                            .replace(" | Karaoke Version | KaraFun", " [KF]")
                            .replace("Karaoke ", ""),
                        videoUrl: video.url 
                    }));
                };
    
                if (region === 'korea-1') {
                    videoaurl = 'https://youtube.com/@KARAOKEKY';
                    videos = await performSearch('"KY Karaoke "', videoaurl);
                }
                else if (region === 'korea-2') {
                    videoaurl = 'https://youtube.com/@TJ%EB%85%B8%EB%9E%98%EB%B0%A9TJKaraoke';
                    videos = await performSearch('"tj karaoke "', videoaurl);
                }
                else if (region === 'auto') {
                    videoaurl = 'https://youtube.com/';
                    
                    if(chkLng(query)=="kor"){
                        videos = await performSearch('노래방 "', videoaurl);
                    }
                    else if(chkLng(query)=="jpn"){
                        videos = await performSearch('カラオケ "', videoaurl);
                    }
                    else if(chkLng(query)=="eng"){
                        videos = await performSearch('karaoke "', videoaurl);
                    }
                    else{
                        videos = await performSearch('karaoke "', videoaurl);
                    }
                    

                }
                
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


        socket.on('addVideo', async ({ videoUrl, title }) => {
            console.log(`Adding video: ${title} with URL: ${videoUrl}`);
            try {
                const { videoUrlStream, audioUrlStream } = await getVideoStreamUrl(videoUrl);
                playlist.push({ title, videoUrlStream, audioUrlStream }); 
                io.emit('playlistUpdated', playlist, "add"); 
            } catch (error) {
                console.error(`Error fetching stream URL: ${error}`);
                socket.emit('error', 'Failed to fetch stream URL');
            }
        });

        // Handle removing a song from the playlist
        socket.on('removeSong', (index) => {
            if (index >= 0 && index < playlist.length) {
                playlist.splice(index, 1); // Remove the song
                io.emit('playlistUpdated', playlist, "cancel"); 
                
            } else {
                socket.emit('error', 'Invalid index');
            }
        });

        socket.on('removeSongAuto', (index) => {
            if (index >= 0 && index < playlist.length) {
                playlist.splice(index, 1); // Remove the song
                io.emit('playlistUpdated', playlist, "cancelauto"); 
                
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