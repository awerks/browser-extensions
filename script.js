document.addEventListener("DOMContentLoaded", async function () {
    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    document.documentElement.setAttribute("data-theme", initialTheme);
    themeToggle.classList.toggle("dark", initialTheme === "dark");
    themeToggle.setAttribute("aria-pressed", initialTheme === "dark");
    themeToggle.setAttribute(
        "aria-label",
        initialTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );

    // theme toggle handler
    themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);

        themeToggle.classList.toggle("dark", next === "dark");
        themeToggle.setAttribute("aria-pressed", next === "dark");
        themeToggle.setAttribute(
            "aria-label",
            next === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
        themeToggle.classList.toggle("animate");
        themeToggle.addEventListener("animationend", () => {
            themeToggle.classList.remove("animate");
        });
    });
    const statusButtons = document.querySelectorAll(".status-buttons button");
    statusButtons.forEach((button) => {

        button.addEventListener('click', () => {
            statusButtons.forEach((button) => button.classList.remove('active'));
            button.classList.toggle('active');
        })
    }
    );
    const statusAllButton = document.getElementById('status-all');
    const statusActiveButton = document.getElementById('status-active');
    const statusInactiveButton = document.getElementById('status-inactive');


    statusAllButton.addEventListener('click', () => {
        const allCards = document.querySelectorAll('.extension-card');
        allCards.forEach(card => card.style.display = 'block');
    }
    );
    statusActiveButton.addEventListener('click', () => {
        const allCards = document.querySelectorAll('.extension-card');
        allCards.forEach(card => {
            if (card.querySelector('input[type="checkbox"]').checked) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    );
    statusInactiveButton.addEventListener('click', () => {
        const allCards = document.querySelectorAll('.extension-card');
        allCards.forEach(card => {
            if (!card.querySelector('input[type="checkbox"]').checked) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    );

    await fetchAndDisplayData();
});
async function fetchAndDisplayData() {
    const data = await fetch("data.json");
    const jsonData = await data.json();
    const grid = document.getElementById("grid");
    for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        const div = document.createElement("div");
        div.className = "extension-card";
        div.innerHTML = `
            <div class='card__header'>
                <div class='card__icon'>
                    <img width='60' height='60' src="${item.logo}" alt="${item.name}">
                </div>
                <div class='card__content'>
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                </div>
            </div>
            <div class='card__buttons flex flex-space-between align-items-center'>
                <button onclick='removeExtensionCard(event)' class='btn remove-btn'>Remove</button>
                <label class="switch">
                    <input type="checkbox" ${item.isActive ? 'checked' : ''} />
                    <span class="slider round"></span>
                </label>
            </div>
        `;
        grid.appendChild(div);
    }
}
function removeExtensionCard(event) {
    const card = event.target.closest('.extension-card');
    card.remove();
    const grid = document.getElementById("grid");
    if (grid.children.length === 0) {
        const noDataMessage = document.createElement("div");
        noDataMessage.className = "no-data-message";
        noDataMessage.innerHTML = "<p>No extensions installed.</p>";
        grid.appendChild(noDataMessage);
    }

}