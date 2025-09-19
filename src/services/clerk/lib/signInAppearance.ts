import { Appearance } from "@clerk/types";

// Light theme appearance for sign-in components to ensure they stay white even in dark mode
export const signInLightAppearance: Appearance = {
  variables: {
    colorBackground: "#ffffff",
    colorForeground: "#020617",
    colorInput: "#ffffff",
    colorInputForeground: "#020617",
    colorBorder: "#e2e8f0",
    colorMuted: "#f1f5f9",
    colorMutedForeground: "#64748b",
    colorNeutral: "#64748b",
  },
  elements: {
    card: "!bg-white !text-slate-900 shadow-lg",
    headerTitle: "!text-slate-900",
    headerSubtitle: "!text-slate-600",
    socialButtonsBlockButton:
      "!bg-white !border-slate-300 !text-slate-900 hover:!bg-slate-50",
    dividerLine: "!bg-slate-300",
    dividerText: "!text-slate-500",
    formFieldLabel: "!text-slate-700",
    formFieldInput: "!bg-white !border-slate-300 !text-slate-900",
    formButtonPrimary: "!bg-blue-600 hover:!bg-blue-700 !text-white",
    footerActionText: "!text-slate-600",
    footerActionLink: "!text-blue-600 hover:!text-blue-700",
    identityPreview: "!bg-white !border-slate-300",
    identityPreviewText: "!text-slate-900",
    identityPreviewEditButton: "!text-blue-600 hover:!text-blue-700",
  },
};
