# GGCircuit Launcher - Tauri Desktop App

A desktop client launcher for gaming cafes built with Tauri + React.

## Prerequisites

Before building, ensure you have the following installed on your Windows PC:

1. **Node.js** (v18 or later) - https://nodejs.org/
2. **Rust** (latest stable) - https://rustup.rs/
3. **Microsoft Visual Studio C++ Build Tools** - Required for Windows builds

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Terminal

Copy `.env.example` to `.env` and set your terminal configuration:

```bash
TERMINAL_ID=PC-01
TERMINAL_NAME=Gaming PC 1
SERVER_URL=http://192.168.1.100:5000
```

### 3. Development Mode

```bash
npm run tauri dev
```

### 4. Build Installer

```bash
npm run tauri build
```

The installer will be created in `src-tauri/target/release/bundle/`

## Building for Multiple PCs

To create installers for different terminals (PC 1-10):

1. Update the `.env` file with the terminal ID
2. Run `npm run tauri build`
3. The installer will be created with the terminal's configuration baked in
4. Repeat for each PC

### Example for PC 1:
```env
TERMINAL_ID=PC-01
TERMINAL_NAME=Gaming PC 1
SERVER_URL=http://YOUR_SERVER_IP:5000
```

### Example for PC 5:
```env
TERMINAL_ID=PC-05
TERMINAL_NAME=Gaming PC 5
SERVER_URL=http://YOUR_SERVER_IP:5000
```

## Server Configuration

Make sure your server (the web management panel) is running and accessible from all client PCs.

The launcher connects to these API endpoints:
- `GET /api/terminals/:id/session` - Check session status
- `POST /api/activity-logs` - Log terminal activity
- `POST /api/orders` - Place food/drink orders

## Features

- Full-screen kiosk mode
- Game launching
- Food & drink ordering
- Session time tracking
- Balance display
- Terminal lock/unlock
- Activity logging

## Troubleshooting

### Build fails with Rust errors
Make sure you have the latest Rust installed:
```bash
rustup update
```

### Launcher can't connect to server
1. Check that SERVER_URL in .env is correct
2. Ensure the server is running and accessible
3. Check firewall settings

### Games won't launch
Verify the game paths in `src/App.tsx` match your installed games.

## License

MIT
