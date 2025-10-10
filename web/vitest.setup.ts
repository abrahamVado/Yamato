//1.- Extend Vitest with DOM matchers used by @testing-library.
import "@testing-library/jest-dom/vitest"

//2.- Polyfill browser-only APIs consumed by charts and layout components.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error - jsdom lacks a native ResizeObserver implementation.
global.ResizeObserver = ResizeObserverStub
