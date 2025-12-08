

import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {

    const url = new URL(request.url)
    const workflowId = url.searchParams.get("workflowId")

    if (!workflowId) {
      return NextResponse.json({ success: false, error: "Workflow ID not found" }, { status: 400 });
    }

    // check if the user is has the stripe webhook secret
    const expectedSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const providedSecret = request.headers.get("stripe-signature") || url.searchParams.get("stripe-signature");

    if (expectedSecret && providedSecret !== expectedSecret) {
      return NextResponse.json({ success: false, error: "Invalid webhook secret" }, { status: 401 });
    }

    const body = await request.json();

    const stripeEventData = {
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    }

    // trigger inngest event
    await sendWorkflowExecution({ workflowId, initialData: { stripe: stripeEventData} });

    return NextResponse.json({ success: true, data: stripeEventData }, { status: 200 });

  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
