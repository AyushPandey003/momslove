// Service worker registration utility
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

// Check if the app can be installed (PWA)
export function checkInstallable(
  onCanInstall: () => void,
  onCannotInstall: () => void
) {
  let deferredPrompt: BeforeInstallPromptEvent | null = null;

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e as BeforeInstallPromptEvent;
      // Update UI to notify the user they can install the PWA
      onCanInstall();
    });

    window.addEventListener('appinstalled', () => {
      // Log install to analytics
      console.log('PWA was installed');
      // Clear the deferredPrompt
      deferredPrompt = null;
    });

    // If already installed or not installable
    if (window.matchMedia('(display-mode: standalone)').matches) {
      onCannotInstall();
    }
  } else {
    onCannotInstall();
  }

  return {
    // Function to trigger the install prompt
    promptInstall: () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      }
    }
  };
}

// Type definition for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
} 