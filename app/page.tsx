import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="text-3xl text-amber-100 font-bold bg-black h-screen w-screen px-3 py-3.5">
      <h1>
        Hello, world! 👋 🌍 this is aFlows. Where you can create and manage your
        own agentic workflows.
      </h1>
      <div className="mt-10 flex flex-col items-center justify-center gap-4">
        <Button variant="outline" className="font-bold bg-amber-500">
          Create Workflow
        </Button>
      </div>
    </div>
  );
};

export default page;
