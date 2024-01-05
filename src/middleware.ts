import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { authMiddleware } from "@clerk/nextjs";

export const config = {
  matcher: "/((?!_next/static|favicon.ico).*)",
};

const rateLimitToken = Number(process.env.RATE_LIMIT_TOKEN);
const rateLimitWindow = process.env.RATE_LIMIT_WINDOW as `${number} s`;

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(rateLimitToken, rateLimitWindow),
});

async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    ip
  );

  return success
    ? NextResponse.next()
    : NextResponse.json("You have reached your request limit", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
}

const clerkAuthMiddleware = authMiddleware({});

export default async function middleware(
  request: NextRequest,
  next: NextFetchEvent
) {
  const authMiddlewareResponse = await clerkAuthMiddleware(request, next);

  if (!authMiddlewareResponse?.ok) {
    return authMiddlewareResponse;
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    return rateLimitMiddleware(request);
  }
}
