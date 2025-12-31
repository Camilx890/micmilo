import { useState } from "react";
import { FormSidebar } from "./FormSidebar";
import { ManualFieldsSection } from "./ManualFieldsSection";
import { FormSections } from "./FormSections";
import { Button } from "@/components/ui/button";
import { useMicStore } from "@/store/micStore";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

export function Step4Form() {
  const { formData, extractedData, selectedEmpresa, isGenerating, setIsGenerating } = useMicStore();
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleGenerateXML = async () => {
    // 1. Validar campos obligatorios
    const validaciones = [
      { campo: 'valorFot', nombre: 'Valor FOT' },
      { campo: 'valorFlete', nombre: 'Valor Flete' },
      { campo: 'ruta', nombre: 'Ruta' },
      { campo: 'ciudadDestinoCodigo', nombre: 'Ciudad destino final (Campo 8)' },
      { campo: 'ciudadDestinoCodigoNumerico', nombre: 'Código Campo 8' },
      { campo: 'aduanaDestinoCodigo', nombre: 'Aduana de destino (Campo 24)' },
      { campo: 'aduanaDestinoCodigoNumerico', nombre: 'Código Campo 24' }
    ];

    const camposFaltantes = validaciones
      .filter(v => !formData[v.campo as keyof typeof formData])
      .map(v => v.nombre);

    if (camposFaltantes.length > 0) {
      toast.error(`Campos faltantes: ${camposFaltantes.join(', ')}`);
      return;
    }

    // 2. Construir el objeto con todos los datos del formulario
    const xmlData = {
      // Campos manuales
      "valor-fot": formData.valorFot,
      "valor-flete": formData.valorFlete,
      "valor-seguro": formData.valorSeguro || "0",
      "ruta": formData.ruta,
      
      // Campo permiso-resolucion
      "permiso-resolucion": formData.permisoResolucion || "",
      
      // Campo 8: Ciudad destino final
      "campo8": {
        "aduana_codigo": formData.ciudadDestinoCodigo,
        "codigo_manual": formData.ciudadDestinoCodigoNumerico,
        "nombre_deposito": formData.depositoFiscalNombre || "",
        "codigo_deposito": formData.depositoFiscalCodigo || ""
      },
      
      // Campo 24: Aduana de destino
      "campo24": {
        "aduana_codigo": formData.aduanaDestinoCodigo,
        "codigo_manual": formData.aduanaDestinoCodigoNumerico,
        "nombre_deposito": formData.aduanaDestinoDepositoNombre || "",
        "codigo_deposito": formData.aduanaDestinoDepositoCodigo || ""
      },

      // Empresa seleccionada
      "empresa": selectedEmpresa ? {
        "id": selectedEmpresa.id,
        "login": selectedEmpresa.login,
        "nombre": selectedEmpresa.nombre_display
      } : null,

      // Todos los datos del formulario
      "formData": {
        // Porteador
        "porteador_nombre": formData.porteadorNombre,
        "porteador_pais": formData.porteadorPais,
        "porteador_comuna": formData.porteadorComuna,
        "porteador_domicilio": formData.porteadorDomicilio,
        "tipo_identificador": formData.tipoIdentificador,
        "rol_contribuyente": formData.rolContribuyente,
        "tipo_identificador2": formData.tipoIdentificador2,
        "rol_contribuyente2": formData.rolContribuyente2,
        
        // Tránsito
        "transito_aduanero": formData.transitoAduanero,
        "tipo_operacion": formData.tipoOperacion,
        "tipo_carga": formData.tipoCarga,
        "tipo_transito": formData.tipoTransito,
        "numero_referencia": formData.numeroReferencia,
        "contenedor1": formData.contenedor1,
        "contenedor2": formData.contenedor2,
        
        // Fechas
        "hoja_folha": formData.hojaFolha,
        "fecha_emision": formData.fechaEmision,
        
        // Aduana de partida (fijo)
        "aduana_partida_codigo": formData.aduanaPartidaCodigo,
        "aduana_partida_descripcion": formData.aduanaPartidaDescripcion,
        "aduana_partida_codigo_numerico": formData.aduanaPartidaCodigoNumerico,
        
        // Propietario
        "propietario_nombre": formData.propietarioNombre,
        "propietario_pais": formData.propietarioPais,
        "propietario_comuna": formData.propietarioComuna,
        "propietario_domicilio": formData.propietarioDomicilio,
        "propietario_tipo_id": formData.propietarioTipoId,
        "propietario_rol": formData.propietarioRol,
        
        // Vehículo
        "placa_camion": formData.placaCamion,
        "pais_placa": formData.paisPlaca,
        "marca": formData.marca,
        "chassis": formData.chassis,
        "capacidad_arrastre": formData.capacidadArrastre,
        "anio": formData.anio,
        "tipo_remolque": formData.tipoRemolque,
        "placa_remolque": formData.placaRemolque,
        "pais_remolque": formData.paisRemolque,
        
        // Carta porte
        "numero_carta_porte": formData.numeroCartaPorte,
        "es_parcial": formData.esParcial,
        
        // Valores
        "moneda": formData.moneda,
        "origen_mercancias": formData.origenMercancias,
        "origen_mercancias_codigo": formData.origenMercanciasCodigo,
        
        // Bultos
        "tipo_bultos": formData.tipoBultos,
        "tipo_bultos_codigo": formData.tipoBultosCodigo,
        "contenedor_vacio": formData.contenedorVacio,
        "cantidad_bultos": formData.cantidadBultos,
        "peso_bruto": formData.pesoBruto,
        
        // Participantes
        "remitente_nombre": formData.remitenteNombre,
        "remitente_domicilio": formData.remitenteDomicilio,
        "destinatario_nombre": formData.destinatarioNombre,
        "destinatario_domicilio": formData.destinatarioDomicilio,
        "consignatario_nombre": formData.consignatarioNombre,
        "consignatario_domicilio": formData.consignatarioDomicilio,
        
        // Documentos
        "documentos_anexos": formData.documentosAnexos,
        "numero_precintos": formData.numeroPrecintos,
        "descripcion_mercancias": formData.descripcionMercancias,
        
        // Conductor
        "tipo_id_conductor": formData.tipoIdConductor,
        "id_conductor": formData.idConductor,
        "nombre_conductor": formData.nombreConductor
      },
      
      // Datos extraídos del paso 3 (CRT + MIC Entrada)
      ...extractedData
    };

    // 3. Llamar al backend Python para GENERAR el XML
    setIsGenerating(true);
    setLoadingMessage("Generando XML...");

    const backendUrl = 'http://72.60.13.178:8004/generate-xml';
    
    console.log('🚀 Llamando a backend:', backendUrl);
    console.log('📦 Datos enviados:', JSON.stringify(xmlData, null, 2));

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(xmlData)
      });

      console.log('✅ Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(errorText || 'Error al generar XML');
      }

      // 4. El backend retorna el archivo XML
      const blob = await response.blob();
      console.log('📄 Blob recibido:', { size: blob.size, type: blob.type });

      // 5. Descargar automáticamente
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MIC_${formData.numeroReferencia || Date.now()}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('✅ XML descargado exitosamente');
      toast.success('✅ XML generado correctamente');

    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Error name:', error instanceof Error ? error.name : 'Unknown');
      console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
      toast.error('Error al generar XML: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsGenerating(false);
      setLoadingMessage("");
    }
  };

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

          {/* Generate XML Button */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-4 pb-6">
            <Button
              onClick={handleGenerateXML}
              disabled={isGenerating}
              size="lg"
              className="w-full text-lg py-6"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {loadingMessage || "Generando..."}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generar XML
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
