import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WellSyncPro from "@/components/WellSyncPro";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all data server-side for initial render
  const [
    { data: tasks },
    { data: champions },
    { data: communications },
    { data: benefits },
    { data: activityLogs },
    { data: clients },
    { data: templates },
  ] = await Promise.all([
    supabase.from("tasks").select("*").order("id"),
    supabase.from("champions").select("*").order("client"),
    supabase.from("communications").select("*").order("id"),
    supabase.from("benefits").select("*").order("client"),
    supabase.from("activity_logs").select("*").order("id", { ascending: false }),
    supabase.from("clients").select("*").order("id"),
    supabase.from("templates").select("*").order("id"),
  ]);

  return (
    <WellSyncPro
      initialTasks={tasks ?? []}
      initialChampions={champions ?? []}
      initialCommunications={communications ?? []}
      initialBenefits={benefits ?? []}
      initialActivityLogs={activityLogs ?? []}
      initialClients={clients ?? []}
      initialTemplates={templates ?? []}
      userEmail={user.email ?? ""}
    />
  );
}
