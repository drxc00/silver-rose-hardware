import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({
  className,
  placeholder,
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-lg border bg-background pl-3 pr-1 text-sm ring-offset-background",
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0 opacity-50" />
      <input
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        className="w-full p-2 bg-white placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
