/* scripts.js */

// Example placeholder data with timestamps
const data = {
    feeds: [
        { title: "Latest Regulatory Updates", description: "Recent changes in social enterprise laws in Hong Kong.", timestamp: "2024-12-01T10:00:00Z" },
        { title: "Impact Measurement Tools", description: "Learn about the best tools for measuring social impact.", timestamp: "2024-11-30T15:30:00Z" }
    ],
    funding: [
        { title: "SIE Fund Grant", description: "Government funding for social enterprises.", timestamp: "2024-11-25T12:00:00Z" },
        { title: "HKEX Foundation", description: "Support for scaling impactful ventures.", timestamp: "2024-11-28T14:00:00Z" }
    ],
    events: [
        { title: "Social Enterprise Summit 2024", description: "Join the annual gathering of social entrepreneurs.", timestamp: "2024-12-05T09:00:00Z" },
        { title: "Funding Workshop", description: "Learn how to pitch your social enterprise for funding.", timestamp: "2024-12-10T16:00:00Z" }
    ],
    projects: [
        { title: "EcoCare Initiative", description: "A sustainability-focused social enterprise in Hong Kong.", timestamp: "2024-11-20T08:00:00Z" },
        { title: "Youth Empowerment Project", description: "Empowering youth through education and training.", timestamp: "2024-11-22T10:00:00Z" }
    ],
    resources: [
        { title: "Funding Application Guide", description: "Step-by-step instructions for applying for grants.", timestamp: "2024-11-15T11:00:00Z" },
        { title: "Legal Templates", description: "Download templates for contracts and agreements.", timestamp: "2024-11-18T13:00:00Z" }
    ]
};

// Format timestamp into readable date and time
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
}

// Populate section dynamically based on page
function populateContent(sectionId, contentType) {
    const section = document.getElementById(`${sectionId}-content`);
    if (!section || !data[contentType]) return;

    data[contentType].forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <span class="timestamp">Published: ${formatTimestamp(item.timestamp)}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        `;
        section.appendChild(div);
    });
}

// Identify current page and populate relevant content
const currentPage = window.location.pathname.split('/').pop();
switch (currentPage) {
    case 'feeds.html':
        populateContent('feeds', 'feeds');
        break;
    case 'funding.html':
        populateContent('funding', 'funding');
        break;
    case 'events.html':
        populateContent('events', 'events');
        break;
    case 'projects.html':
        populateContent('projects', 'projects');
        break;
    case 'resources.html':
        populateContent('resources', 'resources');
        break;
    default:
        console.error("No dynamic content for this page.");
}

// Search functionality
function searchContent(query) {
    const results = [];
    Object.keys(data).forEach(section => {
        data[section].forEach(item => {
            if (item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) {
                results.push(item);
            }
        });
    });
    return results;
}

// Display search results
function displaySearchResults(query) {
    const resultsSection = document.getElementById('search-results');
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = '';
    const results = searchContent(query);
    if (results.length > 0) {
        resultsSection.classList.remove('hidden');
        results.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <span class="timestamp">Published: ${formatTimestamp(item.timestamp)}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            resultsContent.appendChild(div);
        });
    } else {
        resultsSection.classList.add('hidden');
    }
}

// Event listener for search bar
document.getElementById('search-bar').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    if (query) {
        displaySearchResults(query);
    } else {
        document.getElementById('search-results').classList.add('hidden');
    }
});

// Populate all sections
populateSection('feeds', data.feeds);
populateSection('funding', data.funding);
populateSection('events', data.events);
populateSection('projects', data.projects);
populateSection('resources', data.resources);
