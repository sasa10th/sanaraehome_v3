document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initMobileMenu();
    initScrollSpy();
    initSmoothScroll();
    initHeroParallax();
    initScrollReveal();
    initDetailsAnimation();
    initMobileSlider();
});

/* 타이핑 애니메이션 */
function initTypingAnimation() {
    const dataElem = document.getElementById("typing-data");
    const target = document.getElementById("typing-text");
    
    if (!dataElem || !target) return;

    const messages = dataElem.dataset.messages.split(',').map(s => s.trim());
    let msgIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = messages[msgIndex];
        const visible = current.substring(0, charIndex);
        target.textContent = visible;

        let typeSpeed = 100;

        if (!isDeleting) {
            charIndex++;
            if (charIndex > current.length) {
                isDeleting = true;
                typeSpeed = 1000;
            }
        } else {
            charIndex--;
            typeSpeed = 60;
            if (charIndex === 0) {
                isDeleting = false;
                msgIndex = (msgIndex + 1) % messages.length;
            }
        }

        setTimeout(type, typeSpeed);
    }
    type();
}

/* 모바일 드롭다운 메뉴 */
function initMobileMenu() {
    const burger = document.getElementById("hamburger");
    const menu = document.getElementById("dropdownMenu");

    if (!burger || !menu) return;

    burger.addEventListener("click", (event) => {
        event.stopPropagation();
        burger.classList.toggle("active");
        menu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        menu.classList.remove("active");
        burger.classList.remove("active");
    });
}

