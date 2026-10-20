// The one place the API's URL is written.
const API_BASE = "http://localhost:3000/api/v1";

// The shop shows prices in US dollars with two decimals.
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const statusEl    = document.getElementById("services-status");
const tableEl     = document.getElementById("services-table");
const bodyEl      = document.getElementById("services-body");
const lookupForm  = document.getElementById("lookup-form");
const lookupInput = document.getElementById("service-id");
const lookupResult = document.getElementById("lookup-result");

// Build one row from a service document, entirely with the DOM. Everything is
// written as text (textContent), so a name like "<b>Tune-up</b>" keeps its
// angle brackets and nothing from the API is ever parsed as HTML.
function serviceRow(service) {
  const row = document.createElement("tr");

  const name = document.createElement("td");
  name.textContent = service.name;

  const price = document.createElement("td");
  price.textContent = money.format(Number(service.price));

  const charged = document.createElement("td");
  charged.textContent = service.times_charged;

  row.append(name, price, charged);
  return row;
}

// Load the whole price list when the page opens.
async function loadServices() {
  statusEl.hidden = false;
  statusEl.textContent = "Loading the price list…";
  tableEl.hidden = true;

  try {
    const response = await fetch(`${API_BASE}/services`);

    // A response that is not 2xx is not an exception — we check it ourselves.
    if (!response.ok) {
      const body = await response.json();
      statusEl.textContent = body.errors.join(" ");
      return;
    }

    const services = await response.json();
    bodyEl.replaceChildren();
    for (const service of services) {
      bodyEl.append(serviceRow(service));
    }

    statusEl.hidden = true;   // the answer arrived, the message goes away
    tableEl.hidden = false;
  } catch (error) {
    // The server is down or the network is gone: one sentence, page intact.
    statusEl.hidden = false;
    statusEl.textContent = "The price list is not available right now — is the Wheelhouse API running on port 3000?";
  }
}

// Look up a single service by the id the person typed.
async function lookupService(id) {
  lookupResult.textContent = "Looking up…";

  try {
    const response = await fetch(`${API_BASE}/services/${encodeURIComponent(id)}`);
    const body = await response.json();

    if (!response.ok) {
      // An id that does not exist shows the message of the 404, from errors.
      lookupResult.textContent = body.errors.join(" ");
      return;
    }

    lookupResult.textContent =
      `${body.name} — ${money.format(Number(body.price))}, charged on ${body.times_charged} repair(s).`;
  } catch (error) {
    lookupResult.textContent = "Could not reach the API — is it running on port 3000?";
  }
}

lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = lookupInput.value.trim();
  if (id === "") {
    lookupResult.textContent = "Type a service id first.";
    return;
  }
  lookupService(id);
});

loadServices();
