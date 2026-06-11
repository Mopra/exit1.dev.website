import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Adds a person who requests an invite to the Monitoring Summit Cannes 2026
// landing page into a dedicated Resend audience (contact list). Nothing is
// emailed automatically — the list is used for manual follow-up with invites.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_CANNES_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error(
      "request-invitation: missing RESEND_API_KEY or RESEND_CANNES_AUDIENCE_ID"
    );
    return NextResponse.json(
      { error: "Invitations are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  let email: unknown;
  let firstName: unknown;
  try {
    const body = await request.json();
    email = body?.email;
    firstName = body?.firstName;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.contacts.create({
      audienceId,
      email: email.trim().toLowerCase(),
      firstName: typeof firstName === "string" ? firstName.trim() : undefined,
      unsubscribed: false,
    });

    // Treat an already-existing contact as success so the UX stays idempotent.
    if (error && !/already/i.test(error.message ?? "")) {
      console.error("request-invitation: resend error", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("request-invitation: unexpected error", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
