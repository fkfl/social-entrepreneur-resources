async function fetchContent(category) {
    const response = await fetch(`/api/content?category=${category}`);
    const content = await response.json();
    return content;
}

function renderContent(content, container) {
    container.innerHTML = "";
    content.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <span class="timestamp">Published: ${new Date(item.timestamp).toLocaleString()}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${item.source_url}" target="_blank">Read More</a>
        `;
        container.appendChild(div);
    });
}

async function populateContent(sectionId, category) {
    const container = document.getElementById(`${sectionId}-content`);
    const content = await fetchContent(category);
    renderContent(content, container);
}
