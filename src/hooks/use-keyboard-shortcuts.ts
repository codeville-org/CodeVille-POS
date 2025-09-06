import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl+Shift+D for Diagnostics
      if (event.ctrlKey && event.shiftKey && event.key === "D") {
        event.preventDefault();
        navigate("/diagnostics");
      }

      // Ctrl+Shift+H for Home/Dashboard
      if (event.ctrlKey && event.shiftKey && event.key === "H") {
        event.preventDefault();
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);
}

export default useKeyboardShortcuts;
