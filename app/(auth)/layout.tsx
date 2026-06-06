import Link from "next/link";
import Image from "next/image";
import { auth } from "../../lib/nextauth/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session?.user) redirect("/");

  return (
    <main className="auth-layout">
      <section className="auth-left-section relative">
        <div className="absolute left-20 top-1/2 -translate-y-1/2 h-125 w-125 rounded-full bg-blue-500/10 blur-[150px]" />

        <div className="absolute bottom-20 left-40 h-75 w-75 rounded-full bg-emerald-500/10 blur-[120px]" />

        <Link href="/" className="auth-logo">
          <div className="flex items-center gap-2  ">
            <Image
              src="/assets/icons/icons.svg"
              alt="StockVista"
              width={44}
              height={44}
            />

            <h2 className="text-white text-2xl font-bold">StockVista</h2>
          </div>
        </Link>

        <div className="relative z-10 max-w-2xl mt-10">
          <div
            className="inline-flex items-center gap-1 mb-3 px-3 py-2 rounded-full border border-cyan-500/15 bg-cyan-300/5 text-cyan-300/80 text-sm font-medium"
          >
            Real-Time Market Intelligence
          </div>

          <h1 className="auth-hero-title text-white">
            Track Markets.
            <br />
            <span className="auth-hero-highlight">Follow Trends.</span>
            <br />
            Build Wealth.
          </h1>

          <p className="auth-hero-subtitle">
            Real-time stock data, market news, watchlists and analytics in one
            place.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="auth-glass-card market-card">
              <p className="text-sm text-gray-400">AAPL</p>

              <h3 className="text-white text-xl font-bold">+3.42%</h3>
            </div>

            <div className="auth-glass-card market-card">
              <p className="text-sm text-gray-400">NVDA</p>

              <h3 className="text-emerald-400 text-xl font-bold">+5.71%</h3>
            </div>

            <div className="auth-glass-card market-card">
              <p className="text-sm text-gray-400">MSFT</p>

              <h3 className="text-blue-400 text-xl font-bold">+2.18%</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-right-section">{children}</section>
    </main>
  );
};

export default Layout;
