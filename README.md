# Cypher Password Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Cypher is a secure, open-source password manager that prioritizes your privacy by performing all encryption and decryption operations directly on your device. Your sensitive data never leaves your computer in an unencrypted form.

## Security Features

- **256-bit AES Encryption**: Military-grade encryption for all stored credentials
- **PBKDF2 Key Derivation**: Protects against brute-force attacks by making password hashing computationally intensive
- **SHA-256 Hashing**: Ensures data integrity and secure password verification
- **Zero-Knowledge Architecture**: Your data is encrypted before it reaches our servers
- **Client-Side Operations**: All encryption/decryption happens locally on your device
- **No Plaintext Storage**: Sensitive data is never stored in readable form

## How It Works

1. **Master Password**: Users create a strong master password that never leaves their device
2. **Key Derivation**: PBKDF2 generates an encryption key from the master password
3. **Local Encryption**: Passwords and sensitive data are encrypted using AES-256
4. **Secure Storage**: Only encrypted data is synchronized with our servers
5. **Local Decryption**: Data is decrypted on-demand using your master password

## Features

- **Cross-Platform Support**: Available for Windows, macOS, and Linux
- **Browser Extensions**: Seamless integration with major browsers
- **Secure Password Generator**: Create strong, unique passwords
- **Two-Factor Authentication**: Additional security layer for vault access

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## Privacy Policy

- We never store unencrypted user data
- We cannot access your passwords or master password
- We cannot reset your master password

## License

Cypher is released under the MIT License. See the [LICENSE](LICENSE) file for details.
