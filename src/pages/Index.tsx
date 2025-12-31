import { FileSpreadsheet, Ship } from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";
import { Step1FileUpload } from "@/components/steps/Step1FileUpload";
import { Step2SelectCompany } from "@/components/steps/Step2SelectCompany";
import { Step3OperationMode } from "@/components/steps/Step3OperationMode";
import { Step4Form } from "@/components/form/Step4Form";
import { useMicStore } from "@/store/micStore";

const Index = () => {
  const { currentStep } = useMicStore();

  // Step 4 has its own layout with sidebar
  if (currentStep === 4) {
    return <Step4Form />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Ship className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Generador MIC/DTA
                </h1>
                <p className="text-xs text-muted-foreground">
                  Aduana de Chile - XML Automático
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <StepIndicator currentStep={currentStep} />
            </div>
          </div>
          <div className="md:hidden mt-4">
            <StepIndicator currentStep={currentStep} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentStep === 1 && <Step1FileUpload />}
        {currentStep === 2 && <Step2SelectCompany />}
        {currentStep === 3 && <Step3OperationMode />}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Sistema de generación automática de XML MIC/DTA para la Aduana de
            Chile
          </p>
          <p className="mt-1">
            Reduce 95 campos manuales a solo 4 mediante extracción automática
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
