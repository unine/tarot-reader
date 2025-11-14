import PocketBase from "pocketbase";
import { PUBLIC_DB_CONNECT } from "$env/static/public";

export const handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase(PUBLIC_DB_CONNECT);

  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || ""
  );

  if (event.locals.pb.authStore.isValid) {
    try {
      // Refresh user data to ensure it's current and validate the session
      await event.locals.pb.collection("users").authRefresh();
      event.locals.user = event.locals.pb.authStore.model;
    } catch (err) {
      // If refresh fails, clear the invalid session
      event.locals.pb.authStore.clear();
      event.locals.user = null;
    }
  }

  const response = await resolve(event);

  // secure true before deployment
  response.headers.append(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie({
      secure: event.url.protocol === "https:",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7, //1 week
      httpOnly: true,
    })
  );

  return response;
};
