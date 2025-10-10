import { test } from "node:test"
import assert from "node:assert/strict"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import { JSDOM } from "jsdom"

const require = createRequire(import.meta.url)
const tsNode = require("ts-node")
const tsConfigPaths = require("tsconfig-paths")

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const webDir = path.join(__dirname, "..", "..")

const previousCwd = process.cwd()
process.chdir(webDir)

tsNode.register({
  //1.- Transpile TS/TSX modules on the fly with JSX support for the React component under test.
  transpileOnly: true,
  compilerOptions: {
    module: "Node16",
    moduleResolution: "node16",
    target: "es2020",
    jsx: "react-jsx",
    esModuleInterop: true,
  },
})

const configResult = tsConfigPaths.loadConfig(webDir)
if (configResult.resultType === "success") {
  //2.- Respect the `@/*` alias used across the Next.js app when importing modules in tests.
  tsConfigPaths.register({
    baseUrl: configResult.absoluteBaseUrl,
    paths: configResult.paths,
  })
}
process.chdir(previousCwd)

function bootstrapDom() {
  //1.- Provide a deterministic DOM implementation so Radix UI portals and React Testing Library work in Node.
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "https://example.com/en/private/dashboard",
  })
  global.window = dom.window
  global.document = dom.window.document
  global.navigator = dom.window.navigator
  global.self = dom.window
  global.Element = dom.window.Element
  global.HTMLElement = dom.window.HTMLElement
  global.Node = dom.window.Node
  global.getComputedStyle = dom.window.getComputedStyle
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0)
  if (!global.ResizeObserver) {
    global.ResizeObserver = class {
      //1.- Mock the ResizeObserver API used by Radix popovers when running in JSDOM.
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
    })
  }
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = (cb) => {
      const id = setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 0)
      return id
    }
    window.cancelIdleCallback = (id) => clearTimeout(id)
  }
  if (!global.MutationObserver) {
    global.MutationObserver = class {
      //1.- Provide a stub MutationObserver for Radix focus traps running inside JSDOM.
      observe() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
  }
}

function clearDom() {
  delete global.window
  delete global.document
  delete global.navigator
  delete global.self
  delete global.Element
  delete global.MutationObserver
  delete global.requestIdleCallback
  delete global.cancelIdleCallback
}

function stubModule(specifier, factory) {
  const resolved = require.resolve(specifier)
  const previous = require.cache[resolved]
  delete require.cache[resolved]
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: factory(),
  }
  return () => {
    delete require.cache[resolved]
    if (previous) {
      require.cache[resolved] = previous
    }
  }
}

test("UserNav renders backend data and clears state after logout", async (t) => {
  bootstrapDom()

  const React = require("react")
  const rtl = require("@testing-library/react")
  const { render, screen, waitFor, fireEvent } = rtl

  const restoreDropdown = stubModule("@/components/ui/dropdown-menu", () => {
    const React = require("react")
    const wrap = (Tag, extra = {}) =>
      React.forwardRef(({ children, asChild, ...props }, ref) => {
        if (asChild && React.isValidElement(children)) {
          return React.cloneElement(children, { ref, ...extra, ...props })
        }
        return React.createElement(Tag, { ref, ...extra, ...props }, children)
      })
    return {
      DropdownMenu: ({ children, ...props }) => React.createElement("div", { ...props }, children),
      DropdownMenuTrigger: wrap("button"),
      DropdownMenuContent: wrap("div", { role: "menu" }),
      DropdownMenuGroup: wrap("div"),
      DropdownMenuItem: wrap("button", { role: "menuitem" }),
      DropdownMenuLabel: wrap("div"),
      DropdownMenuSeparator: wrap("hr"),
    }
  })

  const restoreTooltip = stubModule("@/components/ui/tooltip", () => {
    const React = require("react")
    const passthrough = (Tag) =>
      React.forwardRef(({ children, asChild, ...props }, ref) => {
        if (asChild && React.isValidElement(children)) {
          return React.cloneElement(children, { ref, ...props })
        }
        return React.createElement(Tag, { ref, ...props }, children)
      })
    return {
      TooltipProvider: ({ children }) => React.createElement(React.Fragment, null, children),
      Tooltip: ({ children }) => React.createElement(React.Fragment, null, children),
      TooltipTrigger: passthrough("span"),
      TooltipContent: passthrough("div"),
    }
  })

  const apiClientPath = path.join(webDir, "src", "lib", "api-client.ts")
  delete require.cache[require.resolve(apiClientPath)]
  const apiClient = require(apiClientPath)

  apiClient.apiRequest = t.mock.fn(async () => ({
    id: 99,
    name: "Test Operator",
    email: "operator@example.com",
  }))
  apiClient.clearStoredToken = t.mock.fn(() => {
    window.localStorage.removeItem("yamato.authToken")
  })

  const userNavPath = path.join(webDir, "src", "components", "private", "user-nav.tsx")
  delete require.cache[require.resolve(userNavPath)]
  const { UserNav } = require(userNavPath)

  window.localStorage.setItem("yamato.authToken", "demo")
  const fetchCalls = []
  const originalFetch = global.fetch
  global.fetch = async (input, init = {}) => {
    fetchCalls.push({ input, init })
    return new Response(null, { status: 204 })
  }

  try {
    render(React.createElement(UserNav))

    const trigger = screen.getByLabelText("Open user menu")
    fireEvent.keyDown(trigger, { key: "Enter" })
    fireEvent.keyUp(trigger, { key: "Enter" })
    fireEvent.click(trigger)
    const profileName = await screen.findByText("Test Operator")
    assert.equal(profileName.textContent, "Test Operator")
    const profileEmail = await screen.findByText("operator@example.com")
    assert.equal(profileEmail.textContent, "operator@example.com")

    const signOut = await screen.findByText("Sign out")
    fireEvent.click(signOut)

    await waitFor(() => {
      assert.equal(fetchCalls.length, 1)
    })

    assert.equal(fetchCalls[0].input, "/private/api/auth/signout")
    assert.equal(window.localStorage.getItem("yamato.authToken"), null)
    assert.ok(apiClient.clearStoredToken.mock.callCount() >= 1)
    await new Promise(resolve => setTimeout(resolve, 0))
  } finally {
    global.fetch = originalFetch
    restoreTooltip()
    restoreDropdown()
    clearDom()
  }
})
