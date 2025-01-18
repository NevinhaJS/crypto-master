import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { subscriptions } from "@/constants";
import { User } from "@clerk/nextjs/server";
import { Check } from "lucide-react";
import { useState } from "react";

interface SubscriptionProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const SubscriptionModal = ({ isOpen, onClose, user }: SubscriptionProps) => {
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      location.href = `${subscriptions.monthly.link}?prefilled_email=${user.emailAddresses[0].emailAddress}`;
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="rounded-lg border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {subscriptions.monthly.name}
              </h3>
              <p className="text-2xl font-bold">
                ${subscriptions.monthly.price}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>{subscriptions.monthly.description}</span>
              </div>
            </div>

            <Button
              className="mt-6 w-full bg-black text-white hover:bg-orange-100 hover:text-black border transition-all duration-300"
              onClick={onSubscribe}
              disabled={loading}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
