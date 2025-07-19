// Hero Slider Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % totalSlides;
    slides[currentSlide].classList.add('active');
}

// Auto slide every 5 seconds
setInterval(nextSlide, 5000);

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Search functionality
document.querySelector('.search-submit').addEventListener('click', function() {
    const tripType = document.querySelector('.trip-type').value;
    const destination = document.querySelector('.search-box input').value;
    
    if (destination.trim() === '') {
        alert('여행지를 입력해주세요.');
        return;
    }
    
    // Here you would typically send the data to a server
    console.log(`검색 유형: ${tripType}, 목적지: ${destination}`);
    alert(`${tripType} - ${destination} 검색 결과를 준비중입니다.`);
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('mobile-open');
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Deal card click handlers
document.querySelectorAll('.deal-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('h3').textContent;
        alert(`${title} 상품 페이지로 이동합니다.`);
    });
});

// Destination card click handlers
document.querySelectorAll('.destination-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('h3').textContent;
        alert(`${title} 여행 상품을 확인해보세요.`);
    });
});

// Form validation for contact forms (if added)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add loading animation
function showLoading() {
    document.body.classList.add('loading');
}

function hideLoading() {
    document.body.classList.remove('loading');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll('.deal-card, .destination-card, .service-card').forEach(card => {
    observer.observe(card);
});

// Add to favorites functionality (placeholder)
function addToFavorites(productId) {
    // This would typically save to localStorage or send to server
    console.log(`Added product ${productId} to favorites`);
    alert('관심상품에 추가되었습니다.');
}

// Price comparison functionality (placeholder)
function comparePrices(productId) {
    console.log(`Comparing prices for product ${productId}`);
    alert('가격 비교 기능을 준비중입니다.');
}

// Newsletter subscription (placeholder)
function subscribeNewsletter(email) {
    if (!validateEmail(email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return false;
    }
    
    console.log(`Newsletter subscription: ${email}`);
    alert('뉴스레터 구독이 완료되었습니다.');
    return true;
}

// Cookie consent (if needed)
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.querySelector('.cookie-banner')?.remove();
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('TripStore website loaded successfully');
    
    // Add any initialization code here
    hideLoading();
    
    // Check if cookies were already accepted
    if (localStorage.getItem('cookiesAccepted') !== 'true') {
        // Show cookie banner if needed
        // showCookieBanner();
    }
});
