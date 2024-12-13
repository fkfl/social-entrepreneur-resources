// Ensure config.js is loaded for the API_URL
console.log("API_URL from config.js:", API_URL);
console.log("Main.js loaded. Checking API_URL...");
if (typeof API_URL === 'undefined') {
    console.error("API_URL is not defined. Check config.js loading and script order.");
} else {
    console.log("API_URL is accessible:", API_URL);
}

fetch(API_URL)
  .then(response => {
    console.log("Raw fetch response:", response);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    console.log("Content-Type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
    }

    return response.json();
  })
  .then(data => console.log("Fetched data:", data))
  .catch(error => console.error("Fetch error:", error));

  async function fetchContent() {
    try {
        console.log("Attempting to fetch data from API_URL:", API_URL);

        const response = await fetch(API_URL);
        console.log("Fetch response object:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        console.log("Content-Type header:", contentType);

        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON");
        }

        const data = await response.json();
        console.log("Fetched JSON data:", data);

        const container = document.getElementById("content-container");
        container.innerHTML = ""; // Clear old content

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
