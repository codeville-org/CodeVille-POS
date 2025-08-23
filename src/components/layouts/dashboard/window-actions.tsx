import React from "react";
import { useElectronAPI } from "@/hooks/use-electron-api";
import { MinusCircleIcon, XCircleIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type Props = {};

export function CloseButton({ children }: { children: React.ReactNode }) {
  const api = useElectronAPI();

  const handleCloseWindow = async () => {
    await api.window.close();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure want to quit ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will close the application
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCloseWindow}>
            Yes, Quit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function WindowActions({}: Props) {
  const api = useElectronAPI();

  const handleMinimize = () => api.window.minimize();

  return (
    <div className="flex items-center gap-1 h-full">
      <div
        className="p-2 rounded cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-secondary"
        onClick={handleMinimize}
      >
        <MinusCircleIcon className="size-4" />
      </div>

      <CloseButton>
        <div className="p-2 rounded cursor-pointer flex items-center justify-center transition-colors duration-150 group hover:bg-red-200">
          <XCircleIcon className="size-4 group-hover:text-red-500" />
        </div>
      </CloseButton>
    </div>
  );
}
