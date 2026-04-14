/**
 * Renders the correct auth modal based on the current flow state.
 * Place once in the root layout — inside AuthFlowProvider.
 */

"use client";

import { useAuthFlow } from "@/contexts/AuthFlowContext";
import AuthModal from "@/components/auth/AuthModal";
import RoleSelectionModal from "@/components/auth/RoleSelectionModal";
import SellerOnboardingModal from "@/components/auth/SellerOnboardingModal";

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-cream rounded-2xl shadow-2xl border border-sand overflow-y-auto max-h-[90vh]">
        {children}
      </div>
    </div>
  );
}

export default function AuthFlowManager() {
  const { modal, closeModal } = useAuthFlow();

  if (!modal) return null;

  // Role selection and onboarding require an active choice — block backdrop close.
  const backdropClose = modal === "auth" ? closeModal : () => {};

  return (
    <Overlay onClose={backdropClose}>
      {modal === "auth" && <AuthModal />}
      {modal === "role" && <RoleSelectionModal />}
      {modal === "onboarding" && <SellerOnboardingModal />}
    </Overlay>
  );
}
