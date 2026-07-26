# Hip Hop Name Generator

A small React app that illustrates **accessibility (a11y) issues** in a fun, before-and-after way.

On the surface it generates a playful hip-hop stage name from your real name. Underneath, it is a teaching and portfolio demo: you can flip between an intentionally flawed UI and an improved, accessible version of the same flow, and see how markup, keyboard behaviour, labels, contrast, and announcements change.

It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Before-and-after comparison

Use the **Demo comparison** control at the top of the page (or the URL) to switch modes without a reload:

- **After accessibility** (default) — the current accessible implementation
- **Before accessibility** — reconstructed from Git history immediately before the accessibility improvements were merged

The “before” mode is meant to show common a11y pitfalls (missing labels, bad heading order, non-semantic links, poor contrast, and so on) against the fixed “after” experience—not as a production preference.

### Historical source

- Merge commit: `8e7d343` (*Merge pull request #3 … feature/accessibility-improvements*)
- Pre-merge commit (merge first parent): `8a47751`
- Reconstructed from files changed in that merge: `public/index.html`, `src/App.js`, `src/NameForm.js`, `src/styles.css`

Document-level attributes (`lang`, `<title>`) stay accessible in `public/index.html` and are temporarily adjusted in the browser when **Before** is selected.

### How to activate each mode

- Use the **Demo comparison** radio group at the top of the page, or
- Open a shareable URL:
  - After: `/?accessibility=after` (or omit the param)
  - Before: `/?accessibility=before`

Invalid or missing values fall back to **after**. The choice is stored in the query string (no full page reload).

### What the comparison covers

Heading structure, link semantics, image `alt`, form labels, `tabIndex` misuse, option/button text, API error announcement (`role="alert"`), link contrast, and document `lang` / title.

Shared across both modes: OpenAI name generation, app state, and unrelated business logic.

### Removing the comparison later

Delete `src/accessibility-comparison/`, point `App.js` back at a single UI (the `after` components), restore a simple `NameForm` export, and drop this section from the README.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
