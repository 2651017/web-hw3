// path, size ⇒ TMDB 이미지 URL
const posterUrl = (path, size) => {
    return "https://image.tmdb.org/t/p/" + size + path;
}

let liked = JSON.parse(localStorage.getItem("liked") || "[]");

// 영화 목록 ⇒ 카드 목록을 그리고 개수를 갱신
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
  if (list.length === 0) {
    board.classList.add("is-empty");
  } else {
    board.classList.remove("is-empty");
  }
}

// 목록, 키, 내림차순 여부 ⇒ 정렬된 새 목록
function sortBy(list, key, desc) {
    const sign = desc ? -1 : 1;
    return [...list].sort((a, b) => {
        if (typeof a[key] === "string") {
            return a[key].localeCompare(b[key]) * sign;
        }
        return (a[key] - b[key]) * sign;
    });
}

// 목록, 검색어 ⇒ 제목이 검색어를 포함하는 새 목록
function search(list, keyword) {
    const q = keyword.trim().toLowerCase();
    return list.filter((m) => m.title.toLowerCase().includes(q));
}

// 현재 입력값 ⇒ 검색·보기·정렬이 적용된 영화 목록
function getView() {
    let list = search(movies, document.querySelector("#q").value);
    const type = document.querySelector('input[name="type"]:checked').value;
    if (type !== "all") {
        list = list.filter((m) => m.type === type);
    }
    const key = document.querySelector("#sort").value;
    return sortBy(list, key, key !== "title");
}

// 없음 ⇒ 현재 조건으로 카드를 다시 그림
function refresh() {
    renderCards(getView());
}

// 없음 ⇒ 찜 목록을 localStorage에 저장
function saveLiked() {
    localStorage.setItem("liked", JSON.stringify(liked));
}

// 영화 제목 ⇒ 해당 영화의 상세 대화상자를 엶
function openDetail(title) {
    const movie = movies.find((m) => m.title === title);
    if (!movie) return;

    document.getElementById("detailBody").innerHTML = `
      <img class="poster" src="${posterUrl(movie.poster, "w500")}" alt="${movie.title} 포스터">
      <h2>${movie.title}</h2>
      <p>개봉일: ${movie.date}</p>
      <p>평점: ${movie.rating}</p>
      <p>${movie.overview}</p>`;
    document.getElementById("detail").showModal();
}

// 검색 입력 ⇒ 현재 보기 갱신
document.querySelector("#q").addEventListener("input", refresh);
// 정렬 선택 ⇒ 현재 보기 갱신
document.querySelector("#sort").addEventListener("change", refresh);
// 보기 선택 ⇒ 현재 보기 갱신
document.querySelector("#typeFilter").addEventListener("change", refresh);
// 보드 클릭 ⇒ 찜 토글 또는 상세 대화상자 표시
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
    openDetail(title);
});

// 닫기 버튼 클릭 ⇒ 상세 대화상자를 닫음
document.getElementById("closeDetail").addEventListener("click", () => {
    document.getElementById("detail").close();
});

// 초기 로드 ⇒ 기본 조건으로 카드 표시
refresh();

