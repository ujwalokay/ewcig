# Building GGCircuit Command Center as a Desktop App

This project is configured to build as a Tauri desktop application.

## Prerequisites

Before building, ensure you have the following installed on your local machine:

### 1. Node.js (v18 or higher)
Download from: https://nodejs.org/

### 2. Rust Toolchain
Install Rust via rustup:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

On Windows, download and run: https://win.rustup.rs/

### 3. Platform-Specific Dependencies

**Windows:**
- WebView2 (comes with Microsoft Edge, usually pre-installed)
- Visual Studio Build Tools with C++ workload

**macOS:**
- Xcode Command Line Tools:
```bash
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

## Building the Desktop App

### 1. Clone/Download the project

Download the project files from Replit to your local machine.

### 2. Install dependencies
```bash
npm install
```

### 3. Development mode (with hot reload)
```bash
npm run tauri:dev
```

### 4. Build for production
```bash
npm run tauri:build
```

The built application will be located in:
- **Windows:** `src-tauri/target/release/bundle/msi/` or `src-tauri/target/release/bundle/nsis/`
- **macOS:** `src-tauri/target/release/bundle/dmg/` or `src-tauri/target/release/bundle/macos/`
- **Linux:** `src-tauri/target/release/bundle/deb/` or `src-tauri/target/release/bundle/appimage/`

## Adding App Icons

Replace the placeholder icons in `src-tauri/icons/` with your own:
- `32x32.png` - 32x32 pixels
- `128x128.png` - 128x128 pixels
- `128x128@2x.png` - 256x256 pixels (for Retina displays)
- `icon.icns` - macOS icon bundle
- `icon.ico` - Windows icon

You can use the Tauri icon generator:
```bash
npx tauri icon path/to/your/icon.png
```

## Notes

- The desktop app runs the frontend only - it does not include the Express backend server
- For a fully functional app with backend, you would need to either:
  1. Host the backend separately and update API URLs
  2. Embed the backend using Tauri's sidecar feature
  3. Convert backend logic to Tauri commands (Rust)

## Troubleshooting

**"Cannot find module" errors:**
```bash
npm install
```

**Rust compilation errors:**
```bash
rustup update
```

**WebView2 missing on Windows:**
Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
