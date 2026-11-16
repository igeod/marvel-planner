// Off until the server can send the e-mail (service, verified addresses, the job that watches the
// release dates). With the flag off a title not out yet shows the plain clock icon, as before.
export const TITLE_ALERTS_ENABLED = import.meta.env.VITE_TITLE_ALERTS === "true";
