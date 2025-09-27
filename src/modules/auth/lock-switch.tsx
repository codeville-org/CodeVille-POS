import { Switch } from "@/components/ui/switch";
import { useSecurityStore } from "@/lib/zustand/security-store";
import { LockIcon } from "lucide-react";

type Props = {};

export function LockSwitch({}: Props) {
  const { lock, isAuthenticated } = useSecurityStore();

  const handleCheckedChange = async (checked: boolean) => {
    if (checked) {
      lock();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated && (
        <div className="bg-secondary text-secondary-foreground p-1 rounded-full">
          <LockIcon className="size-3" />
        </div>
      )}

      <Switch
        id="lock-switch"
        checked={!isAuthenticated}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}
