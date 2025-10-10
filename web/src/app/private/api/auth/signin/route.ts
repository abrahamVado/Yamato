import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL

function resolveLoginUrl(): string | null {
  //1.- Guard against missing configuration by verifying the API base URL exists.
  if (!API_BASE_URL) {
    return null
  }
  //2.- Normalize the configured base and append the Laravel auth login path.
  const trimmedBase = API_BASE_URL.replace(/\/+$/, "")
  return `${trimmedBase}/auth/login`
}

export async function POST(req: NextRequest) {
  const loginUrl = resolveLoginUrl()
  if (!loginUrl) {
    return NextResponse.json({ message: "API base URL is not configured" }, { status: 500 })
  }

  let payload: unknown
  try {
    //3.- Read the JSON body so we can forward it to Laravel verbatim.
    payload = await req.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  try {
    //4.- Proxy the credentials to the Laravel login endpoint, including existing cookies for Sanctum.
    const backendResponse = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      body: JSON.stringify(payload),
      redirect: "manual",
    })

    //5.- Mirror the backend response body and headers so the client receives Sanctum cookies and JSON.
    const textBody = await backendResponse.text()
    const nextResponse = new NextResponse(textBody, {
      status: backendResponse.status,
    })
    backendResponse.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()
      if (lowerKey === "content-length") return
      if (lowerKey === "set-cookie") {
        nextResponse.headers.append("set-cookie", value)
        return
      }
      nextResponse.headers.set(key, value)
    })
    if (!nextResponse.headers.has("content-type")) {
      nextResponse.headers.set("content-type", backendResponse.headers.get("content-type") ?? "application/json")
    }
    return nextResponse
  } catch (error) {
    //6.- Surface network issues so the frontend can surface a meaningful error to operators.
    return NextResponse.json({ message: "Unable to reach the authentication service" }, { status: 502 })
  }
}
