const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const paginationContainer = document.getElementById("pagination");

let allPrompts = [];
let currentFiltered = []; // 현재 검색/필터된 데이터
let currentPage = 1;
const rows = 12; // ⭐️ 한 페이지에 보여줄 카드 개수 (여기서 조절하세요)

// 1. 데이터 불러오기
async function fetchPrompts() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    allPrompts = data;
    currentFiltered = data; // 처음엔 모든 데이터가 대상
    renderPage(1); // 1페이지 그리기
  } catch (error) {
    console.error("Error:", error);
    cardsContainer.innerHTML =
      '<p style="text-align:center">데이터 로드 실패</p>';
  }
}

// 2. 페이지 렌더링 (데이터 자르기 + 버튼 만들기)
function renderPage(page) {
  currentPage = page;
  cardsContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  // A. 데이터 자르기 (Pagination Logic)
  const start = (page - 1) * rows;
  const end = start + rows;
  const paginatedItems = currentFiltered.slice(start, end);

  if (paginatedItems.length === 0) {
    cardsContainer.innerHTML =
      '<p style="text-align:center; width:100%; margin-top:20px;">검색 결과가 없습니다.</p>';
    return;
  }

  // B. 카드 그리기
  paginatedItems.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
            <div class="card-header">
                <span class="badge">${item.category}</span>
                <i class="fa-regular fa-copy" style="color:#899099"></i>
            </div>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <button class="copy-btn" onclick="copyToClipboard('${escapeJs(
              item.prompt
            )}')">
                <i class="fa-solid fa-bolt"></i> Copy Prompt
            </button>
        `;
    cardsContainer.appendChild(card);
  });

  // C. 페이지 버튼 그리기
  setupPagination(currentFiltered.length, rows);
}

// 3. 페이지네이션 버튼 생성 함수
function setupPagination(totalItems, rowsPerPage) {
  const pageCount = Math.ceil(totalItems / rowsPerPage);

  // 페이지가 1개뿐이면 버튼 숨김
  if (pageCount <= 1) return;

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.classList.add("page-btn");
    if (i === currentPage) btn.classList.add("active");

    btn.addEventListener("click", () => {
      renderPage(i);
      window.scrollTo({ top: 0, behavior: "smooth" }); // 클릭 시 맨 위로 스크롤
    });
    paginationContainer.appendChild(btn);
  }
}

// 4. 검색 기능 (검색하면 1페이지로 리셋)
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  currentFiltered = allPrompts.filter(
    (item) =>
      item.title.toLowerCase().includes(keyword) ||
      item.prompt.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
  );
  renderPage(1); // 검색 결과의 1페이지로 이동
});

// 5. 카테고리 필터 (필터하면 1페이지로 리셋)
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    const category = btn.getAttribute("data-filter");
    if (category === "all") {
      currentFiltered = allPrompts;
    } else {
      currentFiltered = allPrompts.filter((item) => item.category === category);
    }
    renderPage(1);
  });
});

// 기타 유틸리티
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(showToast);
}

function escapeJs(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// 시작
fetchPrompts();
