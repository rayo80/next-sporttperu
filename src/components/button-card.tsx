import { cn } from "@/lib/utils"
import { Button } from "./ui/button"


interface ButtonIconProps {
    icon: any;
    label: string;
  }

interface ButtonCardProps {
    item: ButtonIconProps;
    action: () => void
  }

export function ButtonCard({ item, action}: ButtonCardProps) {
    const val = () => {
        console.log("me ejeeeeeecuto click")
        action()
    }
    return (
        <Button
            key={item.label}
            size="icon"
            variant="secondary"
            className={cn(
            "h-10 w-10 rounded-full bg-white shadow-md hover:bg-gray-100",
            "opacity-0 translate-x-4 transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-x-0",
            `group-hover:transition-all group-hover:delay-[${100}ms]`
            )}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                action()
            }}
        >
        <item.icon className="h-4 w-4" />
        <span className="sr-only">{item.label}</span>
        </Button>
        )
}
  