import { HeroButton } from "@/features/ui/hero";
import { PocketKnife } from "lucide-react";
import { extensionStore } from "../extension-store";

export const NewExtension = () => {
  return (
    <HeroButton
      title="New Agent"
      description="Create a new agent and extend it with your own internal API"
      icon={<PocketKnife />}
      onClick={() => extensionStore.newAndOpenSlider()}
    />
  );
};
