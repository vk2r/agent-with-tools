"use server";

import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { getInitialMessages } from "@/app/actions/chat";

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

  // Initial messages
  const initialMessages = await getInitialMessages(
    thread.id,
    thread.providerId,
  );

  return (
    <ViewTransition>
      <SidebarProvider
        className="bg-slate-100"
        style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
      >
        <AppSidebar id={thread.id} />
        <SidebarInset className="bg-slate-100">
          <header className="flex md:hidden h-16 shrink-0 items-center gap-2 px-4 bg-slate-100 sticky top-0">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="min-h-screen flex flex-col items-center justify-center relative mb-6 bg-slate-100">
            <ThreadChatContainer
              thread={thread}
              initialMessages={initialMessages}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ViewTransition>
  );
}
