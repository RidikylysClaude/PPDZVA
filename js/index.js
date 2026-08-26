"use strict"

// Открытие попапа по клику на кнопку neworderBtn__text
document.addEventListener('DOMContentLoaded', function() {
    const orderBtn = document.querySelector('.neworderBtn__text');
    orderBtn.addEventListener('click', function(e) {
        e.preventDefault(); // убираем переход по #
        openPopup();
    });
});

// Открытие попапа по клику на кнопку .orderBtn__text
document.addEventListener('DOMContentLoaded', function() {
    const orderBtn = document.querySelector('.orderBtn__text');
    orderBtn.addEventListener('click', function(e) {
        e.preventDefault(); // убираем переход по #
        openPopup();
    });
});
	
function openPopup() {
    document.getElementById('popup').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closePopup() {
    document.getElementById('popup').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Закрытие по клику на затемнение и Escape
document.getElementById('overlay').addEventListener('click', closePopup);
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePopup();
});
