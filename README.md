# The Unmoored City

A static site for a D&D one-shot, served with GitHub Pages.

- `index.html`: front page.
- `players/`: the public Player Guide.
- `dm/`: the DM manual, stored encrypted (AES-GCM, key derived from a passphrase with PBKDF2) and decrypted in the browser. Nothing on the server can read it without the passphrase.

The site is generated from the private design repository; do not edit these files by hand. To change the DM passphrase, regenerate `dm/index.html` with the encryption script in that repository.

This site includes material from the System Reference Document 5.2.1 by Wizards of the Coast LLC, licensed under CC BY 4.0.
