let players = [];
let currentPage = 1;
const rowsPerPage = 10;

async function loadPlayers() {
    const res = await fetch('players.json');
    const rawData = await res.json();

    players = rawData.map((player, index) => {
        const [firstName, lastName] = player.name.split(' ');
        return {
            rank: index + 1,
            firstName,
            lastName,
            score: player.score,
            level: player.level,
            joinDate: player.join_date,
            country: player.country,
            avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(player.name)}`
        };
    });

    renderTable();
    setupSorting();
    setupPagination();
}

function renderTable() {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pagePlayers = players.slice(start, end);

    pagePlayers.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${player.rank}</td>
      <td><img src="${player.avatar}" alt="Avatar of ${player.firstName}" class="avatar" /></td>
      <td>${player.firstName}</td>
      <td>${player.lastName}</td>
      <td>${player.score}</td>
      <td>${player.level}</td>
      <td>${player.joinDate}</td>
      <td>${player.country}</td>
    `;
        tbody.appendChild(row);
    });

    document.getElementById('page-info').textContent = `Page ${currentPage}`;
}

function setupPagination() {
    document.getElementById('prev-btn').onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    };

    document.getElementById('next-btn').onclick = () => {
        if (currentPage < Math.ceil(players.length / rowsPerPage)) {
            currentPage++;
            renderTable();
        }
    };
}

function setupSorting() {
    document.querySelectorAll('th[data-sort]').forEach(header => {
        let ascending = true;
        header.addEventListener('click', () => {
            const key = header.getAttribute('data-sort');
            players.sort((a, b) => {
                if (key === 'joinDate') {
                    return ascending
                        ? new Date(a[key]) - new Date(b[key])
                        : new Date(b[key]) - new Date(a[key]);
                }
                return ascending
                    ? a[key].toString().localeCompare(b[key].toString())
                    : b[key].toString().localeCompare(a[key].toString());
            });
            ascending = !ascending;
            renderTable();
        });
    });
}

loadPlayers();
