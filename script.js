const themeToggle = document.getElementById('toggle');

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
    document.documentElement.setAttribute("data-theme", "🌑");
    }
    else {
        document.documentElement.setAttribute("data-theme", "☀️");
    }
});