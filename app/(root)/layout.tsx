import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { auth } from "../../lib/nextauth/auth";
import User from "@/database/models/user.model";
import { connectToDatabase } from "@/database/mongoose";
import OnboardingGate from "@/components/onboarding/OnboardingGate";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }
    : null;

  let dbUser = null;

  if (session?.user?.email) {
    await connectToDatabase();

    dbUser = await User.findOne({
      email: session.user.email,
    });
  }

  return (
    <main className="min-h-screen text-gray-400 flex flex-col">
      <Header user={user} />

      {dbUser && (
        <OnboardingGate
          show={!dbUser.onboardingCompleted}
          userId={dbUser._id.toString()}
        />
      )}
      <div className="container py-8 flex-1">{children}</div>

      <Footer />
    </main>
  );
};

export default Layout;
