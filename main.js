import { Octokit } from "https://cdn.skypack.dev/@octokit/core@7.0.6";

const octokit = new Octokit();

async function fetchActivity() {
    const username = document.getElementById("username").value.trim();
    const output = document.getElementById("output");

    if (!username) {
        output.textContent = "Please enter a username";
        return;
    }

    output.textContent = "Loading...";
    let data;
    try {
        const response = await octokit.request(
            "GET /users/{username}/events/public",
            { username }
        );
        data = response.data;
        const processedData = [];
        for(const event of data) {
            processedData.push({
                type: event.type,
                repo: event.repo.name,  
        });
        }
        output.innerHTML = `<pre>${JSON.stringify(processedData, null, 2)}</pre>`;
    } catch (error) {
        if (error.status === 404) {
            output.textContent = `Error: User "${username}" not found.`;
        } else if (error.status === 403) {
            output.textContent = "Error: API rate limit exceeded.";
        } else {
            output.textContent = `Error: ${error.message}`;
        }
    }
}

// expose function to button
window.fetchActivity = fetchActivity;
