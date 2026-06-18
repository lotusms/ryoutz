import { NextResponse } from "next/server";
import {
  emailResultForClient,
  sendOrderConfirmationEmails,
} from "@/lib/email/order-emails.mjs";

export async function POST(request) {
  try {
    const payload = await request.json();
    if (!payload?.order || !Array.isArray(payload.order?.lines)) {
      return NextResponse.json(
        { error: "Invalid checkout payload." },
        { status: 400 },
      );
    }

    const order = payload.order;

    const fulfillment = {
      provider: "demo",
      providerOrderId: null,
      providerStatus: null,
      printfulOrderId: null,
      printfulStatus: null,
    };

    const emailResult = await sendOrderConfirmationEmails({
      order,
      payment: null,
      fulfillment,
    });

    return NextResponse.json({
      ok: true,
      mode: "demo",
      printfulOrderId: null,
      printfulStatus: null,
      email: emailResultForClient(emailResult),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
