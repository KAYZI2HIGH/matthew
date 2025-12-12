"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function ProgressBar({
  currentStep,
  totalSteps,
  stepLabels = [],
}: ProgressBarProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-neutral-400">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-neutral-400">
          {Math.round(progressPercent)}%
        </span>
      </div>
      <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-green-600 to-green-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {stepLabels.length > 0 && (
        <div className="flex justify-between mt-2">
          {stepLabels.map((label, idx) => (
            <span
              key={idx}
              className={`text-xs ${
                idx < currentStep
                  ? "text-green-600"
                  : idx === currentStep - 1
                  ? "text-white font-medium"
                  : "text-neutral-500"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
