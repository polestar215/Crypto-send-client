import { Navbar, Welcome, Transactions } from "../components";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Transactions />
      <Footer />
    </div>
  );
}
