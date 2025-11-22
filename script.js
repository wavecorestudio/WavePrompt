const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const paginationContainer = document.getElementById("pagination");

let allPrompts = [];
let currentFiltered = [];
let currentPage = 1;
let currentLang = "en";
const rows = 12;

const translations = {
  en: {
    subtitle: "1060+ ChatGPT Prompts Archive",
    placeholder: "Search prompts (e.g. Marketing, Email...)",
    copyBtn: "Copy Prompt",
    toast: "Copied to Clipboard!",
    categories: {
      all: "All",
      Marketing: "Marketing",
      Coding: "Coding",
      Business: "Business",
      "Personal Finance": "Finance",
      "Personal Growth": "Growth",
      "Social Media": "Social",
      Education: "Education",
      "Health & Wellness": "Health",
      Productivity: "Productivity",
      "Self Care": "Self Care",
      "Creative Projects": "Creative",
    },
  },
  ko: {
    subtitle: "1060개 이상의 챗GPT 프롬프트 아카이브",
    placeholder: "프롬프트 검색 (예: 마케팅, 이메일...)",
    copyBtn: "프롬프트 복사",
    toast: "클립보드에 복사되었습니다!",
    categories: {
      all: "전체",
      Marketing: "마케팅",
      Coding: "코딩",
      Business: "비즈니스",
      "Personal Finance": "금융",
      "Personal Growth": "성장",
      "Social Media": "SNS",
      Education: "교육",
      "Health & Wellness": "건강",
      Productivity: "생산성",
      "Self Care": "자기관리",
      "Creative Projects": "창작",
    },
  },
};

// 해시태그 생성기
function generateHashtag(item) {
  const p = item.prompt.toLowerCase();
  let categoryKo = "";

  switch (item.category) {
    case "Coding":
      categoryKo = "코딩";
      break;
    case "Business":
      categoryKo = "사업";
      break;
    case "Personal Finance":
      categoryKo = "금융";
      break;
    case "Personal Growth":
      categoryKo = "성장";
      break;
    case "Social Media":
      categoryKo = "SNS";
      break;
    case "Education":
      categoryKo = "교육";
      break;
    case "Health & Wellness":
      categoryKo = "건강";
      break;
    case "Productivity":
      categoryKo = "생산성";
      break;
    case "Self Care":
      categoryKo = "힐링";
      break;
    case "Creative Projects":
      categoryKo = "창작";
      break;
    case "Marketing":
      categoryKo = "마케팅";
      break;
    default:
      categoryKo = "기타";
  }

  let keyword = "프롬프트";
  if (p.includes("list") || p.includes("compile")) keyword = "모음";
  else if (p.includes("plan") || p.includes("blueprint")) keyword = "계획";
  else if (p.includes("tips") || p.includes("advice")) keyword = "꿀팁";
  else if (p.includes("strategy")) keyword = "전략";
  else if (p.includes("resource")) keyword = "자료";
  else if (p.includes("ideas")) keyword = "아이디어";
  else if (p.includes("schedule")) keyword = "루틴";
  else if (p.includes("guide")) keyword = "가이드";

  return `#${categoryKo}_${keyword}`;
}

// 1. 데이터 불러오기
async function fetchPrompts() {
  try {
    const response = await fetch("./data.json");
    const rawData = await response.json();

    allPrompts = rawData.map((item) => {
      const hashtag = generateHashtag(item);
      // 제목 정리
      let cleanTitle = item.title.replace("...", "").trim();
      if (cleanTitle.length > 40)
        cleanTitle = cleanTitle.substring(0, 40) + "..";

      return {
        ...item,
        cleanTitle: cleanTitle, // 순수 제목
        hashtag: hashtag, // 해시태그 따로 저장
      };
    });

    currentFiltered = allPrompts;
    renderPage(1);
  } catch (error) {
    console.error("Error:", error);
    cardsContainer.innerHTML =
      '<p style="text-align:center">데이터 로드 실패</p>';
  }
}

