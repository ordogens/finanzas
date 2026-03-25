import { useState, type FormEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/useAuth";
import { showAuthSuccessAlert } from "./authModalAlert";
import { AuthModalContent } from "./AuthModalContent";
import {
  initialLoginValues,
  initialRegisterValues,
  type AuthModalProps,
  type AuthMode,
} from "./types";
import { useAuthModalEffects } from "./useAuthModalEffects";

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginValues, setLoginValues] = useState(initialLoginValues);
  const [registerValues, setRegisterValues] = useState(initialRegisterValues);
  const { authError, clearAuthError, login, loginWithGoogle, register } = useAuth();

  useAuthModalEffects({
    isOpen,
    onClose,
    clearAuthError,
    mode,
  });

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const resetFormState = () => {
    setLoginValues(initialLoginValues);
    setRegisterValues(initialRegisterValues);
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await login(loginValues);

    if (!result.ok) {
      return;
    }

    await showAuthSuccessAlert("Sesion iniciada", result.message);
    resetFormState();
    onClose();
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await register(registerValues);

    if (!result.ok) {
      return;
    }

    await showAuthSuccessAlert("Cuenta creada", result.message);
    resetFormState();
    onClose();
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();

    if (!result.ok) {
      return;
    }

    await showAuthSuccessAlert("Google conectado", result.message);
    resetFormState();
    onClose();
  };

  return createPortal(
    <AuthModalContent
      authError={authError}
      mode={mode}
      loginValues={loginValues}
      registerValues={registerValues}
      onBackdropClick={handleBackdropClick}
      onClose={onClose}
      onChangeMode={setMode}
      onGoogleLogin={handleGoogleLogin}
      onLoginSubmit={handleLoginSubmit}
      onRegisterSubmit={handleRegisterSubmit}
      setLoginValues={setLoginValues}
      setRegisterValues={setRegisterValues}
    />,
    document.body
  );
};
