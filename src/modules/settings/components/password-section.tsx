import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useUpsertSettings } from "../query/use-upsert";

type Props = {};

export function PasswordSection({}: Props) {
  const [password, setPassword] = useState("");
  const { mutate, isPending } = useUpsertSettings();

  const handleUpdatePassword = () => {
    mutate({ password });
  };

  return (
    <div className="space-y-2">
      <Label>Password</Label>

      <div className="space-y-1">
        <Input
          type="password"
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input type="password" placeholder="Confirm new password" />

        <Button onClick={handleUpdatePassword} loading={isPending}>
          Update Password
        </Button>
      </div>
    </div>
  );
}
