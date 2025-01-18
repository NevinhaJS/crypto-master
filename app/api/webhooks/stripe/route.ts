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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const customerId = session.customer;

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
        stripeCustomerId: customerId,
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const session = event.data.object as Stripe.Subscription;
    const resp: any = await stripe.customers.retrieve(
      session.customer as string
    );
    console.log("resp", resp);
    if (!resp?.email) {
      return new NextResponse("Customer email not found", { status: 400 });
    }
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [resp.email],
      });
      console.log(users);
      const user = users.data[0];

      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }

      await clerkClient.users.updateUser(user.id, {
        publicMetadata: {
          subscriptionId: null,
          stripeCustomerId: null,
        },
      });
    } catch (err) {
      console.log(err);
      return new NextResponse("Error while trying to get the user from clerk", {
        status: 500,
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
