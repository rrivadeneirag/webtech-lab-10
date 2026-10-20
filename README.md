# webtech-lab-10 — personal page

My personal page, published on GitHub Pages. It includes a **Wheelhouse — Services &
Prices** section that reads the live price list from the Wheelhouse JSON API with
`fetch` and builds the table in the browser from the returned documents.

**Published page:** https://rrivadeneirag.github.io/webtech-lab-10/

## How it works

- `index.html` holds the page structure. The table rows are **not** in the HTML —
  they are created in the browser by `app.js` from the API's response.
- `app.js` reads `GET /api/v1/services` (and `GET /api/v1/services/:id` for the
  look-up control), with `async`/`await`. The API's URL is a single constant at the
  top of the file. Everything is written into the page as text (`textContent`), so a
  service named `<b>Tune-up</b>` shows its angle brackets.
- It handles the loading state, a network/server failure (one sentence, page intact),
  and an API error (the messages from the `errors` list).

## Seeing it work

The price list comes from the Wheelhouse Rails API, which must be running locally on
**port 3000** (see the [webtech-wheelhouse](https://github.com/rrivadeneirag/webtech-wheelhouse)
README). The API's CORS rule allows this page's origin.

To run this page locally during development, serve it on port 8000 (the other origin
the API allows) — a page opened straight from the file system has no origin:

```bash
cd webtech-lab-10
python3 -m http.server 8000
# then open http://localhost:8000
```
