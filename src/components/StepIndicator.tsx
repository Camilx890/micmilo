import { Check, FileSpreadsheet, Building2, Settings2, FileText } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Archivos", icon: FileSpreadsheet },
  { number: 2, label: "Empresa", icon: Building2 },
  { number: 3, label: "Modo", icon: Settings2 },
  { number: 4, label: "Formulario", icon: FileText },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center py-6">
      {steps.map((step, index) => {
        const isComplete = currentStep > step.number;
        const isActive = currentStep === step.number;
        const Icon = step.icon;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300 relative
                  ${isComplete 
                    ? "bg-success text-success-foreground" 
                    : isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium transition-colors
                  ${isActive 
                    ? "text-primary" 
                    : isComplete 
                      ? "text-success" 
                      : "text-muted-foreground"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`
                  w-16 h-0.5 mx-2 transition-all duration-300
                  ${currentStep > step.number 
                    ? "bg-success" 
                    : currentStep === step.number 
                      ? "bg-gradient-to-r from-primary to-muted" 
                      : "bg-muted"
                  }
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
