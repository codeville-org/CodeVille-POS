import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
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
    <Card className="bg-secondary/30">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Update your account password to enhance security.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <PasswordInput
          placeholder="Enter new password"
          className="h-12"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput className="h-12" placeholder="Confirm new password" />
      </CardContent>

      <CardFooter>
        <Button onClick={handleUpdatePassword} loading={isPending}>
          Update Password
        </Button>
      </CardFooter>
    </Card>
  );
}
