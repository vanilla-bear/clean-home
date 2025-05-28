import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur Clean Home</h1>
      <p className="text-gray-600 mb-8">
        Vous êtes connecté en tant que {session.user?.email}
      </p>
      <LogoutButton />
    </div>
  );
}
