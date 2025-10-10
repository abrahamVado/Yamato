import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL

function resolveLogoutUrl(): string | null {
  //1.- Bail out early when the Laravel API endpoint is not configured.
  if (!API_BASE_URL) {
    return null
  }
  //2.- Trim trailing slashes from the configured base before appending the Sanctum logout route.
  const trimmedBase = API_BASE_URL.replace(/\/+$/, "")
  return `${trimmedBase}/auth/logout`
}

function applyBackendHeaders(source: Response, target: NextResponse) {
  //1.- Mirror the backend headers, propagating cookie mutations so Sanctum sessions close properly.
  source.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase()
    if (lowerKey === "set-cookie") {
      target.headers.append("set-cookie", value)
      return
    }
    if (lowerKey === "content-length") {
      return
    }
    target.headers.set(key, value)
  })
}

export async function POST(req: NextRequest) {
  const logoutUrl = resolveLogoutUrl()
  if (!logoutUrl) {
    return NextResponse.json({ message: "API base URL is not configured" }, { status: 500 })
  }

  try {
    //1.- Forward cookies and bearer credentials so Laravel can revoke both Sanctum sessions and tokens.
    const backendResponse = await fetch(logoutUrl, {
      method: "POST",
      headers: {
        accept: req.headers.get("accept") ?? "application/json",
        cookie: req.headers.get("cookie") ?? "",
        authorization: req.headers.get("authorization") ?? "",
      },
      redirect: "manual",
    })

    const textBody = await backendResponse.text()
    const hasBody = textBody.trim().length > 0

    if (hasBody) {
      //2.- Stream the backend payload verbatim when Laravel returns JSON for telemetry or error messages.
      const nextResponse = new NextResponse(textBody, { status: backendResponse.status })
      applyBackendHeaders(backendResponse, nextResponse)
      if (!nextResponse.headers.has("content-type")) {
        nextResponse.headers.set("content-type", backendResponse.headers.get("content-type") ?? "application/json")
      }
      return nextResponse
    }

    //3.- Normalize empty responses (204) into a JSON acknowledgement for the browser client.
    const normalized = NextResponse.json({ ok: backendResponse.ok }, {
      status: backendResponse.ok ? 200 : backendResponse.status,
    })
    applyBackendHeaders(backendResponse, normalized)
    return normalized
  } catch (error) {
    //4.- Surface connectivity issues without masking the underlying error to aid debugging.
    return NextResponse.json({ message: "Unable to reach the authentication service" }, { status: 502 })
  }
}
