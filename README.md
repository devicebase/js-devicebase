# Devicebase

JavaScript/TypeScript SDK for [DeviceBase](https://github.com/devicebase) — remote Android, HarmonyOS, and iOS device automation via HTTP API.

## Installation

```bash
npm install devicebase
```

## Quick Start

```typescript
import { DeviceBaseClient } from "devicebase";

const client = new DeviceBaseClient({
  apiKey: "your-api-key",
  serial: "device-serial-number",
});

// Get device info
const deviceInfo = await client.getDeviceInfo();

// Take a screenshot
const screenshot = await client.getScreenshot();

// Touch operations
await client.tap(100, 200);
await client.doubleTap(100, 200);
await client.longPress(100, 200);
await client.swipe(100, 500, 100, 100);

// Navigation
await client.back();
await client.home();

// Launch an app
await client.launchApp("com.tencent.mm");

// Text input
await client.inputText("hello world");
await client.clearText();

// Get current foreground app
const appInfo = await client.getCurrentApp();

// Dump UI hierarchy
const hierarchy = await client.dumpHierarchy();
```

## Configuration

```typescript
const client = new DeviceBaseClient({
  serial: "device-serial",       // Required: device serial number
  apiKey: "your-api-key",        // Optional: defaults to DEVICEBASE_API_KEY env var
  baseUrl: "https://api.devicebase.cn",  // Optional: API base URL
  timeout: 30000,                 // Optional: request timeout in ms (default: 30000)
});
```

Environment variables:

- `DEVICEBASE_API_KEY` — JWT API key for authentication
- `DEVICEBASE_BASE_URL` — API base URL (default: `https://api.devicebase.cn`)

## WebSocket Streaming

### Screen Streaming (Minicap)

```typescript
const minicap = client.minicapClient();

for await (const frame of minicap.streamFrames()) {
  // frame is a Buffer containing JPEG image data
  console.log("Frame:", frame.length, "bytes");
}

// Or use the convenience method:
for await (const frame of client.streamMinicap()) {
  console.log("Frame:", frame.length, "bytes");
}
```

### Touch Control (Minitouch)

```typescript
const minitouch = client.minitouchClient();
await minitouch.connect();

// Tap
await minitouch.tap(100, 200);

// Swipe with custom duration and steps
await minitouch.swipe(100, 500, 100, 100, 300, 10);

// Low-level touch events
await minitouch.touchDown(0, 100, 200);
await minitouch.commit();
await minitouch.touchUp(0);
await minitouch.commit();

await minitouch.close();
```

## API Reference

### `DeviceBaseClient`

| Method | Returns | Description |
|--------|---------|-------------|
| `getDeviceInfo()` | `Promise<DeviceInfo>` | Get device status and hardware info |
| `tap(x, y)` | `Promise<OperationResult>` | Single tap at coordinates |
| `doubleTap(x, y)` | `Promise<OperationResult>` | Double tap at coordinates |
| `longPress(x, y)` | `Promise<OperationResult>` | Long press at coordinates |
| `swipe(x1, y1, x2, y2)` | `Promise<OperationResult>` | Swipe gesture |
| `back()` | `Promise<OperationResult>` | Press back button |
| `home()` | `Promise<OperationResult>` | Press home button |
| `launchApp(appName)` | `Promise<OperationResult>` | Launch app by package name |
| `getCurrentApp()` | `Promise<AppInfo>` | Get foreground app info |
| `inputText(text)` | `Promise<OperationResult>` | Type text into focused field |
| `clearText()` | `Promise<OperationResult>` | Clear text in focused field |
| `dumpHierarchy()` | `Promise<HierarchyInfo>` | Get UI element tree |
| `getScreenshot()` | `Promise<ArrayBuffer>` | Screenshot as JPEG bytes |
| `downloadScreenshot()` | `Promise<ArrayBuffer>` | Download screenshot as attachment |
| `minicapClient()` | `MinicapClient` | Create screen streaming WebSocket client |
| `minitouchClient()` | `MinitouchClient` | Create touch control WebSocket client |
| `streamMinicap()` | `AsyncGenerator<Buffer>` | Stream JPEG frames |

## Requirements

- Node.js >= 18.0.0 (native `fetch` and `WebSocket`)

## License

MIT
