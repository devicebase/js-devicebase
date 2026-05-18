import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AuthenticationError,
  DeviceBaseError,
  DeviceBaseHttpClient,
  DeviceNotFoundError,
  ValidationError,
} from '../src/http-client.js'

const API_KEY = 'test-api-key'
const BASE_URL = 'http://localhost:9999'

describe('deviceBaseHttpClient', () => {
  describe('constructor', () => {
    it('throws AuthenticationError when no API key provided', () => {
      const orig = process.env.DEVICEBASE_API_KEY
      delete process.env.DEVICEBASE_API_KEY
      expect(() => new DeviceBaseHttpClient({ baseUrl: BASE_URL })).toThrow(AuthenticationError)
      process.env.DEVICEBASE_API_KEY = orig
    })

    it('reads API key from environment variable', () => {
      const orig = process.env.DEVICEBASE_API_KEY
      process.env.DEVICEBASE_API_KEY = 'env-key'
      const client = new DeviceBaseHttpClient({ baseUrl: BASE_URL })
      expect(client).toBeDefined()
      process.env.DEVICEBASE_API_KEY = orig
    })
  })

  describe('error handling', () => {
    it('throws DeviceNotFoundError on 404', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Not found',
      })

      const client = new DeviceBaseHttpClient({ baseUrl: BASE_URL, apiKey: API_KEY })
      await expect(client.getDeviceInfo('serial')).rejects.toThrow(DeviceNotFoundError)
    })

    it('throws ValidationError on 422', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        text: async () => 'Invalid',
      })

      const client = new DeviceBaseHttpClient({ baseUrl: BASE_URL, apiKey: API_KEY })
      await expect(client.getDeviceInfo('serial')).rejects.toThrow(ValidationError)
    })

    it('throws AuthenticationError on 401', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Unauthorized',
      })

      const client = new DeviceBaseHttpClient({ baseUrl: BASE_URL, apiKey: API_KEY })
      await expect(client.getDeviceInfo('serial')).rejects.toThrow(AuthenticationError)
    })

    it('throws DeviceBaseError on 500', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Error',
      })

      const client = new DeviceBaseHttpClient({ baseUrl: BASE_URL, apiKey: API_KEY })
      await expect(client.getDeviceInfo('serial')).rejects.toThrow(DeviceBaseError)
    })
  })

  describe('aPI methods', () => {
    let client: DeviceBaseHttpClient

    beforeEach(() => {
      client = new DeviceBaseHttpClient({ baseUrl: BASE_URL, apiKey: API_KEY })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('getDeviceInfo sends POST to /v1/deviceinfo/{serial}', async () => {
      const mockData = { model: 'Pixel 7', os: 'Android 14' }
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      })

      const result = await client.getDeviceInfo('device123')
      expect(result.serial).toBe('device123')
      expect(result.data).toEqual(mockData)
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/deviceinfo/device123`,
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('tap sends POST to /v1/tap/{serial}', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      const result = await client.tap('device123', { x: 100, y: 200 })
      expect(result.success).toBe(true)
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/tap/device123`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ x: 100, y: 200 }),
        }),
      )
    })

    it('swipe sends correct bounds', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      await client.swipe('device123', { x1: 0, y1: 100, x2: 300, y2: 100 })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/swipe/device123`,
        expect.objectContaining({
          body: JSON.stringify({ x1: 0, y1: 100, x2: 300, y2: 100 }),
        }),
      )
    })

    it('launchApp sends app_name in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      await client.launchApp('device123', 'com.tencent.mm')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/launch_app/device123`,
        expect.objectContaining({
          body: JSON.stringify({ app_name: 'com.tencent.mm' }),
        }),
      )
    })

    it('inputText sends text in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      await client.inputText('device123', 'hello world')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/input/device123`,
        expect.objectContaining({
          body: JSON.stringify({ text: 'hello world' }),
        }),
      )
    })

    it('back sends POST to /v1/back/{serial}', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      await client.back('device123')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/back/device123`,
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('home sends POST to /v1/home/{serial}', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      await client.home('device123')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/home/device123`,
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('clearText sends POST to /v1/clear_text/{serial}', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      await client.clearText('device123')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/clear_text/device123`,
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('getCurrentApp returns AppInfo', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ name: 'com.tencent.mm' }),
      })

      const result = await client.getCurrentApp('device123')
      expect(result.data).toEqual({ name: 'com.tencent.mm' })
    })

    it('dumpHierarchy returns HierarchyInfo', async () => {
      const hierarchy = { nodes: [{ id: 1 }] }
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(hierarchy),
      })

      const result = await client.dumpHierarchy('device123')
      expect(result.data).toEqual(hierarchy)
    })

    it('getScreenshot returns ArrayBuffer', async () => {
      const fakeImage = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]).buffer
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        arrayBuffer: async () => fakeImage,
      })

      const result = await client.getScreenshot('device123')
      expect(result).toBeInstanceOf(ArrayBuffer)
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/screen/device123`,
        expect.objectContaining({ method: 'GET' }),
      )
    })

    it('downloadScreenshot calls correct endpoint', async () => {
      const fakeImage = new Uint8Array([0xFF, 0xD8]).buffer
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        arrayBuffer: async () => fakeImage,
      })

      await client.downloadScreenshot('device123')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/screenshot/device123`,
        expect.objectContaining({ method: 'GET' }),
      )
    })

    it('doubleTap sends POST to /v1/double_tap/{serial}', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      await client.doubleTap('device123', { x: 50, y: 60 })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/double_tap/device123`,
        expect.objectContaining({
          body: JSON.stringify({ x: 50, y: 60 }),
        }),
      )
    })

    it('longPress sends POST to /v1/long_press/{serial}', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      await client.longPress('device123', { x: 50, y: 60 })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/long_press/device123`,
        expect.objectContaining({
          body: JSON.stringify({ x: 50, y: 60 }),
        }),
      )
    })

    it('getScreenshotPost uses POST method', async () => {
      const fakeImage = new Uint8Array([0xFF]).buffer
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        arrayBuffer: async () => fakeImage,
      })

      await client.getScreenshotPost('device123')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/screen/device123`,
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  describe('auth headers', () => {
    it('sends Authorization Bearer header', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      })

      const client = new DeviceBaseHttpClient({ baseUrl: BASE_URL, apiKey: 'my-key' })
      await client.back('serial')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer my-key',
            'Content-Type': 'application/json',
          },
        }),
      )
    })
  })
})
