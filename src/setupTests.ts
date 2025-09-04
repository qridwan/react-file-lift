// Jest setup file for additional configuration

// Mock browser APIs that aren't available in Jest environment
global.URL.createObjectURL = jest.fn(() => "mocked-url");
global.URL.revokeObjectURL = jest.fn();

// Mock file reader
global.FileReader = class FileReader {
  result: string | ArrayBuffer | null = null;
  error: DOMException | null = null;
  readyState: number = 0;

  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  dispatchEvent = jest.fn();

  readAsDataURL = jest.fn();
  readAsText = jest.fn();
  readAsArrayBuffer = jest.fn();
  readAsBinaryString = jest.fn();

  abort = jest.fn();

  onload = jest.fn();
  onerror = jest.fn();
  onabort = jest.fn();
  onloadstart = jest.fn();
  onloadend = jest.fn();
  onprogress = jest.fn();
} as any;

// Mock XMLHttpRequest for upload progress testing
global.XMLHttpRequest = class XMLHttpRequest {
  open = jest.fn();
  send = jest.fn();
  setRequestHeader = jest.fn();

  upload = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  addEventListener = jest.fn();
  removeEventListener = jest.fn();

  status = 200;
  responseText = "";

  onload = jest.fn();
  onerror = jest.fn();
  onprogress = jest.fn();
} as any;
