export { DeviceBaseClient } from './client.js'
export type { DeviceBaseClientConfig } from './client.js'

export {
  AuthenticationError,
  DeviceBaseError,
  DeviceBaseHttpClient,
  DeviceNotFoundError,
  ValidationError,
} from './http-client.js'
export type { HttpClientConfig } from './http-client.js'

export type {
  AppInfo,
  Bounds,
  DeviceInfo,
  HierarchyInfo,
  InputTextRequest,
  LaunchAppRequest,
  OperationResult,
  Point,
} from './models.js'

export {
  createAppInfo,
  createBounds,
  createDeviceInfo,
  createHierarchyInfo,
  createInputTextRequest,
  createLaunchAppRequest,
  createOperationResult,
  createPoint,
} from './models.js'

export { VERSION } from './version.js'
export { MinicapClient, MinitouchClient } from './websocket-client.js'

export type { WebSocketClientConfig } from './websocket-client.js'
