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
      card.classList.add("hot");
    }
    card.setAttribute("data-type", m.type);
    card.setAttribute("data-title", m.title);
    let rank = "";
    if (m.type === "boxoffice") {
      rank = `<span class="rank">${m.rank}</span>`;
    }
    let poster;
    if (m.poster === null) {
      card.classList.add("no-poster");
      poster = `<div class="poster-fallback">${m.title[0]}</div>`;
    } else {
      poster = `<img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">`;
    }

    card.innerHTML = `
      ${poster}
      ${rank}
      <span class="badge">${m.rating}</span>
      <div class="info">
        <h3>${m.title}</h3>
        <p class="year">${m.year}</p>
      </div>`;
    board.appendChild(card);
  }
  document.getElementById("count").textContent = list.length + "편";
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

renderCards(movies);

