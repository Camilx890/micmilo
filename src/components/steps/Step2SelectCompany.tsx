import { useState, useMemo } from "react";
import { Building2, Search, MapPin, FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMicStore, Empresa } from "@/store/micStore";
import { cn } from "@/lib/utils";
import empresasConfig from "@/data/empresas_config.json";

export function Step2SelectCompany() {
  const { selectedEmpresa, setSelectedEmpresa, setCurrentStep } = useMicStore();
  const [searchTerm, setSearchTerm] = useState("");

  const empresas: Empresa[] = empresasConfig.empresas;

  const filteredEmpresas = useMemo(() => {
    return empresas
      .filter((emp) =>
        emp.nombre_display.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.nombre_display.localeCompare(b.nombre_display));
  }, [empresas, searchTerm]);

  const canProceed = !!selectedEmpresa;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Seleccionar Empresa</h1>
        <p className="text-muted-foreground">
          Elige la empresa porteadora para este manifiesto
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredEmpresas.map((empresa) => (
          <Card
            key={empresa.id}
            onClick={() => setSelectedEmpresa(empresa)}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedEmpresa?.id === empresa.id
                ? "ring-2 ring-primary border-primary bg-primary/5"
                : "hover:border-primary/50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    selectedEmpresa?.id === empresa.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {empresa.nombre_display}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {empresa.campo_1_porteador.pais_nombre}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {empresa.campo_2_rol_contribuyente.tipo_id}: {empresa.campo_2_rol_contribuyente.valor_id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmpresas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron empresas con "{searchTerm}"
        </div>
      )}

      {/* Selected Company Preview */}
      {selectedEmpresa && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">Empresa Seleccionada</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Nombre</p>
                <p className="font-medium">{selectedEmpresa.nombre_display}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Identificación</p>
                <p className="font-medium font-mono">
                  {selectedEmpresa.campo_2_rol_contribuyente.tipo_id}: {selectedEmpresa.campo_2_rol_contribuyente.valor_id}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground">Dirección</p>
                <p className="font-medium">{selectedEmpresa.campo_1_porteador.domicilio}</p>
              </div>
              <div>
                <p className="text-muted-foreground">País</p>
                <p className="font-medium">{selectedEmpresa.campo_1_porteador.pais_nombre}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setCurrentStep(1)}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Atrás
        </Button>
        <Button
          size="lg"
          disabled={!canProceed}
          onClick={() => setCurrentStep(3)}
          className="min-w-[140px]"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
