import { Badge } from "@/components/ui/badge";
import {
  Clock1,
  Clock10,
  Clock11,
  Clock12,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9
} from "lucide-react";
import { useEffect, useState } from "react";

export const RealtimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get the appropriate clock icon based on the hour
  const getClockIcon = (hour: number) => {
    const hour12 = hour % 12;
    const clockIcons: Record<
      number,
      React.FC<React.SVGProps<SVGSVGElement>>
    > = {
      0: Clock12,
      1: Clock1,
      2: Clock2,
      3: Clock3,
      4: Clock4,
      5: Clock5,
      6: Clock6,
      7: Clock7,
      8: Clock8,
      9: Clock9,
      10: Clock10,
      11: Clock11
    };

    return clockIcons[hour12];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const ClockIcon = getClockIcon(time.getHours());

  return (
    <Badge
      variant="outline"
      className="flex h-9 items-center gap-2 px-3 py-2 text-xs tracking-wider font-sans"
    >
      <ClockIcon className="size-5" />
      {formatTime(time)}
    </Badge>
  );
};
