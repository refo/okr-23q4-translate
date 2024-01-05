import { NextRequest, NextResponse } from "next/server";

export const isAppKeyValid = (request: NextRequest) =>
  request.headers.get("Authorization") === `Bearer ${process.env.APP_KEY}`;

export const unauthorizedResponse = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
