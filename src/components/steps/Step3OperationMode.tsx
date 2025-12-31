import { useState } from "react";
import { ChevronLeft, Loader2, FileSearch, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMicStore } from "@/store/micStore";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://api.allorigins.win/raw?url=http://72.60.13.178:8004";
const N8N_WEBHOOK_URL = "https://n8n-n8n.qenbep.easypanel.host/webhook/extract-mic-entrada";

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
  const [loadingMessage, setLoadingMessage] = useState("");

  // Generate random 5-digit reference number
  const generateRandomReference = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  // Build permiso-resolucion string from MIC Entrada data
  const buildPermisoResolucion = (micData: any): string => {
    if (!micData) {
      return "PERMISO. 8229/2025 VTO. 07/01/2026 SEGURO. RCT-LP0201-40032-0 VTO. 07/03/2026";
    }
    
    const parts: string[] = [];
    
    if (micData.permiso?.numero) {
      parts.push(`PERMISO. ${micData.permiso.numero}`);
      if (micData.permiso?.vencimiento) {
        parts.push(`VTO. ${micData.permiso.vencimiento}`);
      }
    }
    
    if (micData.seguro?.numero) {
      parts.push(`SEGURO. ${micData.seguro.numero}`);
      if (micData.seguro?.vencimiento) {
        parts.push(`VTO. ${micData.seguro.vencimiento}`);
      }
    }
    
    return parts.length > 0 ? parts.join(' ') : "";
  };

  // Extract MIC Entrada data from n8n webhook
  const extractMICEntrada = async (file: File): Promise<any | null> => {
    const formData = new FormData();
    formData.append('file0', file);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        
        // El webhook devuelve un array: [{success: true, data: {...}}]
        if (Array.isArray(result) && result.length > 0) {
          const item = result[0];
          if (item.success) {
            console.log('✓ Datos del MIC Entrada extraídos:', item.data);
            return item.data;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error extrayendo MIC Entrada:', error);
      return null;
    }
  };

  // Main extraction handler with n8n webhook call
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
      // 1. Extract MIC Entrada data from n8n webhook (if file exists)
      let micEntradaData = null;
      if (micEntradaFile) {
        setLoadingMessage("Extrayendo datos del MIC Entrada...");
        micEntradaData = await extractMICEntrada(micEntradaFile);
        
        if (micEntradaData) {
          toast({
            title: "MIC Entrada procesado",
            description: "Datos del conductor y vehículo extraídos correctamente",
          });
        } else {
          toast({
            title: "Advertencia",
            description: "No se pudieron extraer datos del MIC Entrada, continuando...",
            variant: "destructive",
          });
        }
      }

      // 2. Call Python backend with CRT and extracted MIC data
      setLoadingMessage("Procesando CRT y generando datos...");
      
      const formDataBackend = new FormData();
      formDataBackend.append('crt_file', crtFile);
      formDataBackend.append('company_id', selectedEmpresa.id);
      formDataBackend.append('mode', conApoyo ? 'con_apoyo' : 'sin_apoyo');
      
      // Send extracted MIC data as JSON string (not the PDF file)
      if (micEntradaData) {
        formDataBackend.append('mic_entrada_data', JSON.stringify(micEntradaData));
      }

      const response = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        body: formDataBackend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al procesar el CRT");
      }

      const data = await response.json();
      
      if (data.success) {
        setExtractedData(data.data);
        
        const numeroReferencia = generateRandomReference();
        
        // Pre-fill form with company data + MIC Entrada data
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
          numeroMic: "",
          numeroReferencia: numeroReferencia,
          // MIC Entrada data (if available)
          ...(micEntradaData && {
            permisoResolucion: buildPermisoResolucion(micEntradaData),
            propietarioNombre: micEntradaData.propietario?.nombre || "",
            propietarioDomicilio: micEntradaData.propietario?.direccion || "",
            propietarioRol: micEntradaData.propietario?.rol || "",
            placaCamion: micEntradaData.camion?.placa || "",
            marca: micEntradaData.camion?.marca || "",
            chassis: micEntradaData.camion?.chassis || "",
            capacidadArrastre: micEntradaData.camion?.capacidad || "",
            anio: micEntradaData.camion?.anio || "",
            paisPlaca: micEntradaData.camion?.pais || "BO",
            placaRemolque: micEntradaData.remolque?.placa || "",
            nombreConductor: micEntradaData.conductor?.nombre || "",
            tipoIdConductor: micEntradaData.conductor?.tipo_id || "",
            idConductor: micEntradaData.conductor?.identificador || "",
          }),
        });

        toast({
          title: "Extracción exitosa",
          description: `Datos extraídos. Referencia: ${numeroReferencia}`,
        });
        
        setCurrentStep(4);
      } else {
        throw new Error(data.message || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error en extracción:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
      setLoadingMessage("");
    }
  };

  // Demo extraction with real n8n webhook call for MIC Entrada
  const handleDemoExtract = async () => {
    setIsExtracting(true);
    
    try {
      // 1. Try to extract MIC Entrada data from n8n webhook (real call)
      let micEntradaData = null;
      if (micEntradaFile) {
        setLoadingMessage("Extrayendo datos del MIC Entrada...");
        micEntradaData = await extractMICEntrada(micEntradaFile);
        
        if (micEntradaData) {
          toast({
            title: "MIC Entrada procesado",
            description: "Datos del conductor y vehículo extraídos correctamente",
          });
        } else {
          toast({
            title: "Advertencia",
            description: "No se pudieron extraer datos del MIC Entrada, usando datos demo...",
            variant: "destructive",
          });
        }
      }

      // 2. Simulate CRT extraction (demo mode)
      setLoadingMessage("Procesando CRT (modo demo)...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const numeroReferencia = generateRandomReference();
      
      // Pre-fill form with company data + real MIC Entrada data (if available) + demo CRT data
      if (selectedEmpresa) {
        updateFormData({
          // Company data
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
          numeroMic: "",
          numeroReferencia: numeroReferencia,
          
          // MIC Entrada data (real if available, otherwise demo)
          permisoResolucion: buildPermisoResolucion(micEntradaData),
          propietarioNombre: micEntradaData?.propietario?.nombre || "A-CIEN S.R.L.",
          propietarioDomicilio: micEntradaData?.propietario?.direccion || "VILLA MODERNA, RENE CRESPO, 115",
          propietarioRol: micEntradaData?.propietario?.rol || "187230027",
          propietarioPais: "BO",
          placaCamion: micEntradaData?.camion?.placa || "2150AHS",
          marca: micEntradaData?.camion?.marca || "VOLVO",
          chassis: micEntradaData?.camion?.chassis || "4VG7DAGH2WN750071",
          capacidadArrastre: micEntradaData?.camion?.capacidad || "30",
          anio: micEntradaData?.camion?.anio || "1998",
          paisPlaca: micEntradaData?.camion?.pais || "BO",
          placaRemolque: micEntradaData?.remolque?.placa || "2150AHS",
          paisRemolque: "BO",
          tipoRemolque: "Semiremolque",
          nombreConductor: micEntradaData?.conductor?.nombre || "LUIS GONZALEZ HUANCA QUISPE",
          tipoIdConductor: micEntradaData?.conductor?.tipo_id || "CI.",
          idConductor: micEntradaData?.conductor?.identificador || "2204301",
          
          // Demo CRT data
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

      setExtractedData({ demo: true, micEntradaData });
      
      toast({
        title: micEntradaData ? "Extracción completada" : "Extracción simulada",
        description: `Datos cargados. Referencia: ${numeroReferencia}`,
      });
      
      setCurrentStep(4);
    } catch (error) {
      console.error("Error en extracción demo:", error);
      toast({
        title: "Error",
        description: "Error al extraer datos",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
      setLoadingMessage("");
    }
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
                MIC Entrada: {micEntradaFile ? "Listo (se extraerá via n8n)" : "No subido (opcional)"}
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

      {/* Loading Message */}
      {isExtracting && loadingMessage && (
        <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-primary">{loadingMessage}</span>
        </div>
      )}

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
            {loadingMessage || "Extrayendo datos..."}
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
