"use client";
import { useRouter } from "next/navigation";
import { useState, ViewTransition } from "react";

// Api
import { createThread } from "@/app/actions/chat";

// Components
import ChatForm from "@/components/molecules/ChatForm";

export default function Page() {
  //
  const router = useRouter();

  const [isDisabled, setIsDisabled] = useState(false);

  async function onSubmit(values: {
    provider: "OpenAI" | "Ollama";
    message: string;
  }) {
    setIsDisabled(true);
    const id = await createThread(values);
    router.push(`/thread/${id}`);
  }

  return (
    <ViewTransition>
      <div className="min-h-screen w-full flex items-center justify-center">
        <ChatForm
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          defaultProvider="OpenAI"
        />
      </div>
    </ViewTransition>
  );
}
