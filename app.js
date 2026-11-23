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
    const likeClass = liked.includes(m.title) ? "like liked" : "like";

    card.innerHTML = `
      ${poster}
      ${rank}
      <span class="badge">${m.rating}</span>
      <div class="info">
        <h3>${m.title}</h3>
        <p class="year">${m.year}</p>
        <button class="${likeClass}" type="button">♥</button>
      </div>`;
    board.appendChild(card);
  }
  document.getElementById("count").textContent = list.length + "편";
  document.getElementById("likeCount").textContent = liked.length;
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
function getView() {
    let list = search(movies, document.querySelector("#q").value);
    const type = document.querySelector('input[name="type"]:checked').value;
    if (type !== "all") {
        list = list.filter((m) => m.type === type);
    }
    const key = document.querySelector("#sort").value;
    return sortBy(list, key, key !== "title");
}

function refresh() {
    renderCards(getView());
}

let liked = JSON.parse(localStorage.getItem("liked") || "[]");

function saveLiked() {
    localStorage.setItem("liked", JSON.stringify(liked));
}

document.querySelector("#q").addEventListener("input", refresh);
document.querySelector("#sort").addEventListener("change", refresh);
document.querySelector("#typeFilter").addEventListener("change", refresh);
document.querySelector(".board").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const title = card.getAttribute("data-title");
    if (e.target.closest(".like")) {
        const i = liked.indexOf(title);
        if (i === -1) liked.push(title);
        else liked.splice(i, 1);
        saveLiked();
        refresh();
        return;
    }
});

refresh();

