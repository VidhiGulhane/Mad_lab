let deferredPrompt;  // This variable will hold the deferred prompt for app installation

// Listen for the 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default install prompt from showing
  e.preventDefault();

  // Store the event to trigger the prompt later
  deferredPrompt = e;

  // Create a custom install button
  const installBtn = document.createElement('button');
  installBtn.innerText = 'Install App';
  installBtn.style = 'position: fixed; bottom: 20px; right: 20px; background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer;';
  document.body.appendChild(installBtn);

  // Handle the install button click
  installBtn.addEventListener('click', () => {
    // Show the install prompt when the button is clicked
    deferredPrompt.prompt();

    // Wait for the user to make a choice (accept or dismiss)
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      // Clean up after the prompt
      deferredPrompt = null;
      installBtn.remove();
    });
  });
});

// Optionally, handle the app installation success or failure
window.addEventListener('appinstalled', (event) => {
  console.log('App installed successfully!');
});
