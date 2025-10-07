import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect to the main analytics page since this is likely a marketing site
  return NextResponse.redirect('https://exit1.dev/analytics', 301);
}

export async function POST() {
  return NextResponse.redirect('https://exit1.dev/analytics', 301);
}
