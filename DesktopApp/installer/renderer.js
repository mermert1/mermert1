/* eslint-disable @typescript-eslint/no-require-imports */
const { ipcRenderer } = require('electron');

document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.send('close-app');
});

document.getElementById('minimize-btn').addEventListener('click', () => {
  ipcRenderer.send('minimize-app');
});

const actionCards = document.querySelectorAll('.action-card');
let selectedAction = 'install';

actionCards.forEach((card) => {
  card.addEventListener('click', () => {
    actionCards.forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
    selectedAction = card.dataset.action;
  });
});

document.getElementById('next-btn').addEventListener('click', async () => {
  const nextBtn = document.getElementById('next-btn');
  nextBtn.innerText = 'Processing...';
  nextBtn.disabled = true;

  try {
    const result = await ipcRenderer.invoke('perform-action', selectedAction);
    alert(result.message);
    if (result.success && selectedAction === 'install') {
      ipcRenderer.send('close-app');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    nextBtn.innerText = 'Next';
    nextBtn.disabled = false;
  }
});

window.openLink = function (url) {
  ipcRenderer.send('open-link', url);
};
