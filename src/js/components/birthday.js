function fetchWishes() {
    return fetch('../data/wishes.json')
        .then(response => response.json())
        .catch(error => console.error('Error fetching wishes:', error));
}

function displayWishes(wishes) {
    const wishesContainer = document.getElementById('wishes-container');
    wishesContainer.innerHTML = '';

    wishes.forEach(wish => {
        const wishElement = document.createElement('div');
        wishElement.classList.add('wish');
        wishElement.innerHTML = `<p>${wish.message}</p><p><em>- ${wish.author}</em></p>`;
        wishesContainer.appendChild(wishElement);
    });
}

export function loadBirthdayWishes() {
    fetchWishes().then(wishes => {
        displayWishes(wishes);
    });
}