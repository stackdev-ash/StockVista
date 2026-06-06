import Header from "../../components/Header";
import { auth } from "../../lib/nextauth/auth";
import { redirect } from "next/navigation";

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

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />

      <div className="container py-10">{children}</div>
    </main>
  );
};

export default Layout;
