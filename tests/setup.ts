// Jest setup file - controls test output based on DEBUG flag
import { DEBUG } from '../src/config.js';

// Suppress console output in tests unless DEBUG is enabled
if (!DEBUG) {
  // Store original console methods
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalDebug = console.debug;
  const originalError = console.error;
  

  // Override console methods to be no-ops when DEBUG is false
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.debug = jest.fn();
  console.error = jest.fn();

  // Restore after all tests
  afterAll(() => {
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.debug = originalDebug;
    console.error = originalError;
  });
}

