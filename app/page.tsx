import { VercelV0Chat } from "@/components/ui/v0-ai-chat";

export default function Home() {
  return (
    <div className="w-full">
      <div className="absolute top-6 left-6 z-10">
        {/* <Logo size="lg" /> */}
      </div>
      <VercelV0Chat />
    </div>
  );
}
