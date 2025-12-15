const searchInput = document.getElementById("gameSearch");
const games = document.querySelectorAll(".games-grid .game");

searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();

    games.forEach(game => {
        const name = game.getAttribute("data-name") || "";
        const nameSpan = game.querySelector(".game-name");

        if (name.toLowerCase().includes(filter)) {
            game.style.display = "block";

            // Highlight matched part
            const regex = new RegExp(`(${filter})`, "gi");
            nameSpan.innerHTML = name.replace(regex, `<span class="highlight">$1</span>`);
        } else {
            game.style.display = "none";
        }

        // Reset highlight if search is empty
        if (filter === "") {
            nameSpan.innerHTML = name;
        }
    });
});
