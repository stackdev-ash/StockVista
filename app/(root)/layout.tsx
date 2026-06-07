import Header from "../../components/Header";
import { auth } from "../../lib/nextauth/auth";
import { redirect } from "next/navigation";
import User from "@/database/models/user.model";
import { connectToDatabase } from "@/database/mongoose";
import OnboardingGate from "@/components/onboarding/OnboardingGate";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  await connectToDatabase();

  const dbUser = await User.findOne({
    email: session.user.email,
  });

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />

      <OnboardingGate show={!dbUser?.onboardingCompleted} userId={dbUser._id.toString()} />

      <div className="container py-10">{children}</div>
    </main>
  );
};

export default Layout;
