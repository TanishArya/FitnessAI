import { 
  Activity, 
  Scale, 
  Award, 
  Pizza,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: "weight" | "bmi" | "calories" | "activity";
  change?: string;
  changeText?: string;
  changeDirection?: "up" | "down";
  changeColor?: "primary" | "secondary" | "accent";
  subtext?: string;
  subtextColor?: "primary" | "secondary" | "accent";
}

export default function HealthMetricCard({
  title,
  value,
  unit,
  icon,
  change,
  changeText,
  changeDirection = "down",
  changeColor = "secondary",
  subtext,
  subtextColor = "primary"
}: HealthMetricCardProps) {
  
  // Determine which icon to render
  const renderIcon = () => {
    switch (icon) {
      case "weight":
        return <Scale className="h-5 w-5 text-secondary" />;
      case "bmi":
        return <Award className="h-5 w-5 text-primary" />;
      case "calories":
        return <Pizza className="h-5 w-5 text-accent" />;
      case "activity":
        return <Activity className="h-5 w-5 text-secondary" />;
      default:
        return <Scale className="h-5 w-5 text-secondary" />;
    }
  };

  // Determine color classes for change text
  const changeColorClass = changeColor === "primary" 
    ? "text-primary" 
    : changeColor === "accent" 
      ? "text-accent" 
      : "text-secondary";

  // Determine color classes for subtext
  const subtextColorClass = subtextColor === "primary" 
    ? "text-primary" 
    : subtextColor === "accent" 
      ? "text-accent" 
      : "text-secondary";

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground font-nunito">{title}</h3>
          {renderIcon()}
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{value}</span>
          {unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}
        </div>
        {change && (
          <div className={`mt-2 text-xs ${changeColorClass} font-medium flex items-center`}>
            {changeDirection === "down" ? (
              <ArrowDown className="h-3 w-3 mr-1" />
            ) : (
              <ArrowUp className="h-3 w-3 mr-1" />
            )}
            <span>{change} {changeText}</span>
          </div>
        )}
        {subtext && (
          <div className={`mt-2 text-xs ${subtextColorClass} font-medium`}>
            <span>{subtext}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
