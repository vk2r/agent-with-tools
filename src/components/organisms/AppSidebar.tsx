"use client";
import { Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

// Icons
import { TrashIcon } from "@/components/animate-ui/icons/trash";
import { HistoryIcon } from "@/components/ui/history";
import { PlusIcon } from "@/components/ui/plus";

// Components
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Definitions
type Link = {
  id: string;
  title: string;
  url: string;
  isActive?: boolean;
};

type Group = {
  id: string;
  title: string;
  url?: string;
  items: Link[];
  icon?: ReactNode;
};

export interface Props {
  id?: string;
}

const AppSidebar = (props: Props) => {
  // Props
  const { id } = props;
  const router = useRouter();

  // States
  const [data, setData] = useState<Group[]>([
    {
      id: "new",
      title: "Nuevo Chat",
      url: "#",
      items: [],
      icon: <PlusIcon size={18} />,
    },
    {
      id: "history",
      title: "Historial",
      items: [],
      icon: <HistoryIcon size={18} />,
    },
  ]);

  // Methods
  const getThreads = async () => {
    try {
      const res = await fetch("/api/threads/get");
      if (!res.ok) return;
      const json = (await res.json()) as {
        threads: Array<{ id: string; title: string }>;
      };
      const links = json.threads.map((thread) => ({
        id: thread.id,
        title: thread.title,
        url: `/thread/${thread.id}`,
      }));
      setData([
        {
          id: "new",
          title: "Nuevo Chat",
          url: "/",
          items: [],
          icon: <PlusIcon size={18} />,
        },
        {
          id: "history",
          title: "Historial",
          items: links,
          icon: <HistoryIcon size={18} />,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteThread = async (threadId: string) => {
    try {
      const res = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadIds: [threadId],
        }),
      });
      if (!res.ok) {
        console.error("Error al eliminar chat");
        return;
      }
      await getThreads();
    } catch (error) {
      console.error(error);
    } finally {
      if (threadId === id) router.push("/");
    }
  };

  // Effects
  useEffect(() => {
    getThreads();
  }, []);

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="bg-slate-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Landmark className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Finantier</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-slate-50">
        <SidebarGroup className="bg-slate-50">
          <SidebarMenu className="gap-2">
            {data.map((item, index) => (
              <SidebarMenuItem key={`${item.id}-${index}`}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    <span className="flex items-center gap-2 cursor-pointer">
                      {item.icon} {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5 pt-2">
                    {item.items.map((link) => (
                      <SidebarMenuSubItem key={link.id}>
                        <SidebarMenuSubButton asChild isActive={id === link.id}>
                          <div className="flex justify-between">
                            <a
                              href={link.url}
                              className="truncate cursor-pointer"
                            >
                              {link.title}
                            </a>

                            <TrashIcon
                              animateOnHover
                              className="cursor-pointer"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deleteThread(link.id);
                              }}
                              size={18}
                            />
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
