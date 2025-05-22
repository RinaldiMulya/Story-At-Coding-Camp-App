
import '../styles/styles.css';

import App from './pages/app';

//script/index.js
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('load', () => app.renderPage());
  window.addEventListener('hashchange', () => app.renderPage());
});
