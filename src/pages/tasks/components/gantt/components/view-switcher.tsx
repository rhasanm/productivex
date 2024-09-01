import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { Button } from "@/components/ui/button";

type ViewSwitcherProps = {
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  onViewModeChange,
  // onViewListChange,
  // isChecked,
}) => {
  return (
    <div className="ViewContainer space-y-2">
      <Button variant="outline" onClick={() => onViewModeChange(ViewMode.Hour)}>
        Hour
      </Button>
      <Button
        variant="outline"
        onClick={() => onViewModeChange(ViewMode.QuarterDay)}
      >
        Quarter of Day
      </Button>
      <Button
        variant="outline"
        onClick={() => onViewModeChange(ViewMode.HalfDay)}
      >
        Half of Day
      </Button>
      <Button variant="outline" onClick={() => onViewModeChange(ViewMode.Day)}>
        Day
      </Button>
      <Button variant="outline" onClick={() => onViewModeChange(ViewMode.Week)}>
        Week
      </Button>
      <Button
        variant="outline"
        onClick={() => onViewModeChange(ViewMode.Month)}
      >
        Month
      </Button>
      <Button variant="outline" onClick={() => onViewModeChange(ViewMode.Year)}>
        Year
      </Button>
      {/* <div className="Switch space-y-2">
        <label className="Switch_Toggle">
          <input
            type="checkbox"
            defaultChecked={isChecked}
            onClick={() => onViewListChange(!isChecked)}
          />
          <span className="Slider" />
        </label>
        Show Task List
      </div> */}
    </div>
  );
};