// 2. 페이지 렌더링
function renderPage(page) {
  currentPage = page;
  cardsContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  const start = (page - 1) * rows;
  const end = start + rows;
  const paginatedItems = currentFiltered.slice(start, end);

  if (paginatedItems.length === 0) {
    cardsContainer.innerHTML =
      '<p style="text-align:center; width:100%; margin-top:20px;">검색 결과가 없습니다.</p>';
    return;
  }

  const btnText = translations[currentLang].copyBtn;

  paginatedItems.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
            <div class="card-header">
                <span class="badge">${item.category}</span>
                <i class="fa-regular fa-copy" style="color:#899099"></i>
            </div>
            
            <h3>${item.cleanTitle}</h3>
            
            <div class="hashtag">${item.hashtag}</div>
            
            <p>${item.desc}</p>
            <button class="copy-btn" onclick="copyToClipboard('${escapeJs(
              item.prompt
            )}')">
                <i class="fa-solid fa-bolt"></i> ${btnText}
            </button>
        `;
    cardsContainer.appendChild(card);
  });

  setupPagination(currentFiltered.length, rows);
}

// 3. 페이지네이션
function setupPagination(totalItems, rowsPerPage) {
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(totalItems / rowsPerPage);
  if (pageCount <= 1) return;

  const addBtn = (page, text, isActive = false) => {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.classList.add("page-btn");
    if (isActive) btn.classList.add("active");
    btn.addEventListener("click", () => {
      renderPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    paginationContainer.appendChild(btn);
  };

  const addDots = () => {
    const dots = document.createElement("span");
    dots.innerText = "...";
    dots.style.color = "#899099";
    dots.style.margin = "0 5px";
    dots.style.fontWeight = "bold";
    paginationContainer.appendChild(dots);
  };

  if (currentPage > 1) addBtn(Math.max(1, currentPage - 10), "⟪");
  if (currentPage > 1) addBtn(currentPage - 1, "⟨");

  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) addBtn(i, i, i === currentPage);
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) addBtn(i, i, i === currentPage);
      addDots();
      addBtn(pageCount, pageCount, false);
    } else if (currentPage >= pageCount - 3) {
      addBtn(1, 1, false);
      addDots();
      for (let i = pageCount - 4; i <= pageCount; i++)
        addBtn(i, i, i === currentPage);
    } else {
      addBtn(1, 1, false);
      addDots();
      addBtn(currentPage - 1, currentPage - 1, false);
      addBtn(currentPage, currentPage, true);
      addBtn(currentPage + 1, currentPage + 1, false);
      addDots();
      addBtn(pageCount, pageCount, false);
    }
  }

  if (currentPage < pageCount) addBtn(currentPage + 1, "⟩");
  if (currentPage < pageCount)
    addBtn(Math.min(pageCount, currentPage + 10), "⟫");
}

// 4. 검색 & 필터
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  currentFiltered = allPrompts.filter(
    (item) =>
      item.title.toLowerCase().includes(keyword) ||
      item.prompt.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
  );
  renderPage(1);
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    const category = btn.getAttribute("data-filter");
    currentFiltered =
      category === "all"
        ? allPrompts
        : allPrompts.filter((item) => item.category === category);
    renderPage(1);
  });
});

// 5. 언어 토글
const langToggle = document.getElementById("langToggle");
langToggle.addEventListener("change", () => {
  currentLang = langToggle.checked ? "ko" : "en";
  const t = translations[currentLang];
  document.querySelector(".subtitle").textContent = t.subtitle;
  document.getElementById("searchInput").placeholder = t.placeholder;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    const filterKey = btn.getAttribute("data-filter");
    if (t.categories[filterKey]) btn.textContent = t.categories[filterKey];
  });
  renderPage(currentPage);
});

// 유틸리티
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(showToast);
}
function escapeJs(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}
function showToast() {
  const toast = document.getElementById("toast");
  toast.innerText = translations[currentLang].toast;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// Scroll Top
const topBtn = document.getElementById("topBtn");
window.onscroll = function () {
  topBtn.style.display =
    document.body.scrollTop > 300 || document.documentElement.scrollTop > 300
      ? "block"
      : "none";
};
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

fetchPrompts();
