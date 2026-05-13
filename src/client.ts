import {
  AuthenticationError,
  DeviceBaseHttpClient,
} from "./http-client.js";
import type {
  AppInfo,
  DeviceInfo,
  HierarchyInfo,
  OperationResult,
} from "./models.js";
import { MinicapClient, MinitouchClient } from "./websocket-client.js";

export interface DeviceBaseClientConfig {
  serial: string;
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}

export class DeviceBaseClient {
  private readonly serial: string;
  private readonly http: DeviceBaseHttpClient;
  private readonly _baseUrl: string;
  private readonly _apiKey: string;

  constructor(config: DeviceBaseClientConfig) {
    const apiKey = config.apiKey ?? process.env.DEVICEBASE_API_KEY;
    if (!apiKey) {
      throw new AuthenticationError(
        "API key is required. Provide it via 'apiKey' config or DEVICEBASE_API_KEY environment variable."
      );
    }
    const baseUrl =
      config.baseUrl ?? process.env.DEVICEBASE_BASE_URL ?? "https://api.devicebase.cn";

    this.serial = config.serial;
    this._baseUrl = baseUrl;
    this._apiKey = apiKey;
    this.http = new DeviceBaseHttpClient({
      baseUrl,
      apiKey,
      timeout: config.timeout,
    });
  }

  // Device Info

  async getDeviceInfo(): Promise<DeviceInfo> {
    return this.http.getDeviceInfo(this.serial);
  }

  // Touch Operations

  async tap(x: number, y: number): Promise<OperationResult> {
    return this.http.tap(this.serial, { x, y });
  }

  async doubleTap(x: number, y: number): Promise<OperationResult> {
    return this.http.doubleTap(this.serial, { x, y });
  }

  async longPress(x: number, y: number): Promise<OperationResult> {
    return this.http.longPress(this.serial, { x, y });
  }

  async swipe(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): Promise<OperationResult> {
    return this.http.swipe(this.serial, { x1, y1, x2, y2 });
  }

  // Navigation

  async back(): Promise<OperationResult> {
    return this.http.back(this.serial);
  }

  async home(): Promise<OperationResult> {
    return this.http.home(this.serial);
  }

  // App Operations

  async launchApp(appName: string): Promise<OperationResult> {
    return this.http.launchApp(this.serial, appName);
  }

  async getCurrentApp(): Promise<AppInfo> {
    return this.http.getCurrentApp(this.serial);
  }

  // Text Input

  async inputText(text: string): Promise<OperationResult> {
    return this.http.inputText(this.serial, text);
  }

  async clearText(): Promise<OperationResult> {
    return this.http.clearText(this.serial);
  }

  // UI Hierarchy

  async dumpHierarchy(): Promise<HierarchyInfo> {
    return this.http.dumpHierarchy(this.serial);
  }

  // Screenshots

  async getScreenshot(): Promise<ArrayBuffer> {
    return this.http.getScreenshot(this.serial);
  }

  async downloadScreenshot(): Promise<ArrayBuffer> {
    return this.http.downloadScreenshot(this.serial);
  }

  // WebSocket Clients

  minicapClient(): MinicapClient {
    return new MinicapClient({
      baseUrl: this._baseUrl,
      serial: this.serial,
      apiKey: this._apiKey,
    });
  }

  minitouchClient(): MinitouchClient {
    return new MinitouchClient({
      baseUrl: this._baseUrl,
      serial: this.serial,
      apiKey: this._apiKey,
    });
  }

  async *streamMinicap(): AsyncGenerator<Buffer> {
    const client = this.minicapClient();
    yield* client.streamFrames();
  }
}
