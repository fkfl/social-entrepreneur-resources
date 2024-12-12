// Ensure config.js is loaded for the API_URL
console.log("API URL:", API_URL);

async function fetchContent() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const container = document.getElementById("content-container");
        container.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><a href="${item.source_url}" target="_blank">Read More</a></p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching content:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchContent);
