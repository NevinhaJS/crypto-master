"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { subscriptions } from "@/constants";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { Menu } from "lucide-react";
import { useState } from "react";
import SubscriptionModal from "@/features/Subscription";
import { User } from "@clerk/nextjs/server";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const { user } = useUser();

  const subscriptionId = user?.publicMetadata.subscriptionId;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-8 right-4 md:hidden z-50 scale-[1.2] hover:bg-white hover:text-black bg-[#dfd3c0]"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6 text-black" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#1a1a1a] text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Menu
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 items-center">
            <SignedOut>
              <div className="flex items-center gap-2 bg-white text-black p-2 rounded-lg font-normal text-sm">
                <SignInButton />
              </div>
            </SignedOut>

            <SignedIn>
              <p className="text-sm text-center">
                You can cancel your subscription at any time
              </p>
              {subscriptionId === "pro" ? (
                <Button
                  onClick={() => window.open(subscriptions.monthly.cancel_link)}
                  className="w-full"
                >
                  Cancel Subscription
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsSubscriptionOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  Upgrade to Pro
                </Button>
              )}

              <div className="flex items-center gap-2 bg-white text-black p-2 rounded-lg font-normal text-sm w-full justify-center">
                <SignOutButton />
              </div>
            </SignedIn>
          </div>
        </DialogContent>
      </Dialog>

      {user && (
        <SubscriptionModal
          user={user as unknown as User}
          isOpen={isSubscriptionOpen}
          onClose={() => setIsSubscriptionOpen(false)}
        />
      )}
    </>
  );
}
