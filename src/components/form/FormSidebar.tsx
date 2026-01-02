import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Building2,
  Settings2,
  Edit2,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMicStore } from "@/store/micStore";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://api.xn--salteeriamaria-unb.com:9443";

export function FormSidebar() {
  const {
    crtFile,
    micEntradaFile,
    selectedEmpresa,
    conApoyo,
    formData,
    isGenerating,
    setIsGenerating,
    setCurrentStep,
    resetAll,
  } = useMicStore();
  const { toast } = useToast();

  const manualFieldsComplete =
    formData.valorFot.trim() !== "" &&
    formData.valorFlete.trim() !== "" &&
    formData.ruta.trim() !== "";

  const handleGenerateXml = async () => {
    if (!manualFieldsComplete) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa los campos obligatorios (Valor FOT, Flete y Ruta)",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-xml`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          empresa: selectedEmpresa,
          conApoyo,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar el XML");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MIC_${formData.numeroReferencia || "documento"}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "XML generado correctamente",
        description: "El archivo se ha descargado automáticamente",
      });
    } catch (error) {
      // Demo mode - create a sample XML download
      const xmlContent = generateDemoXml();
      const blob = new Blob([xmlContent], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MIC_${formData.numeroReferencia || "demo"}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "XML generado (demo)",
        description: "Archivo de demostración descargado",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDemoXml = () => {
    return `<?xml version="1.0" encoding="ISO-8859-1"?>
<MIC-DTA>
  <header>
    <id-sender>MIC-DTA 1.0</id-sender>
    <fecha-emision>${formData.fechaEmision}</fecha-emision>
    <numero-referencia>${formData.numeroReferencia}</numero-referencia>
  </header>
  <porteador>
    <nombre>${formData.porteadorNombre}</nombre>
    <pais>${formData.porteadorPais}</pais>
    <domicilio>${formData.porteadorDomicilio}</domicilio>
    <identificacion tipo="${formData.tipoIdentificador}">${formData.rolContribuyente}</identificacion>
  </porteador>
  <valores>
    <valor-fot moneda="${formData.moneda}">${formData.valorFot}</valor-fot>
    <valor-flete moneda="${formData.moneda}">${formData.valorFlete}</valor-flete>
    <valor-seguro moneda="${formData.moneda}">${formData.valorSeguro || "0"}</valor-seguro>
  </valores>
  <ruta>${formData.ruta}</ruta>
  <mercancias>
    <descripcion>${formData.descripcionMercancias}</descripcion>
    <cantidad-bultos>${formData.cantidadBultos}</cantidad-bultos>
    <peso-bruto unidad="kg">${formData.pesoBruto}</peso-bruto>
  </mercancias>
</MIC-DTA>`;
  };

  return (
    <aside className="w-80 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold">Resumen</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Files Summary */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wide text-sidebar-foreground/60">
            Archivos
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-success" />
              <span className="truncate">{crtFile?.name || "CRT.xlsx"}</span>
            </div>
            {micEntradaFile && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-info" />
                <span className="truncate">{micEntradaFile.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Company */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wide text-sidebar-foreground/60">
            Empresa
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="truncate">{selectedEmpresa?.nombre_display}</span>
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wide text-sidebar-foreground/60">
            Modo
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <Settings2 className="w-4 h-4" />
            <span>{conApoyo ? "Con Apoyo" : "Sin Apoyo"}</span>
          </div>
        </div>

        {/* Edit Link */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={() => setCurrentStep(1)}
        >
          <Edit2 className="w-4 h-4" />
          Editar configuración
        </Button>

        {/* Stats */}
        <div className="space-y-2 pt-4 border-t border-sidebar-border">
          <h3 className="text-xs uppercase tracking-wide text-sidebar-foreground/60">
            Estadísticas
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Campos auto-completados
              </span>
              <span className="font-mono font-bold">91</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Campos manuales
              </span>
              <span className="font-mono font-bold text-warning">4</span>
            </div>
          </div>
        </div>

        {/* Manual Fields Status */}
        <div className="space-y-2 pt-4 border-t border-sidebar-border">
          <h3 className="text-xs uppercase tracking-wide text-sidebar-foreground/60">
            Campos Manuales
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              {formData.valorFot ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              )}
              <span className={formData.valorFot ? "text-success" : "text-warning"}>
                Valor FOT
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.valorFlete ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              )}
              <span className={formData.valorFlete ? "text-success" : "text-warning"}>
                Valor Flete
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.valorSeguro ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-sidebar-foreground/30" />
              )}
              <span className="text-sidebar-foreground/70">
                Valor Seguro (opcional)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.ruta ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              )}
              <span className={formData.ruta ? "text-success" : "text-warning"}>
                Ruta
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={handleGenerateXml}
          disabled={isGenerating || !manualFieldsComplete}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Generar XML
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 text-sidebar-foreground/70"
          onClick={resetAll}
        >
          <RotateCcw className="w-4 h-4" />
          Nuevo MIC
        </Button>
      </div>
    </aside>
  );
}
