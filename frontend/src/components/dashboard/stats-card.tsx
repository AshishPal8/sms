import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  diff?: number;
  suffix?: string;
  iconBg?: string;
  iconColor?: string;
  link?: string;
}

export default function StatCard({
  title,
  icon,
  value,
  diff,
  suffix,
  iconBg = "bg-muted",
  iconColor = "text-muted-foreground",
  link,
}: StatCardProps) {
  const isPositive = diff !== undefined && diff >= 0;

  return (
    <Link href={link ?? "#"}>
      <Card className="flex flex-col gap-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className={`rounded-full p-2 ${iconBg} ${iconColor}`}>
            {icon}
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-4xl text-black font-serif font-extrabold">
            {value}
          </div>

          {diff !== undefined && (
            <p
              className={`text-xs font-medium flex items-center gap-1 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(diff)}{" "}
              {suffix || "from last month"}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
