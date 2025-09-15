// initServiceWorker.js

export default function initServiceWorker() {
  console.log('Initializing service worker...');

  if ('serviceWorker' in navigator) {
    const sw = navigator.serviceWorker?.controller;
    console.log('Service Worker State Data : ', sw);
    if (sw?.state !== 'activated') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/custom-sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);

            // If there's no controller, this page wasn't loaded via a service worker, so they're looking at the latest version.
            // In that case, exit early.
            if (!navigator.serviceWorker.controller) {
              console.log('This page is not controlled by a Service Worker.');
              return;
            }

            // If there's an updated worker already waiting, notify the user.
            if (registration.waiting) {
              console.log('A new Service Worker version is waiting to activate.');
              // You could prompt the user to update, or just automatically update:
              // registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              return;
            }

            // If there's an updated worker installing, track its progress.
            // If it becomes "installed", notify the user.
            if (registration.installing) {
              const installingWorker = registration.installing;
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  console.log('A new Service Worker version has been installed.');
                  // You could prompt the user to update, or just automatically update:
                  // installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              };
              return;
            }
            

            // Otherwise, listen for new installing workers arriving.
            // If one arrives, track its progress.
            // If it becomes "installed", notify the user.
            registration.addEventListener('updatefound', () => {
              const newInstallingWorker = registration.installing;
              newInstallingWorker.onstatechange = () => {
                if (newInstallingWorker.state === 'installed') {
                  console.log('A new Service Worker version has been installed.');
                  // You could prompt the user to update, or just automatically update:
                  // newInstallingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              };
            });
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
    else{
    console.log('Service Worker already installed and activated')
  }
} 
else {
    console.log('Service Workers are not supported in this browser.');
  }
}