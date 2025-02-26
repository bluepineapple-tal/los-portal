"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import LaunchUI from "../../logos/launch-ui";
import { Button } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import Navigation from "../../ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";

export default function NavbarSection() {
  // const [userInfo, setUserInfo] = useState<any | null>(null);
  const session = useSessionContext();
  const router = useRouter();

  let userId: string | null = null;

  if (!session.loading) {
    userId = session.userId;
    console.log("userId: ", userId);
  }

  // TODO: Validate if this code is causing any auth related issues
  useEffect(() => {
    if (
      !session.loading &&
      "doesSessionExist" in session &&
      !session.doesSessionExist
    ) {
      console.log("[+] Redirecting to auth");
      router.push("/auth");
    }
  }, [session, router]);

  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     if (!session.loading && userId) {
  //       const { data } = await client.query<UserQuery, UserQueryVariables>({
  //         query: GET_USER_INFO,
  //         variables: { where: { userId: userId } },
  //       });
  //       if (data?.user) {
  //         setUserInfo(data.user);
  //       }
  //     }
  //   };

  //   getUserInfo();
  // }, [session.loading, userId]);

  async function onLogout() {
    await signOut();
    router.push("/auth");
  }

  return (
    <header className="sticky top-0 z-50 px-4 pb-4">
      <div className="fade-bottom absolute left-0 h-20 w-full bg-background/15 backdrop-blur-lg"></div>
      <div className="relative mx-auto max-w-container">
        <NavbarComponent>
          <NavbarLeft>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <LaunchUI />
              LOS Lender Portal
            </Link>

            <Navigation />
          </NavbarLeft>

          <NavbarRight>
            {!session.loading &&
            "doesSessionExist" in session &&
            session.doesSessionExist ? (
              <Button variant="default" onClick={onLogout}>
                Logout
              </Button>
            ) : null}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>LOS</span>
                  </Link>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Getting Started
                  </Link>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Components
                  </Link>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
