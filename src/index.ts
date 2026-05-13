export { DeviceBaseClient } from "./client.js";
export type { DeviceBaseClientConfig } from "./client.js";

export {
  DeviceBaseError,
  DeviceNotFoundError,
  ValidationError,
  AuthenticationError,
  DeviceBaseHttpClient,
} from "./http-client.js";
export type { HttpClientConfig } from "./http-client.js";

export type {
  Point,
  Bounds,
  DeviceInfo,
  AppInfo,
  HierarchyInfo,
  OperationResult,
  LaunchAppRequest,
  InputTextRequest,
} from "./models.js";

export {
  createPoint,
  createBounds,
  createDeviceInfo,
  createAppInfo,
  createHierarchyInfo,
  createOperationResult,
  createLaunchAppRequest,
  createInputTextRequest,
} from "./models.js";

export { MinicapClient, MinitouchClient } from "./websocket-client.js";
export type { WebSocketClientConfig } from "./websocket-client.js";

export { VERSION } from "./version.js";
