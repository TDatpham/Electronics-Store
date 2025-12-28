import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: {
    user: { name: string; email: string; image: string };
  } | null = await getServerSession();

  if (!session) {
    redirect("/");
  }

  let email: string = session.user.email;

  try {
    const res = await fetch(`http://localhost:3001/api/users/email/${email}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error("Admin layout: Failed to fetch user data", res.status);
      redirect("/");
    }

    const data = await res.json();

    // redirecting user to the home page if not admin
    if (data.role !== "admin") {
      console.warn(`Access denied for user: ${email} (Role: ${data.role})`);
      redirect("/");
    }
  } catch (error) {
    console.error("Admin layout error:", error);
    redirect("/");
  }

  return <>{children}</>;
}
