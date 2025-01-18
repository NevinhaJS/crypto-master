import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "../../models/clerk";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.log(error);

    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      return new NextResponse("Customer email not found", { status: 400 });
    }

    const users = await clerkClient.users.getUserList({
      emailAddress: [customerEmail],
    });

    const user = users.data[0];

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    await clerkClient.users.updateUser(user.id, {
      publicMetadata: {
        subscriptionId: "pro",
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      return new NextResponse("Customer email not found", { status: 400 });
    }

    const users = await clerkClient.users.getUserList({
      emailAddress: [customerEmail],
    });

    const user = users.data[0];

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    await clerkClient.users.updateUser(user.id, {
      publicMetadata: {
        subscriptionId: null,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
