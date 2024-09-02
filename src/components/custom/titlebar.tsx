import { appWindow } from "@tauri-apps/api/window";
import { Button } from "../ui/button";
import { Minus, X } from "lucide-react";

const TitleBar = () => {
  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 left-0 right-0 h-6 flex justify-end z-50"
    >
      <Button
        variant="ghost"
        size="sm"
        className="relative w-10 h-10 flex justify-center items-center group"
        onClick={() => appWindow.minimize()}
      >
        <Minus className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="relative w-10 h-10 flex justify-center items-center group"
        onClick={() => appWindow.close()}
      >
        <X className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    </div>
  );
};

export default TitleBar;
