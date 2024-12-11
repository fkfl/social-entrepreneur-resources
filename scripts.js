from flask_cors import CORS
CORS(app)

async function fetchContent() {
    const response = await fetch('http://127.0.0.1:5000/api/content');
    const data = await response.json();
    const container = document.getElementById('content-container');
    container.innerHTML = '';

    data.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><a href="${item.source_url}" target="_blank">Read More</a></p>
        `;
        container.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', fetchContent);
