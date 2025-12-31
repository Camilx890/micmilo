import { FormSidebar } from "./FormSidebar";
import { ManualFieldsSection } from "./ManualFieldsSection";
import { FormSections } from "./FormSections";

export function Step4Form() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <FormSidebar />

      {/* Main Form Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Formulario MIC/DTA
            </h1>
            <p className="text-muted-foreground">
              Revisa y completa los datos extraídos. Los campos destacados en
              amarillo son obligatorios.
            </p>
          </div>

          {/* Manual Fields - Always Visible */}
          <ManualFieldsSection />

          {/* Other Sections */}
          <FormSections />
        </div>
      </main>
    </div>
  );
}
