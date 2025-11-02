"use server";

import { notFound } from "next/navigation";
import { ViewTransition } from "react";

// Components
import AppSidebar from "@/components/organisms/AppSidebar";
import ThreadChatContainer from "@/components/organisms/ThreadChatContainer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Libs
import { getThread } from "@/lib/threads";

// Definitions
type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  // Params
  const { id } = await params;

  // Thread info
  const thread = await getThread(id);
  if (!thread) notFound();

  return (
    <SidebarProvider
      className="bg-slate-100"
      style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
    >
      <AppSidebar id={thread.id} />
      <SidebarInset className="bg-slate-100">
        <header className="block md:hidden flex h-16 shrink-0 items-center gap-2 px-4 bg-slate-100 sticky top-0">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="min-h-screen flex flex-col items-center justify-center relative mb-6 bg-slate-100">
          {thread && <ThreadChatContainer thread={thread} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
