"use client";
import { Landmark } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState, ViewTransition } from "react";

// Api
import { createThread } from "@/app/actions/chat";
import {
  type Notification,
  NotificationList,
} from "@/components/animate-ui/components/community/notification-list";

// Components
import ChatForm from "@/components/molecules/ChatForm";
import AppSidebar from "@/components/organisms/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AgentLib, { type Agent } from "@/lib/agents";

export default function Page() {
  // Hooks
  const router = useRouter();

  // Constants
  const defaultProvider = AgentLib.GetDefaultAgent() as Agent["displayName"];

  // State
  const [isWaiting, setIsWaiting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [provider, setProvider] = useState(defaultProvider);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: nanoid(),
      title: "Generación de gráficos",
      subtitle:
        "Obtén un historial de precios de los últimos 12 meses de Microsoft y grafícalos linealmente",
      execute: false,
    },
    {
      id: nanoid(),
      title: "Precios en tiempo real",
      subtitle: "Busca el precio de las acciones de Apple",
      execute: false,
    },
    {
      id: nanoid(),
      title: "Búsqueda en internet",
      subtitle: "Busca papers sobre finanzas en internet",
      execute: false,
    },
    {
      id: nanoid(),
      title: "Noticias financieras",
      subtitle: "Obtén las últimas noticias sobre NVIDIA",
      execute: false,
    },
    {
      id: nanoid(),
      title: "Recomendaciones de acciones",
      subtitle: "Recomienda acciones para invertir en el mercado de valores",
      execute: false,
    },
  ]);

  // Methods
  async function onSubmit(values: {
    provider: Agent["displayName"];
    message: string;
  }) {
    setIsDisabled(true);
    setIsWaiting(true);
    const id = await createThread(values);
    router.push(`/thread/${id}`);
  }

  async function onSelectNotification(values: {
    provider: Agent["displayName"];
    notification: Notification;
  }) {
    setIsDisabled(true);
    setIsWaiting(true);

    setNotifications(
      notifications.map((notification) => {
        if (notification.id === values.notification.id) {
          return { ...notification, execute: true };
        }
        return notification;
      }),
    );

    await onSubmit({
      provider: values.provider,
      message: values.notification.subtitle,
    });
  }

  return (
    <ViewTransition>
      <SidebarProvider
        className="bg-slate-100"
        style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarInset className="bg-slate-100">
          <header className="flex md:hidden h-16 shrink-0 items-center gap-2 px-4 bg-slate-100">
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
              onSubmit={onSubmit}
              isDisabled={isDisabled}
              defaultProvider={defaultProvider}
              onProviderChange={setProvider}
            />

            <NotificationList
              className="mt-6"
              isDisabled={isDisabled}
              isWaiting={isWaiting}
              notifications={notifications}
              onClick={(notification) =>
                onSelectNotification({ provider, notification })
              }
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ViewTransition>
  );
}
