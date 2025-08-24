let socket = io();
        const language = localStorage.getItem('language') || 'de';
        const vid_tgl = localStorage.getItem('vid_tgl') || 'false';
        const region = localStorage.getItem('region') || 'auto';
        window.onload = function() {
            if(vid_tgl === 'false'){
                document.getElementById("myVideo").style.display="none";
                document.getElementById("vid-tgl").checked=false;

            }else{
                document.getElementById("myVideo").style.display="block";
            }
            document.querySelector(`input[name="language"][value="${language}"]`).checked = true;
            document.getElementById('region').value = region;
            if(language=="ko"){
                document.getElementById('txt-sch').style.width="80px";
            }
            else if(language=="en"){
                document.getElementById('txt-title').innerHTML="JK Karaoke";
                document.getElementById('txt-region').innerHTML="Region";
                document.getElementById('txt-lang').innerHTML="Language";
                document.getElementById('txt-setting').innerHTML="Settings";
                document.getElementsByClassName('txt-rlist')[0].innerHTML="Reserve List";
                document.getElementsByClassName('txt-rlist')[1].innerHTML="Reserve List";
                document.getElementById('txt-cancle-list-title').innerHTML="Title";
                // /document.getElementById('txt-cancle-list-action').innerHTML="Action";
                document.getElementById('txt-sch').innerHTML="Search";
                document.getElementById('query').placeholder="Search";
                document.getElementById('txt-ko').innerHTML="Korea";
                document.getElementById('txt-int').innerHTML="International";
                document.getElementById('txt-auto').innerHTML="Automatic";
                document.getElementById('txt-save').innerHTML="Save";
                document.getElementById('txt-video-tgl').innerHTML="On/Off Background Video";
            }
            else if (language == "de") {
                document.getElementById('txt-title').innerHTML = "JK Karaoke";
                document.getElementById('txt-region').innerHTML = "Region";
                document.getElementById('txt-lang').innerHTML = "Sprache";
                document.getElementById('txt-setting').innerHTML = "Einstellungen";
                document.getElementsByClassName('txt-rlist')[0].innerHTML = "Reservierungsliste";
                document.getElementsByClassName('txt-rlist')[1].innerHTML = "Reservierungsliste";
                document.getElementById('txt-cancle-list-title').innerHTML = "Titel";
                // /document.getElementById('txt-cancle-list-action').innerHTML="Action";
                document.getElementById('txt-sch').innerHTML = "Suche";
                document.getElementById('query').placeholder = "Suche";
                document.getElementById('txt-ko').innerHTML = "Korea";
                document.getElementById('txt-int').innerHTML = "International";
                document.getElementById('txt-auto').innerHTML = "Automatisch";
                document.getElementById('txt-save').innerHTML = "Speichern";
                document.getElementById('txt-video-tgl').innerHTML = "Hintergrundvideo Ein/Aus";
            } else if (language == "it") {
                document.getElementById('txt-title').innerHTML = "JK Karaoke";
                document.getElementById('txt-region').innerHTML = "Regione";
                document.getElementById('txt-lang').innerHTML = "Lingua";
                document.getElementById('txt-setting').innerHTML = "Impostazioni";
                document.getElementsByClassName('txt-rlist')[0].innerHTML = "Lista di prenotazione";
                document.getElementsByClassName('txt-rlist')[1].innerHTML = "Lista di prenotazione";
                document.getElementById('txt-cancle-list-title').innerHTML = "Titolo";
                // /document.getElementById('txt-cancle-list-action').innerHTML="Action";
                document.getElementById('txt-sch').innerHTML = "Ricerca";
                document.getElementById('query').placeholder = "Ricerca";
                document.getElementById('txt-ko').innerHTML = "Corea";
                document.getElementById('txt-int').innerHTML = "Internazionale";
                document.getElementById('txt-auto').innerHTML = "Automatico";
                document.getElementById('txt-save').innerHTML = "Salva";
                document.getElementById('txt-video-tgl').innerHTML = "Attiva/Disattiva video di sfondo";
            } else if (language == "fr") {
                document.getElementById('txt-title').innerHTML = "JK Karaoke";
                document.getElementById('txt-region').innerHTML = "Région";
                document.getElementById('txt-lang').innerHTML = "Langue";
                document.getElementById('txt-setting').innerHTML = "Paramètres";
                document.getElementsByClassName('txt-rlist')[0].innerHTML = "Liste de réservation";
                document.getElementsByClassName('txt-rlist')[1].innerHTML = "Liste de réservation";
                document.getElementById('txt-cancle-list-title').innerHTML = "Titre";
                // /document.getElementById('txt-cancle-list-action').innerHTML="Action";
                document.getElementById('txt-sch').innerHTML = "Recherche";
                document.getElementById('query').placeholder = "Recherche";
                document.getElementById('txt-ko').innerHTML = "Corée";
                document.getElementById('txt-int').innerHTML = "International";
                document.getElementById('txt-auto').innerHTML = "Automatique";
                document.getElementById('txt-save').innerHTML = "Enregistrer";
                document.getElementById('txt-video-tgl').innerHTML = "Activer/Désactiver la vidéo d'arrière-plan";
            } else if (language == "ch") {
                document.getElementById('txt-sch').style.width="80px";
                document.getElementById('txt-title').innerHTML = "JK Karaoke";
                document.getElementById('txt-region').innerHTML = "地區";
                document.getElementById('txt-lang').innerHTML = "語言";
                document.getElementById('txt-setting').innerHTML = "設定";
                document.getElementsByClassName('txt-rlist')[0].innerHTML = "預訂清單";
                document.getElementsByClassName('txt-rlist')[1].innerHTML = "預訂清單";
                document.getElementById('txt-cancle-list-title').innerHTML = "標題";
                // /document.getElementById('txt-cancle-list-action').innerHTML="Action";
                document.getElementById('txt-sch').innerHTML = "搜索";
                document.getElementById('query').placeholder = "搜索";
                document.getElementById('txt-ko').innerHTML = "韓國";
                document.getElementById('txt-int').innerHTML = "國際";
                document.getElementById('txt-auto').innerHTML = "自動";
                document.getElementById('txt-save').innerHTML = "保存";
                document.getElementById('txt-video-tgl').innerHTML = "開啟/關閉背景視頻";
            }
            else if(language=="es"){
                document.getElementById('txt-sch').style.width="80px";
                document.getElementById('txt-title').innerHTML="JK Karaoke";
                document.getElementById('txt-region').innerHTML="Región";
                document.getElementById('txt-lang').innerHTML="Idioma";
                document.getElementById('txt-setting').innerHTML="Ajustes";
                document.getElementsByClassName('txt-rlist')[0].innerHTML="Lista de Reserva";
                document.getElementsByClassName('txt-rlist')[1].innerHTML="Lista de Reserva";
                document.getElementById('txt-cancle-list-title').innerHTML="Título";
                // /document.getElementById('txt-cancle-list-action').innerHTML="Action";
                document.getElementById('txt-sch').innerHTML="Buscar";
                document.getElementById('query').placeholder="Buscar";
                document.getElementById('txt-ko').innerHTML="Corea";
                document.getElementById('txt-int').innerHTML="Internacional";
                document.getElementById('txt-auto').innerHTML="Automático";
                document.getElementById('txt-save').innerHTML="Guardar";
                document.getElementById('txt-video-tgl').innerHTML="Activar/Desactivar Video de Fondo";
            }
        };
        async function sendToPlayer(videoUrl, title) {
    const language = localStorage.getItem('language') || 'ko';
    const region = localStorage.getItem('region') || 'korea';

    // Confirm with the user based on language
    const confirmationMessage = language === "ko" 
        ? `"${title}"을(를) 예약 하시겠습니까?` 
        : language === "de"
            ? `Möchten Sie "${title}" reservieren?`
            : language === "it"
                ? `Vuoi prenotare "${title}"?`
                : language === "fr"
                    ? `Voulez-vous réserver "${title}"?`
                    : language === "ch"
                        ? `您要預訂 "${title}" 嗎?`
                        : language === "es"
                            ? `¿Desea reservar "${title}"?`
                            : `Do you want to reserve "${title}"?`;

    if (confirm(confirmationMessage)) {
        let namePromptMessage = "";
        const language = localStorage.getItem('language') || 'ko';

        if (language === "ko") {
            namePromptMessage = "이름을 입력하세요 (그룹 또는 개인)";
        } else if (language === "de") {
            namePromptMessage = "Bitte geben Sie Ihren Namen ein (Gruppe oder Einzelperson)";
        } else if (language === "it") {
            namePromptMessage = "Inserisci il tuo nome (Gruppo o Individuale)";
        } else if (language === "fr") {
            namePromptMessage = "Veuillez entrer votre nom (Groupe ou Individuel)";
        } else if (language === "ch") {
            namePromptMessage = "請輸入您的名字（團體或個人）";
        } else if (language === "es") {
            namePromptMessage = "Por favor ingrese su nombre (Grupo o Individual)";
        } else {
            namePromptMessage = "Please enter your name (Group or Individual)";
        }

        title += " - " + prompt(namePromptMessage);
        socket.emit('addVideo', { videoUrl, title, language, region });

        console.log('Video selected successfully');
    }
}
        // Function to remove a song from the playlist
        function removeFromPlaylist(index) {
            console.log(`Attempting to remove song at index: ${index}`);
            fetch('/remove-song', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ index })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Song removed successfully');
                    } else {
                        console.error('Failed to remove song');
                    }
                })
                .catch(error => {
                    console.error('Error occurred while removing song:', error);
                });
        }

        // Asynchronous search function using Fetch
        async function searchYouTube(query) {
            const region = localStorage.getItem('region') || 'korea'; // Use stored region preference
            const language = localStorage.getItem('language') || 'en'; // Use stored language preference

            // Check if the query is a URL
            if (query.includes("https")) {
                sendToPlayer(query, prompt("Enter song name"));
                return;
            }

            // Emit the search event to the server
            socket.emit('search', query, region);

            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; // Clear previous results

            // Listen for search results from the server
            socket.on('searchResults', (videos) => {
                resultsContainer.innerHTML = ''; // Clear previous results

                if (videos && videos.length > 0) {
                    const table = document.createElement('table');
                    const thead = document.createElement('thead');

                    // Set table headers based on language
                    if (language === "en") {
                        thead.innerHTML = `<tr><th style="width:100%">Title</th><th>Action</th></tr>`;
                    } else if (language === "de") {
                        thead.innerHTML = `<tr><th style="width:100%">Titel</th><th>Aktion</th></tr>`;
                    } else if (language === "it") {
                        thead.innerHTML = `<tr><th style="width:100%">Titolo</th><th>Azione</th></tr>`;
                    } else if (language === "fr") {
                        thead.innerHTML = `<tr><th style="width:100%">Titre</th><th>Action</th></tr>`;
                    } else if (language === "ch") {
                        thead.innerHTML = `<tr><th style="width:100%">標題</th><th>操作</th></tr>`;
                    } else if (language === "es") {
                        thead.innerHTML = `<tr><th style="width:100%">Título</th><th>Acción</th></tr>`;
                    } else {
                        thead.innerHTML = `<tr><th style="width:100%">제목</th><th>동작</th></tr>`;
                    }
                    table.appendChild(thead);

                    const tbody = document.createElement('tbody');
                    videos.forEach(video => {
                        const row = document.createElement('tr');
                        const titleCell = document.createElement('td');
                        titleCell.innerText = video.title;

                        const actionCell = document.createElement('td');
                        const link = document.createElement('button');
                        link.href = 'javascript:void(0)';

                        // Set button text based on language
                        if (language === "en") {
                            link.innerText = 'Reserve';
                            link.style.width = "80px";
                        } else if (language === "de") {
                            link.innerText = 'Reserv.';
                            link.style.width = "100px";
                        } else if (language === "it") {
                            link.innerText = 'Prenota';
                            link.style.width = "80px";
                        } else if (language === "fr") {
                            link.innerText = 'Réserver';
                            link.style.width = "90px";
                        } else if (language === "ch") {
                            link.innerText = '預訂';
                            link.style.width = "60px";
                        } else if (language === "es") {
                            link.innerText = 'Reservar';
                            link.style.width = "90px";
                        } else {
                            link.innerText = '예약';
                            link.style.width = "60px";
                        }

                        link.style.fontWeight = "bold";
                        link.onclick = () => sendToPlayer(video.videoUrl, video.title);
                        actionCell.appendChild(link);

                        row.appendChild(titleCell);
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

        function isURL(query) {
            try {
                new URL(query);
                return true;
            } catch (error) {
                return false;
            }
        }

        // Handle form submission asynchronously to prevent refresh
        function handleSubmit(event) {
            event.preventDefault();  // Prevent page refresh
            const query = document.getElementById('query').value;
            console.log(query);
            searchYouTube(query);  // Perform asynchronous search
        }

        // Toggle the playlist modal
        var playlistInt;

function togglePlaylistModal() {
    // Update the language of the "Remove" buttons if necessary
    if (language === "en") {
      //  for (var i = 0; i < document.getElementsByClassName('remove-btn').length; i++) {
     //       document.getElementsByClassName('remove-btn')[i].innerHTML = "Remove";
       // }
    }

    // Show the playlist modal
    const modal = document.getElementById('playlistModal');
    modal.style.display = 'block';

    // Add a small delay for smooth animation
    setTimeout(() => {
        document.getElementsByClassName('modal-content')[1].style.marginTop = "10vh";
        document.getElementsByClassName('blur')[1].style.backdropFilter = "blur(8px)";
    }, 10);

    socket.emit('getPlaylist');

    // Listen for playlist updates from the server
    socket.on('playlistUpdated', (data) => {
        updatePlaylist(data);
    });
}

// Function to update the playlist UI
function updatePlaylist(playlist) {
    const playlistTableBody = document.getElementById('playlist-body');
    playlistTableBody.innerHTML = ''; // Clear previous playlist

    playlist.forEach((item, index) => {
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        titleCell.innerText = item.title;

        //const actionCell = document.createElement('td');
       // const removeBtn = document.createElement('button');
        //removeBtn.innerText = language === "ko" ? '삭제' : 'Remove';
        //removeBtn.classList.add('remove-btn');
        //removeBtn.onclick = () => removeFromPlaylist(index);

        //actionCell.appendChild(removeBtn);
        row.appendChild(titleCell);
        //row.appendChild(actionCell);
        playlistTableBody.appendChild(row);
    });
}

// Function to remove a song from the playlist
function removeFromPlaylist(index) {
    if (confirm(language === "ko" ? '이 곡을 플레이리스트에서 삭제하시겠습니까?' : 'Do you want to remove this song from the playlist?')) {
        socket.emit('removeSong', index);
    }
}
        // Close the playlist modal
        function closeModal() {
            setTimeout(() => {
                document.getElementsByClassName('modal-content')[1].style.marginTop="-100vh";
                document.getElementsByClassName('blur')[1].style.backdropFilter="none";
            }, "10");
            setTimeout(() => {
                const modal = document.getElementById('playlistModal');
                modal.style.display = 'none';
            }, "400");
            clearInterval(playlistInt);
        }

        // Close modal if clicked outside the modal content
        window.onclick = function(event) {
            const modal = document.getElementById('playlistModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        // Real-time playlist updates
        function updatePlaylist(playlist) {
            if (playlist.length !== 0) {
                document.getElementById('list-tbl').style.display = "block";
            } else {
                document.getElementById('list-tbl').style.display = "none";
            }
            const playlistTableBody = document.getElementById('playlist-body');
            playlistTableBody.innerHTML = ''; // Clear previous playlist

            playlist.forEach((item, index) => {
                const row = document.createElement('tr');
                const noCell = document.createElement('td');
                noCell.innerText = index + 1;
                const titleCell = document.createElement('td');
                titleCell.innerText = item.title;
                row.appendChild(noCell);
                row.appendChild(titleCell);

                if (index === 0) {
                    row.style.fontWeight = "bold";
                    row.style.color = "#007bff";
                }

                playlistTableBody.appendChild(row);
                titleCell.innerText = item.title;
                /*const removeBtn = document.createElement('button');
                if (language === "en") {
                    removeBtn.innerText = 'Remove';
                    removeBtn.style.width = "80px";
                } else {
                    removeBtn.innerText = '취소';
                    removeBtn.style.width = "60px";
                }

                removeBtn.style.height = "40px";
                removeBtn.classList.add('remove-btn');
                removeBtn.onclick = () => removeFromPlaylist(index);

                actionCell.appendChild(removeBtn);*/
                row.appendChild(noCell);
                row.appendChild(titleCell);
                playlistTableBody.appendChild(row);
            });
        }



        
        function toggleSettingsModal() {
            const modal = document.getElementById('settingsModal');
            modal.style.display = 'block';
            setTimeout(() => {
                document.getElementsByClassName('modal-content')[0].style.marginTop="10vh";
                document.getElementsByClassName('blur')[0].style.backdropFilter="blur(8px)";
            }, "10");
        }

        function closeSettingsModal() {
            setTimeout(() => {
                document.getElementsByClassName('modal-content')[0].style.marginTop="-55vh";
                document.getElementsByClassName('blur')[0].style.backdropFilter="none";
            }, "10");
            setTimeout(() => {
                const modal = document.getElementById('settingsModal');
                modal.style.display = 'none';
            }, "400");
        }

        // Save settings to localStorage
        function saveSettings() {
            const language = document.querySelector('input[name="language"]:checked').value;
            const region = document.getElementById('region').value;
            const vid_tgl = document.getElementById('vid-tgl').checked;

            localStorage.setItem('language', language);
            localStorage.setItem('region', region);
            localStorage.setItem('vid_tgl', vid_tgl);

            location.reload();
            closeSettingsModal();
        }
        