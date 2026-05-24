// File: /birthday-website/birthday-website/src/js/main.js

// Simple single-page wishes viewer with prev/next navigation
let wishes = [];

document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('load-wishes-btn');
    loadBtn && loadBtn.addEventListener('click', loadWishes);
    loadWishes();
});

function loadWishes() {
    fetch('data/wishes.json')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            wishes = Array.isArray(data) ? data : [];
            renderTinyButtons();
            renderCards();
        })
        .catch(err => {
            console.error('Error loading wishes:', err);
            const container = document.getElementById('wishes-container');
            container.innerHTML = `<p class="error">Could not load wishes.</p>`;
        });
}

function renderTinyButtons() {
    const tb = document.getElementById('tiny-buttons');
    if (!tb) return;
    tb.innerHTML = '';

    const labels = wishes.filter(w => w.category === 'label');
    labels.forEach(lbl => {
        const b = document.createElement('button');
        b.className = 'tiny-btn';
        b.textContent = lbl.text;
        b.addEventListener('click', () => openTarget(lbl.target));
        tb.appendChild(b);
    });
}

function openTarget(targetCategory) {
    // pick a random wish from the target category and flip it open (scroll to it)
    const candidates = wishes.filter(w => w.category === targetCategory);
    if (!candidates.length) return;
    const choice = candidates[Math.floor(Math.random() * candidates.length)];

    // find the corresponding card element and flip it
    const cards = Array.from(document.querySelectorAll('.flip-card'));
    const cardEl = cards.find(c => c.dataset.text === choice.text);
    if (cardEl) {
        cardEl.classList.add('flipped');
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function renderCards() {
    const container = document.getElementById('wishes-container');
    container.innerHTML = '';

    const content = wishes.filter(w => w.category !== 'label');
    content.forEach((w, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flip-card';
        wrapper.tabIndex = 0;
        wrapper.dataset.text = w.text;

        // show an emoji on the front and full message on the back
        wrapper.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="emoji">💌</div>
                </div>
                <div class="flip-card-back">
                    <p class="card-full">${escapeHtml(w.text)}</p>
                </div>
            </div>
        `;

        wrapper.addEventListener('click', () => wrapper.classList.toggle('flipped'));
        wrapper.addEventListener('keypress', (e) => { if (e.key === 'Enter') wrapper.classList.toggle('flipped'); });

        container.appendChild(wrapper);
    });
}

function truncate(s, n) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function escapeHtml(s) {
    return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}