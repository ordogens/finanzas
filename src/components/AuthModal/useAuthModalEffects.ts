import { useEffect } from "react";

type UseAuthModalEffectsParams = {
  isOpen: boolean;
  onClose: () => void;
  clearAuthError: () => void;
  mode: "login" | "register";
};

export const useAuthModalEffects = ({
  isOpen,
  onClose,
  clearAuthError,
  mode,
}: UseAuthModalEffectsParams) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    clearAuthError();
  }, [clearAuthError, isOpen, mode]);
};