/* 현재 섹션 */
function initScrollSpy() {
    const sections = document.querySelectorAll("section, footer");
    const pcLinks = document.querySelectorAll(".pc-nav a");

    if (sections.length === 0) return;

    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    pcLinks.forEach(a => a.classList.remove("active"));
                    
                    const activeLink = document.querySelector(`.pc-nav a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add("active");
                }
            });
        },
        {
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0
        }
    );

    sections.forEach(section => navObserver.observe(section));
}

/* 부드러운 스크롤 */
function initSmoothScroll() {
    const links = document.querySelectorAll(".pc-nav a, .dropdown-menu a");
    const burger = document.getElementById("hamburger");
    const menu = document.getElementById("dropdownMenu");
    const header = document.querySelector("header");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const id = href.substring(1);
            const targetSection = document.getElementById(id);

            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const extraOffset = 100; // 추가 여백

                const offsetTop =
                    targetSection.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    extraOffset;

                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });

                if (menu) menu.classList.remove("active");
                if (burger) burger.classList.remove("active");
            }
        });
    });
}

/* Hero 텍스트 패럴랙스 효과 */
function initHeroParallax() {
    const heroText = document.getElementById('hero-text');
    if (!heroText) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                heroText.style.opacity = 1 - scrollPosition / 400;
                heroText.style.transform = `translateY(-${scrollPosition / 2}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* 페이드인 */
function initScrollReveal() {
    const hiddenElements = document.querySelectorAll('.fade-in-box');
    if (hiddenElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    hiddenElements.forEach((el) => fadeObserver.observe(el));
}

/* 아코디언 */
function initDetailsAnimation() {
    const detailsList = document.querySelectorAll("details");

    detailsList.forEach(details => {
        const summary = details.querySelector("summary");
        if (!summary) return;

        summary.addEventListener("click", () => {
        });
    });
}

/* 사진 열기 */
function openModal(imgSrc) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    if (!imgSrc) {
        return; 
    }
    modal.style.display = "flex";
    modalImg.src = imgSrc;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

/* 안내사항 */
/* 공지사항 */
async function fetchNotices() {
    const container = document.getElementById("notice-list-container");

    try {
        const response = await fetch("./assets/files/notices.json");
        if (!response.ok) throw new Error();

        const data = await response.json();

        container.innerHTML = data.map(item => `
            <div class="notice-item">
                <div class="notice-header">
                    <div class="notice-title-group">
                        <span class="notice-badge ${item.important ? 'important' : ''}">
                            ${item.tag}
                        </span>
                        <span class="notice-title">${item.title}</span>
                    </div>
                    <span class="notice-date">
                        <span class="notice-hint">클릭하여 펼치기</span>&emsp;${item.date}
                    </span>
                </div>
                <div class="notice-content">
                    <div class="notice-text">${item.content}</div>
                    ${item.file ? `
                        <div class="notice-file-area">
                            <a href="assets/files/${item.file}" class="file-download-link" download>
                                <i class="bi bi-file-earmark-arrow-down"></i> ${item.file} 다운로드
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join("");

        document.querySelectorAll(".notice-header").forEach(header => {
            header.addEventListener("click", () => {
                const item = header.parentElement;
                const hint = header.querySelector(".notice-hint");

                const isOpen = item.classList.toggle("active");
                if (hint) {
                    hint.textContent = isOpen
                        ? "클릭하여 접기"
                        : "클릭하여 펼치기";
                }
            });
        });

    } catch {
        container.innerHTML = "<p style='text-align:center;'>공지사항이 없습니다.</p>";
    }
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', fetchNotices);

/* 모바일 슬라이더 — 섹션을 가로로 배치하고 스와이프로 이동 */
function initMobileSlider() {
    if (!window.matchMedia('(pointer: coarse) and (max-width: 768px)').matches) return;

    // contact와 footer를 하나의 래퍼로 묶기
    const contact = document.getElementById('contact');
    const footer = document.querySelector('body > footer');
    if (contact && footer) {
        const wrapper = document.createElement('div');
        wrapper.id = 'contact-footer-slide';
        contact.parentNode.insertBefore(wrapper, contact);
        wrapper.appendChild(contact);
        wrapper.appendChild(footer);
    }

    const slides = Array.from(document.querySelectorAll('body > section, body > #contact-footer-slide, body > footer:not(#contact-footer-slide footer)'));
    // contact-footer-slide가 삽입된 경우 body > footer는 이미 래퍼 안으로 들어갔으므로 중복 제거
    const sections = slides.filter(el => el.tagName !== 'FOOTER');
    if (sections.length === 0) return;

    // 슬라이더 DOM 구조 생성
    // #mobile-slider (고정 뷰포트 컨테이너)
    //   └─ #mobile-track (가로 flex, transform으로 이동)
    //        └─ 각 슬라이드 (section 또는 #contact-footer-slide)
    const allSlides = Array.from(document.querySelectorAll('body > section, body > #contact-footer-slide'));

    const slider = document.createElement('div');
    slider.id = 'mobile-slider';

    const track = document.createElement('div');
    track.id = 'mobile-track';
    slider.appendChild(track);

    allSlides[0].parentNode.insertBefore(slider, allSlides[0]);
    allSlides.forEach(sec => track.appendChild(sec));

    // 도트 인디케이터 생성
    const dotsEl = document.createElement('div');
    dotsEl.id = 'slide-dots';
    allSlides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsEl.appendChild(dot);
    });
    document.body.appendChild(dotsEl);

    let current = 0;
    let isAnimating = false;

    function goToSlide(index) {
        if (index < 0 || index >= allSlides.length || isAnimating) return;
        isAnimating = true;
        current = index;

        // 가로 이동
        track.style.transform = `translateX(calc(${-index} * 100vw))`;

        // 도트 업데이트
        document.querySelectorAll('.slide-dot').forEach((d, i) =>
            d.classList.toggle('active', i === index));

        // 전환 후 새 섹션 내부 스크롤 초기화
        setTimeout(() => {
            allSlides[index].scrollTop = 0;
            isAnimating = false;
        }, 460);
    }

    // 네비게이션 링크 → goToSlide 로 오버라이드
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').substring(1);
            if (!id) return;
            const idx = allSlides.findIndex(s => s.id === id || s.querySelector('#' + id));
            if (idx !== -1) {
                e.preventDefault();
                e.stopImmediatePropagation();
                goToSlide(idx);
            }
        });
    });

    // 터치 스와이프 처리
    let startX = 0, startY = 0, isHorizontal = false;

    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isHorizontal = false;
    }, { passive: true });

    track.addEventListener('touchmove', e => {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (!isHorizontal && dx > dy && dx > 8) isHorizontal = true;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        if (!isHorizontal) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) < 50) return;
        goToSlide(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });
}