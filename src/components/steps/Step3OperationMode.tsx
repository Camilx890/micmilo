import { useState } from "react";
import { ChevronLeft, Loader2, FileSearch, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMicStore } from "@/store/micStore";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://api.xn--salteeriamaria-unb.com:9443";
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
    formData,
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
        console.log('🔍 Respuesta RAW del webhook n8n:', result);
        console.log('🔍 Tipo de respuesta:', typeof result, Array.isArray(result) ? 'es array' : 'no es array');
        
        // El webhook puede devolver directamente el objeto o un array
        let micData = null;
        
        if (Array.isArray(result) && result.length > 0) {
          const item = result[0];
          console.log('🔍 Primer item del array:', item);
          if (item.success && item.data) {
            micData = item.data;
          }
        } else if (result.success && result.data) {
          // Respuesta directa (no array)
          console.log('🔍 Respuesta directa (no array):', result);
          micData = result.data;
        }
        
        if (micData) {
          console.log('🔍 ========== DEBUG GUARDAR DATOS PROPIETARIO ==========');
          console.log('🔍 Modo operación (conApoyo):', conApoyo);
          console.log('🔍 Empresa seleccionada:', selectedEmpresa?.nombre_display);
          console.log('🔍 Datos MIC Entrada propietario:', micData.propietario);
          console.log('🔍 ========== GUARDANDO EN FORMDATA ==========');
          console.log('✅ Datos del MIC Entrada extraídos:', micData);
          console.log('🔍 Propietario:', micData.propietario);
          console.log('🔍 Camión:', micData.camion);
          console.log('🔍 Remolque:', micData.remolque);
          console.log('🔍 Conductor:', micData.conductor);
          console.log('🔍 Permiso:', micData.permiso);
          console.log('🔍 Seguro:', micData.seguro);
          return micData;
        } else {
          console.warn('⚠️ No se encontraron datos en la respuesta:', result);
        }
      } else {
        console.error('❌ Response no OK:', response.status, response.statusText);
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

      // ========== LOGGING DETALLADO ==========
      console.log('📤 ========== ENVIANDO ARCHIVO CRT ==========');
      console.log('📤 Archivo CRT:', {
        name: crtFile.name,
        size: crtFile.size,
        type: crtFile.type,
        lastModified: new Date(crtFile.lastModified).toISOString()
      });
      console.log('📤 URL destino:', `${API_BASE_URL}/extract`);
      console.log('📤 Company ID:', selectedEmpresa.id);
      console.log('📤 Mode:', conApoyo ? 'con_apoyo' : 'sin_apoyo');
      console.log('📤 MIC Entrada Data:', micEntradaData ? 'presente' : 'no presente');
      
      // Log FormData entries
      console.log('📤 FormData entries:');
      for (const [key, value] of formDataBackend.entries()) {
        if (value instanceof File) {
          console.log(`   - ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`   - ${key}: ${typeof value === 'string' && value.length > 100 ? value.substring(0, 100) + '...' : value}`);
        }
      }
      console.log('📤 ==========================================');

      const response = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        body: formDataBackend
      });

      // ========== LOGGING RESPUESTA ==========
      console.log('📥 ========== RESPUESTA DEL BACKEND ==========');
      console.log('📥 Response status:', response.status, response.statusText);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📥 Response raw text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📥 Response parsed JSON:', data);
      } catch (parseError) {
        console.error('❌ No es JSON válido:', responseText);
        throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 200)}`);
      }
      console.log('📥 ==========================================');

      if (!response.ok) {
        throw new Error(data.message || `Error del servidor: ${response.status}`);
      }
      
      // ========== LOGGING EXTENSIVO DE RESPUESTA ==========
      console.log('🔍 ========== RESPUESTA /extract COMPLETA ==========');
      console.log('🔍 Success:', data.success);
      console.log('🔍 Keys de la respuesta:', Object.keys(data));
      console.log('🔍 Respuesta completa JSON:', JSON.stringify(data, null, 2));
      
      // Verificar ambas posibles estructuras de datos CRT
      console.log('🔍 --- BUSCANDO DATOS CRT ---');
      console.log('🔍 data.datos_crt (snake_case):', data.datos_crt);
      console.log('🔍 data.crt_extracted:', data.crt_extracted);
      console.log('🔍 data.data:', data.data);
      console.log('🔍 data.data?.crt_extracted:', data.data?.crt_extracted);
      console.log('🔍 data.data?.datos_crt:', data.data?.datos_crt);
      
      // USAR LA ESTRUCTURA CORRECTA: datos_crt o crt_extracted
      const crtData = data.datos_crt || data.crt_extracted || data.data?.crt_extracted || data.data?.datos_crt || {};
      
      console.log('🔍 --- DATOS CRT ENCONTRADOS ---');
      console.log('🔍 crtData:', crtData);
      console.log('🔍 Campos recibidos:', Object.keys(crtData));
      
      // Log de cada campo específico (USANDO NOMBRES PASCALCASE DEL BACKEND)
      console.log('🔍 --- CAMPOS ESPECÍFICOS (PascalCase) ---');
      console.log('🔍 NombreRemitente:', crtData.NombreRemitente);
      console.log('🔍 DomicilioRemitente:', crtData.DomicilioRemitente);
      console.log('🔍 NombreDestinatario:', crtData.NombreDestinatario);
      console.log('🔍 DomicilioDestinatario:', crtData.DomicilioDestinatario);
      console.log('🔍 NombreConsignatario:', crtData.NombreConsignatario);
      console.log('🔍 DomicilioConsignatario:', crtData.DomicilioConsignatario);
      console.log('🔍 DescripcionMercancias:', crtData.DescripcionMercancias);
      console.log('🔍 PesoBruto:', crtData.PesoBruto);
      console.log('🔍 CantidadBultos:', crtData.CantidadBultos);
      console.log('🔍 TipoBultos:', crtData.TipoBultos);
      console.log('🔍 Contenedor1:', crtData.Contenedor1);
      console.log('🔍 Contenedor2:', crtData.Contenedor2);
      console.log('🔍 NumeroCartaPorte:', crtData.NumeroCartaPorte);
      console.log('🔍 NumeroPrecintos:', crtData.NumeroPrecintos);
      console.log('🔍 DocumentosAnexos:', crtData.DocumentosAnexos);
      console.log('🔍 DestinoFinal:', crtData.DestinoFinal);
      console.log('🔍 CodigoDestinoFinal:', crtData.CodigoDestinoFinal);
      console.log('🔍 ValorFOT:', crtData.ValorFOT);
      console.log('🔍 ValorFlete:', crtData.ValorFlete);
      console.log('🔍 ================================================');
      
      if (data.success) {
        setExtractedData(data.data || data);
        
        const numeroReferencia = generateRandomReference();
        
        // Datos base de la empresa (siempre)
        const datosEmpresa = {
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
        };

        // Datos del vehículo y conductor del MIC (si hay)
        const datosVehiculo = micEntradaData ? {
          placaCamion: micEntradaData.camion?.placa || "",
          marca: micEntradaData.camion?.marca || "",
          chassis: micEntradaData.camion?.chassis || "",
          capacidadArrastre: micEntradaData.camion?.capacidad || "",
          anio: micEntradaData.camion?.anio || "",
          paisPlaca: micEntradaData.camion?.pais || "BO",
          placaRemolque: micEntradaData.remolque?.placa || "",
          paisRemolque: micEntradaData.camion?.pais || "BO",
          nombreConductor: micEntradaData.conductor?.nombre || "",
          tipoIdConductor: micEntradaData.conductor?.tipo_id === "CI" ? "CI." : (micEntradaData.conductor?.tipo_id || ""),
          idConductor: micEntradaData.conductor?.identificador || "",
        } : {};
        
        console.log('🔍 DEBUG datosVehiculo:', datosVehiculo);

        // CONDICIONAL: Datos del propietario y rol2 según modo
        let datosPropietario;
        if (conApoyo && micEntradaData) {
          datosPropietario = {
            propietarioNombre: micEntradaData.propietario?.nombre || "",
            propietarioDomicilio: micEntradaData.propietario?.direccion || "",
            propietarioRol: micEntradaData.propietario?.rol || "",
            propietarioTipoId: "COD/NIT",
            propietarioPais: "BO",
            propietarioComuna: "",
            permisoResolucion: buildPermisoResolucion(micEntradaData),
            tipoIdentificador2: "COD/NIT",
            rolContribuyente2: micEntradaData.propietario?.rol || "",
          };
        } else {
          datosPropietario = {
            propietarioNombre: selectedEmpresa.campo_1_porteador.nombre,
            propietarioDomicilio: selectedEmpresa.campo_1_porteador.domicilio,
            propietarioRol: selectedEmpresa.campo_2_rol_contribuyente.valor_id,
            propietarioTipoId: "RUT",
            propietarioPais: "CL",
            propietarioComuna: selectedEmpresa.campo_1_porteador.comuna,
            permisoResolucion: micEntradaData ? buildPermisoResolucion(micEntradaData) : "",
          };
        }

        // Datos extraídos del CRT - USANDO NOMBRES PASCALCASE DEL BACKEND
        console.log('📝 ========== MAPEANDO CRT A FORMULARIO ==========');
        console.log('📝 crtData objeto completo:', crtData);
        console.log('📝 typeof crtData:', typeof crtData);
        console.log('📝 crtData keys:', Object.keys(crtData || {}));
        console.log('📝 crtData.NombreRemitente:', crtData.NombreRemitente);
        console.log('📝 crtData.DescripcionMercancias:', crtData.DescripcionMercancias);
        console.log('📝 crtData.PesoBruto:', crtData.PesoBruto);
        console.log('📝 crtData.NumeroCartaPorte:', crtData.NumeroCartaPorte);
      console.log('📝 crtData.ValorFOT:', crtData.ValorFOT);
      console.log('📝 crtData.ValorFlete:', crtData.ValorFlete);
        
        const datosCRT = {
          numeroBl: crtData.DocumentosAnexos || '',
          numeroPrecintos: crtData.NumeroPrecintos || '',
          documentosAnexos: crtData.DocumentosAnexos || '',
          remitenteNombre: crtData.NombreRemitente || '',
          remitenteDomicilio: crtData.DomicilioRemitente || '',
          destinatarioNombre: crtData.NombreDestinatario || '',
          destinatarioDomicilio: crtData.DomicilioDestinatario || '',
          consignatarioNombre: crtData.NombreConsignatario || '',
          consignatarioDomicilio: crtData.DomicilioConsignatario || '',
          descripcionMercancias: crtData.DescripcionMercancias || '',
          cantidadBultos: String(crtData.CantidadBultos || ''),
          tipoBultos: crtData.TipoBultos || '',
          pesoBruto: String(crtData.PesoBruto || ''),
          contenedor1: crtData.Contenedor1 || '',
          contenedor2: crtData.Contenedor2 || '',
          numeroCartaPorte: crtData.NumeroCartaPorte || '',
          ciudadDestinoFinal: crtData.DestinoFinal || '',
          ciudadDestinoCodigo: crtData.DestinoFinal || '',
          ciudadDestinoCodigoNumerico: crtData.CodigoDestinoFinal || '',
        valorFot: crtData.ValorFOT || '',
        valorFlete: crtData.ValorFlete || '',
        };

        console.log('📝 datosCRT mapeado:', datosCRT);
        console.log('📝 remitenteNombre después de mapear:', datosCRT.remitenteNombre);
        console.log('📝 descripcionMercancias después de mapear:', datosCRT.descripcionMercancias);
        console.log('📝 ================================================');

        console.log('🔍 ========== DATOS A GUARDAR EN FORMDATA ==========');
        console.log('🔍 datosEmpresa:', datosEmpresa);
        console.log('🔍 datosVehiculo:', datosVehiculo);
        console.log('🔍 datosPropietario:', datosPropietario);
        console.log('🔍 datosCRT:', datosCRT);
        console.log('🔍 ================================================');

        const datosCompletos = {
          ...datosEmpresa,
          ...datosVehiculo,
          ...datosPropietario,
          ...datosCRT,
        };
        
        console.log('🔍 ========== LLAMANDO updateFormData ==========');
        console.log('🔍 Datos completos a guardar:', datosCompletos);
        console.log('🔍 Claves en datosCompletos:', Object.keys(datosCompletos));
        console.log('🔍 remitenteNombre en datosCompletos:', datosCompletos.remitenteNombre);
        console.log('🔍 descripcionMercancias en datosCompletos:', datosCompletos.descripcionMercancias);
        
        // Verificar formData ANTES de actualizar
        console.log('🔴 formData ANTES de updateFormData:', JSON.stringify(formData, null, 2));
        
        updateFormData(datosCompletos);
        
        console.log('✅ updateFormData ejecutado');
        
        toast({
          title: "Extracción exitosa",
          description: `Datos extraídos. Referencia: ${numeroReferencia}`,
        });
        
        // IMPORTANTE: Navegar a Step 4 en el siguiente tick para asegurar que el store se haya actualizado
        // Esto soluciona el problema donde Step4 se montaba antes de que los datos estuvieran en el store
        setTimeout(() => {
          const storeState = useMicStore.getState();
          console.log('🟢 === VERIFICACIÓN POST-UPDATE (setTimeout) ===');
          console.log('🟢 formData DESPUÉS:', JSON.stringify(storeState.formData, null, 2));
          console.log('🟢 remitenteNombre en store:', storeState.formData.remitenteNombre);
          console.log('🟢 descripcionMercancias en store:', storeState.formData.descripcionMercancias);
          console.log('🟢 pesoBruto en store:', storeState.formData.pesoBruto);
          console.log('🟢 numeroBl en store:', storeState.formData.numeroBl);
          
          // Navegar a Step 4 DESPUÉS de que el store se actualizó
          setCurrentStep(4);
        }, 50);
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
      console.log('🔍 ========== GUARDANDO EN STORE ==========');
      console.log('🔍 micEntradaData completo:', micEntradaData);
      console.log('🔍 selectedEmpresa:', selectedEmpresa?.nombre_display);
      
      if (selectedEmpresa) {
        // Datos base de la empresa (siempre)
        const datosEmpresa = {
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
        };

        // Datos del vehículo y conductor (demo o reales del MIC)
        const datosVehiculo = {
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
          // Mapear CI -> CI. porque el dropdown requiere el punto
          tipoIdConductor: micEntradaData?.conductor?.tipo_id === "CI" ? "CI." : (micEntradaData?.conductor?.tipo_id || "CI."),
          idConductor: micEntradaData?.conductor?.identificador || "2204301",
        };

        // CONDICIONAL: Datos del propietario y rol2 según modo
        let datosPropietario;
        if (conApoyo) {
          // CON APOYO: Usar datos del MIC Entrada + rol2 con datos del propietario
          datosPropietario = {
            propietarioNombre: micEntradaData?.propietario?.nombre || "A-CIEN S.R.L.",
            propietarioDomicilio: micEntradaData?.propietario?.direccion || "VILLA MODERNA, RENE CRESPO, 115",
            propietarioRol: micEntradaData?.propietario?.rol || "187230027",
            propietarioTipoId: "COD/NIT",
            propietarioPais: "BO",
            propietarioComuna: "",
            permisoResolucion: buildPermisoResolucion(micEntradaData),
            // En CON APOYO: tipoIdentificador2 y rolContribuyente2 = datos del propietario del MIC
            tipoIdentificador2: "COD/NIT",
            rolContribuyente2: micEntradaData?.propietario?.rol || "187230027",
          };
          console.log('🔍 GUARDADO CON APOYO (DEMO):');
          console.log('  - rolContribuyente2:', micEntradaData?.propietario?.rol || "187230027");
          console.log('  - tipoIdentificador2: COD/NIT');
        } else {
          // SIN APOYO: Usar datos del PORTEADOR (no sobrescribir rol2, mantener de empresa)
          datosPropietario = {
            propietarioNombre: selectedEmpresa.campo_1_porteador.nombre,
            propietarioDomicilio: selectedEmpresa.campo_1_porteador.domicilio,
            propietarioRol: selectedEmpresa.campo_2_rol_contribuyente.valor_id,
            propietarioTipoId: "RUT",
            propietarioPais: "CL",
            propietarioComuna: selectedEmpresa.campo_1_porteador.comuna,
            permisoResolucion: buildPermisoResolucion(micEntradaData),
          };
        }

        // Demo CRT data
        const datosCRT = {
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
        };

        console.log('🔍 ========== GUARDANDO EN STORE (DEMO) ==========');
        console.log('🔍 Modo:', conApoyo ? 'CON APOYO' : 'SIN APOYO');
        console.log('🔍 Datos propietario a guardar:', datosPropietario);
        console.log('🔍 tipoIdConductor A GUARDAR:', datosVehiculo.tipoIdConductor);
        
        updateFormData({
          ...datosEmpresa,
          ...datosVehiculo,
          ...datosPropietario,
          ...datosCRT,
        });
        console.log('✅ updateFormData() llamado');
      }

      setExtractedData({ demo: true, micEntradaData });
      console.log('✅ setExtractedData() llamado con micEntradaData');
      
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
        onClick={handleExtract}
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
