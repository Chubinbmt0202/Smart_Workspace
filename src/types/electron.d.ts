export {};

declare global {
  interface Window {
    desktopAuth?: {
      startGoogleLogin: () => Promise<{
        email: string;
        displayName: string | null;
        photoURL: string | null;
      }>;
    };
  }
}
