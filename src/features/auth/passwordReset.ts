// Off until the server can send the reset email (service, link lifetime, resend window), and until
// email addresses are verified: today a mistyped address would send the link to a stranger.
export const PASSWORD_RESET_ENABLED = import.meta.env.VITE_PASSWORD_RESET === "true";
