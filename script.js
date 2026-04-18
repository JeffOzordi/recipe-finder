const themeSwitch = document.getElementById('theme-switch');

themeSwitch.addEventListener('click', function () {
    this.classList.remove('fa-sun');
    this.classList.add('fa-moon');

    setTimeout(() => {
        this.classList.remove('fa-moon');
        this.classList.add('fa-sun');
        this.style.color = '';
    }, 1500);
});