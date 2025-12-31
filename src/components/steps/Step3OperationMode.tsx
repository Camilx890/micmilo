import { useState } from "react";
import { ChevronLeft, Loader2, Zap, FileSearch, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMicStore } from "@/store/micStore";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://72.60.13.178:8004";

export function Step3OperationMode() {
  const {
    conApoyo,
    setConApoyo,
    setCurrentStep,
    crtFile,
    micEntradaFile,
    selectedEmpresa,
    isExtracting,
    setIsExtracting,
    setExtractedData,
    updateFormData,
  } = useMicStore();
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!crtFile || !selectedEmpresa) {
      toast({
        title: "Error",
        description: "Faltan archivos o empresa seleccionada",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("crt_file", crtFile);
      if (micEntradaFile) {
        formData.append("mic_entrada_file", micEntradaFile);
      }
      formData.append("company_id", selectedEmpresa.id);
      formData.append("mode", conApoyo ? "con_apoyo" : "sin_apoyo");

      const response = await fetch(`${API_BASE_URL}/extract`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al extraer datos");
      }

      const data = await response.json();
      
      if (data.success) {
        setExtractedData(data.data);
        
        // Pre-fill form with company data
        updateFormData({
          porteadorNombre: selectedEmpresa.campo_1_porteador.nombre,
          porteadorPais: selectedEmpresa.campo_1_porteador.pais,
          porteadorComuna: selectedEmpresa.campo_1_porteador.comuna,
          porteadorDomicilio: selectedEmpresa.campo_1_porteador.domicilio,
          tipoIdentificador: selectedEmpresa.campo_2_rol_contribuyente.tipo_id,
          rolContribuyente: selectedEmpresa.campo_2_rol_contribuyente.valor_id,
          tipoIdentificador2: selectedEmpresa.campo_2_rol_contribuyente.tipo_id2,
          rolContribuyente2: selectedEmpresa.campo_2_rol_contribuyente.valor_id2,
          tipoCarga: selectedEmpresa.datos_xml["tipo-carga"],
          tipoTransito: selectedEmpresa.datos_xml["tipo-transito"],
          moneda: selectedEmpresa.datos_xml.moneda,
        });

        toast({
          title: "Extracción exitosa",
          description: "Los datos han sido extraídos correctamente",
        });
        
        setCurrentStep(4);
      } else {
        throw new Error(data.message || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error extracting data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  // For demo without backend, simulate extraction
  const handleDemoExtract = () => {
    setIsExtracting(true);
    
    setTimeout(() => {
      // Pre-fill form with company data
      if (selectedEmpresa) {
        updateFormData({
          porteadorNombre: selectedEmpresa.campo_1_porteador.nombre,
          porteadorPais: selectedEmpresa.campo_1_porteador.pais,
          porteadorComuna: selectedEmpresa.campo_1_porteador.comuna,
          porteadorDomicilio: selectedEmpresa.campo_1_porteador.domicilio,
          tipoIdentificador: selectedEmpresa.campo_2_rol_contribuyente.tipo_id,
          rolContribuyente: selectedEmpresa.campo_2_rol_contribuyente.valor_id,
          tipoIdentificador2: selectedEmpresa.campo_2_rol_contribuyente.tipo_id2,
          rolContribuyente2: selectedEmpresa.campo_2_rol_contribuyente.valor_id2,
          tipoCarga: selectedEmpresa.datos_xml["tipo-carga"],
          tipoTransito: selectedEmpresa.datos_xml["tipo-transito"],
          moneda: selectedEmpresa.datos_xml.moneda,
          // Demo data
          numeroMic: "MIC-2025-001234",
          numeroReferencia: "REF-2025-001234",
          contenedor1: "MSKU1234567",
          numeroCartaPorte: "CRT-2025-001234",
          cantidadBultos: "150",
          pesoBruto: "24500",
          remitenteNombre: "EMPRESA EXPORTADORA EJEMPLO S.A.",
          remitenteDomicilio: "Av. Industrial 123, Santiago, Chile",
          destinatarioNombre: "IMPORTADORA DESTINO S.R.L.",
          destinatarioDomicilio: "Calle Comercio 456, La Paz, Bolivia",
          consignatarioNombre: "CONSIGNATARIO FINAL LTDA.",
          consignatarioDomicilio: "Zona Industrial Sur, Santa Cruz, Bolivia",
          descripcionMercancias: "Mercancías varias según CRT adjunto",
        });
      }

      setExtractedData({ demo: true });
      setIsExtracting(false);
      
      toast({
        title: "Extracción simulada",
        description: "Datos de demostración cargados correctamente",
      });
      
      setCurrentStep(4);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Modo de Operación</h1>
        <p className="text-muted-foreground">
          Configura cómo se procesarán los datos
        </p>
      </div>

      {/* Mode Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="apoyo-mode" className="text-lg font-semibold">
                Modo de Apoyo
              </Label>
              <p className="text-sm text-muted-foreground">
                {conApoyo
                  ? "Se incluirán datos del propietario del vehículo del MIC Entrada"
                  : "Solo se usarán datos del CRT y la empresa seleccionada"}
              </p>
            </div>
            <Switch
              id="apoyo-mode"
              checked={conApoyo}
              onCheckedChange={setConApoyo}
            />
          </div>

          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-info shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {conApoyo ? "CON APOYO" : "SIN APOYO"}
                </p>
                <p className="text-muted-foreground mt-1">
                  {conApoyo
                    ? "Los datos del propietario del camión se extraerán del MIC Entrada PDF si fue subido."
                    : "Solo los datos del CRT serán procesados. Los datos del conductor y vehículo deberán completarse manualmente si no se subió MIC Entrada."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold text-primary mb-4">Resumen de Configuración</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Archivo CRT: Listo</span>
            </div>
            <div className="flex items-center gap-2">
              {micEntradaFile ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <AlertCircle className="w-4 h-4 text-warning" />
              )}
              <span>
                MIC Entrada: {micEntradaFile ? "Listo" : "No subido (opcional)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Empresa: {selectedEmpresa?.nombre_display}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Modo: {conApoyo ? "Con Apoyo" : "Sin Apoyo"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extract Button */}
      <Button
        size="lg"
        className="w-full h-14 text-lg gap-3"
        onClick={handleDemoExtract}
        disabled={isExtracting}
      >
        {isExtracting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Extrayendo datos del CRT y procesando...
          </>
        ) : (
          <>
            <FileSearch className="w-5 h-5" />
            Extraer Datos
          </>
        )}
      </Button>

      {/* Navigation */}
      <div className="flex justify-start pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setCurrentStep(2)}
          className="gap-2"
          disabled={isExtracting}
        >
          <ChevronLeft className="w-4 h-4" />
          Atrás
        </Button>
      </div>
    </div>
  );
}
