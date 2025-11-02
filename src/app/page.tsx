"use client";
import { Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, ViewTransition } from "react";

// Api
import { createThread } from "@/app/actions/chat";

// Components
import ChatForm from "@/components/molecules/ChatForm";
import AppSidebar from "@/components/organisms/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Definitions
type Question = {
  id: string;
  title: string;
};

export default function Page() {
  // Hooks
  const router = useRouter();

  // State
  const [isDisabled, setIsDisabled] = useState(false);

  // Methods
  async function onSubmit(values: {
    provider: "OpenAI" | "Ollama";
    message: string;
  }) {
    setIsDisabled(true);
    const id = await createThread(values);
    router.push(`/thread/${id}`);
  }

  const questions: Question[] = [];

  return (
    <ViewTransition>
      <SidebarProvider
        className="bg-slate-100"
        style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarInset>
          <header className="block md:hidden flex h-16 shrink-0 items-center gap-2 px-4 bg-slate-100">
            <SidebarTrigger className="-ml-1 sticky top-0" />
          </header>
          <div className="h-[calc(100vh-64px)] w-full flex flex-col items-center gap-2 pb-5 justify-center bg-slate-100">
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter flex flex-row gap-4 items-center">
              <Landmark className="size-10 md:size-15 lg:size-20" /> Finantier
            </h1>
            <p className="w-2/3 lg:w-1/3  mt-4 mb-10 md:text-lg text-foreground/80 text-center">
              Especialista en pronósticos, tendencias del mercado e inversión en
              valor, combinando análisis económico e IA para ofrecer información
              clara, precisa y fundamentada.
            </p>

            <ChatForm
              isDisabled={isDisabled}
              onSubmit={onSubmit}
              defaultProvider="OpenAI"
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ViewTransition>
  );
}
