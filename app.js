const posterUrl = (path, size) => {
    return "https://image.tmdb.org/t/p/" + size + path;
}

function renderCards(list) {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        if (m.rating >= 8) {
            card.classList.add("hot"); document.
                getElementById("count").textContent = list.length + "편";
            updateLikeCount();
            if (list.length === 0) { board.classList.add("is-empty"); } else { board.classList.remove("is-empty"); }
        }


        
        card.innerHTML = `
 <img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">
 <span class="badge">${m.rating}</span>
 <div class="info">
 <h2>${m.title}</h2>
 <p class="year">${m.year}</p>
 <button class="like" 
type="button">♥</button>
 </div>`;
        board.appendChild(card);
    }
}
// sortBy : 배열, 키 이름, 참이면 내림차순 ⇒ 새 배열 
function sortBy(list, key, desc) {
    const sign = desc ? -1 : 1;
    return [...list].sort((a, b) => {
        if (typeof a[key] === "string") {
            return a[key].localeCompare(b[key]) * sign;
        }
        return (a[key] - b[key]) * sign;
    });
}

// search : 배열, 문자열 ⇒ 새 배열
function search(list, keyword) {
    const q = keyword.trim().toLowerCase();
    return list.filter((m) => m.title.toLowerCase().includes(q));
}

// formatNumber : 숫자나 숫자 문자열 ⇒ "1,234,567" 
function formatNumber(n) {
    return Number(n).toLocaleString("ko-KR");
}