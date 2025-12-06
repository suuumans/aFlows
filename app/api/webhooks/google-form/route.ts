
import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {

    const url = new URL(request.url)
    const workflowId = url.searchParams.get("workflowId")

    if (!workflowId) {
      return NextResponse.json({ success: false, error: "Workflow ID not found" }, { status: 400 });
    }

    // check if the user is has the google webhook secret
    const expectedSecret = process.env.GOOGLE_WEBHOOK_SECRET;
    const providedSecret = request.headers.get("x-google-webhook-secret") || url.searchParams.get("x-google-webhook-secret");

    if (expectedSecret && providedSecret !== expectedSecret) {
      return NextResponse.json({ success: false, error: "Invalid webhook secret" }, { status: 401 });
    }

    const body = await request.json();

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      responses: body.responses,
      respondentEmail: body.respondentEmail,
      raw: body,
    }

    // trigger inngest event
    await sendWorkflowExecution({ workflowId, initialData: { googleForm: formData} });

    return NextResponse.json({ success: true, data: formData }, { status: 200 });

  } catch (error) {
    console.error("Google form webhook error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
