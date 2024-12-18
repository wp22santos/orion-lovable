import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

export const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute top-4 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-police-primary transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                          border-2 transition-all duration-300 z-10
                          ${index <= currentStep 
                            ? 'bg-police-primary border-police-primary text-white' 
                            : 'bg-white border-gray-300'}`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-police-dark">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};