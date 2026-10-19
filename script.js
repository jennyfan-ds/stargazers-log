const list = document.querySelector("#starred");
const status = document.querySelector("#status");

function updateStatus(message) {
  if (status) {
    status.textContent = message;
  }
}

if (!list) {
  throw new Error("The #starred list element is missing from the page.");
}

updateStatus("Loading starred repositories...");

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch events.json (${response.status})`);
    }

    return response.json();
  })
  .then((events) => {
    if (!Array.isArray(events)) {
      throw new TypeError("The JSON data is not an array.");
    }

    list.innerHTML = "";

    if (events.length === 0) {
      const item = document.createElement("li");
      item.textContent = "No starred repositories yet.";
      list.appendChild(item);
      updateStatus("No starred repositories yet.");
      return;
    }

    events.forEach((event) => {
      if (!event || typeof event.name !== "string" || typeof event.starred !== "string") {
        return;
      }

      const item = document.createElement("li");
      item.textContent = `${event.name} - starred ${event.starred}`;
      list.appendChild(item);
    });

    updateStatus(`Loaded ${events.length} starred repositories.`);
  })
  .catch((error) => {
    console.error("Unable to load starred repositories:", error);
    list.innerHTML = "<li>Unable to load starred repositories.</li>";
    updateStatus("Unable to load starred repositories.");
  });