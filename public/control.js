let socket = io();
        
        async function sendToPlayer(videoUrl, title) {
            if (confirm(`Do you want to reserve "${title}"?`)) {
                title += " - " + prompt("Please enter your name (Group or Individual)");
                socket.emit('addVideo', { videoUrl, title });
            }
        }

        async function searchYouTube(query) {
            socket.emit('search', query);
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = '';

            socket.on('searchResults', (videos) => {
                resultsContainer.innerHTML = '';
                if (videos && videos.length > 0) {
                    const table = document.createElement('table');
                    table.innerHTML = `<thead><tr><th>Title</th><th>Action</th></tr></thead>`;
                    const tbody = document.createElement('tbody');

                    videos.forEach(video => {
                        const row = document.createElement('tr');
                        row.innerHTML = `<td>${video.title}</td>`;
                        const actionCell = document.createElement('td');
                        const reserveBtn = document.createElement('button');
                        reserveBtn.innerText = 'Reserve';
                        reserveBtn.classList.add('search-btn');
                        reserveBtn.onclick = () => sendToPlayer(video.videoUrl, video.title);
                        actionCell.appendChild(reserveBtn);
                        row.appendChild(actionCell);
                        tbody.appendChild(row);
                    });
                    table.appendChild(tbody);
                    resultsContainer.appendChild(table);
                } else {
                    resultsContainer.innerText = 'No results found';
                }
            });
        }

        function handleSubmit(event) {
            event.preventDefault();
            const query = document.getElementById('query').value;
            searchYouTube(query);
        }

        function updatePlaylist(playlist) {
            const playlistTableBody = document.getElementById('playlist-body');
            playlistTableBody.innerHTML = '';
            
            playlist.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${item.title}</td>`;
                
                const actionCell = document.createElement('td');
                const removeBtn = document.createElement('button');
                removeBtn.innerText = 'Cancel';
                removeBtn.classList.add('remove-btn');
                removeBtn.onclick = () => removeFromPlaylist(index);
                actionCell.appendChild(removeBtn);
                row.appendChild(actionCell);
                playlistTableBody.appendChild(row);
            });
        }

        function removeFromPlaylist(index) {
            if (confirm('Do you want to remove this song from the reserve list?')) {
                socket.emit('removeSong', index);
            }
        }

        socket.on('playlistUpdated', (playlist) => {
            updatePlaylist(playlist);
        });