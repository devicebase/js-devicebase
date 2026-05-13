export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Bounds {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export interface DeviceInfo {
  readonly serial: string;
  readonly data: Record<string, unknown>;
}

export interface AppInfo {
  readonly data: Record<string, unknown>;
}

export interface HierarchyInfo {
  readonly data: Record<string, unknown>;
}

export interface OperationResult {
  readonly success: boolean;
  readonly data: Record<string, unknown>;
}

export interface LaunchAppRequest {
  readonly app_name: string;
}

export interface InputTextRequest {
  readonly text: string;
}

export function createPoint(x: number, y: number): Point {
  return Object.freeze({ x, y });
}

export function createBounds(x1: number, y1: number, x2: number, y2: number): Bounds {
  return Object.freeze({ x1, y1, x2, y2 });
}

export function createDeviceInfo(serial: string, data: Record<string, unknown>): DeviceInfo {
  return Object.freeze({ serial, data });
}

export function createAppInfo(data: Record<string, unknown>): AppInfo {
  return Object.freeze({ data });
}

export function createHierarchyInfo(data: Record<string, unknown>): HierarchyInfo {
  return Object.freeze({ data });
}

export function createOperationResult(data: Record<string, unknown>): OperationResult {
  const success = typeof data.success === "boolean" ? data.success : true;
  return Object.freeze({ success, data });
}

export function createLaunchAppRequest(app_name: string): LaunchAppRequest {
  return Object.freeze({ app_name });
}

export function createInputTextRequest(text: string): InputTextRequest {
  return Object.freeze({ text });
}
