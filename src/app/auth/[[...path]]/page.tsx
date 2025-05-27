"use client";

import { useEffect, useState } from "react";
import { redirectToAuth } from "supertokens-auth-react";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import SuperTokens from "supertokens-auth-react/ui";

export default function Auth() {
  // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (SuperTokens.canHandleRoute([EmailPasswordPreBuiltUI]) === false) {
      redirectToAuth({ redirectBack: true });
    } else {
      setLoaded(true);
    }
  }, []);

  if (loaded) {
    return SuperTokens.getRoutingComponent([EmailPasswordPreBuiltUI]);
  }

  return null;
}
