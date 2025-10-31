"use server";

import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import ThreadChatContainer from "@/components/organisms/ThreadChatContainer";
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
    <ViewTransition>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{thread.title}</h1>
          <p className="text-gray-500">ID: {id}</p>
        </div>

        <div className="w-full flex justify-center">
          {thread && <ThreadChatContainer thread={thread} />}
        </div>
      </div>
    </ViewTransition>
  );
}
