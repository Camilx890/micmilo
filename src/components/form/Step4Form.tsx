import { useState } from "react";
import { ManualFieldsSection } from "./ManualFieldsSection";
import { FormSections } from "./FormSections";
import { Button } from "@/components/ui/button";
import { useMicStore } from "@/store/micStore";
import { toast } from "sonner";
import { Download, Loader2, Ship, FileSpreadsheet, FileText, Building2, Settings2, RotateCcw, Edit2, CheckCircle2, AlertTriangle } from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";
import dropdownsConfig from "@/data/dropdowns_config.json";

// Helper para extraer nombre de ciudad del código de aduana
function getNombreCiudad(codigoAduana: string): string {
  if (!codigoAduana) return '';
  const aduana = dropdownsConfig.dropdowns.aduanas_bolivia.find(
    (a) => a.codigo === codigoAduana
  );
  if (aduana) {
    // Extraer solo el nombre de la ciudad (después de "Bolivia - ")
    return aduana.descripcion.replace('Bolivia - ', '');
  }
  return '';
}

// Helper para obtener nombre del país
function getNombrePais(codigoPais: string): string {
  const paises: Record<string, string> = {
    'CL': 'Chile',
    'BO': 'Bolivia',
    'AR': 'Argentina',
    'PE': 'Perú',
    'BR': 'Brasil',
    'PY': 'Paraguay',
    'UY': 'Uruguay'
  };
  return paises[codigoPais] || codigoPais;
}

export function Step4Form() {
  const { formData, extractedData, selectedEmpresa, conApoyo, isGenerating, setIsGenerating, crtFile, micEntradaFile, setCurrentStep, resetAll } = useMicStore();
  const [loadingMessage, setLoadingMessage] = useState("");

  const manualFieldsComplete =
    String(formData.valorFot || '').trim() !== "" &&
    String(formData.valorFlete || '').trim() !== "" &&
    String(formData.ruta || '').trim() !== "";

  // Debug: Log formData on mount and changes
  console.log('🔍 ========== STEP4 RENDER ==========');
  console.log('🔍 conApoyo (operationMode):', conApoyo);
  console.log('🔍 formData desde store:', formData);
  console.log('🔍 extractedData desde store:', extractedData);
  console.log('🔍 --- Datos del MIC Entrada en formData ---');
  console.log('🔍 permisoResolucion:', formData.permisoResolucion);
  console.log('🔍 propietarioNombre:', formData.propietarioNombre);
  console.log('🔍 propietarioRol:', formData.propietarioRol);
  console.log('🔍 propietarioDomicilio:', formData.propietarioDomicilio);
  console.log('🔍 placaCamion:', formData.placaCamion);
  console.log('🔍 marca:', formData.marca);
  console.log('🔍 chassis:', formData.chassis);
  console.log('🔍 nombreConductor:', formData.nombreConductor);
  console.log('🔍 idConductor:', formData.idConductor);
  console.log('🔍 tipoIdConductor en Step4:', formData.tipoIdConductor);

  const handleGenerateXML = async () => {
    console.log('🔍 ========== GENERANDO XML ==========');
    console.log('🔍 operationMode (conApoyo):', conApoyo);
    console.log('🔍 formData.propietarioNombre:', formData.propietarioNombre);
    console.log('🔍 formData.propietarioRol:', formData.propietarioRol);
    console.log('🔍 formData.propietarioDomicilio:', formData.propietarioDomicilio);
    console.log('🔍 formData.propietarioTipoId:', formData.propietarioTipoId);
    console.log('🔍 formData.propietarioPais:', formData.propietarioPais);
    console.log('🔍 formData.porteadorNombre:', formData.porteadorNombre);
    console.log('🔍 formData.rolContribuyente:', formData.rolContribuyente);
    
    // 1. Validar campos obligatorios
    const validaciones = [
      { campo: 'valorFot', nombre: 'Valor FOT' },
      { campo: 'valorFlete', nombre: 'Valor Flete' },
      { campo: 'ruta', nombre: 'Ruta' }
    ];

    const camposFaltantes = validaciones
      .filter(v => !formData[v.campo as keyof typeof formData])
      .map(v => v.nombre);

    if (camposFaltantes.length > 0) {
      toast.error(`Campos faltantes: ${camposFaltantes.join(', ')}`);
      return;
    }

    // Formatear fecha en formato DD-MM-YYYY
    const formatDate = (dateStr: string): string => {
      if (!dateStr) {
        const today = new Date();
        return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
      }
      // Si viene en formato YYYY-MM-DD, convertir a DD-MM-YYYY
      if (dateStr.includes('-') && dateStr.length === 10) {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
      }
      return dateStr;
    };

    // 2. Construir el objeto con la estructura EXACTA que espera el backend
    // LÓGICA CON APOYO vs SIN APOYO
    const permisoBase = formData.permisoResolucion || '';
    const propietarioNombre = formData.propietarioNombre || '';
    
    // permiso-resolucion: CON APOYO agrega nombre propietario al inicio
    const permisoResolucion = conApoyo 
      ? `${propietarioNombre} ${permisoBase}`.trim()
      : permisoBase;

    console.log('🔧 Modo operación:', conApoyo ? 'CON APOYO' : 'SIN APOYO');
    console.log('🔧 permiso-resolucion construido:', permisoResolucion);

    console.log('🔍 ========== ANTES DE GENERAR XML ==========');
    console.log('🔍 formData.numeroPrecintos:', formData.numeroPrecintos);
    console.log('🔍 formData.documentosAnexos:', formData.documentosAnexos);
    console.log('🔍 formData.numeroBl:', formData.numeroBl);
    console.log('🔍 formData.remitenteNombre:', formData.remitenteNombre);
    console.log('🔍 ================================================');

    const xmlData = {
      // ========== CAMPOS RAÍZ ==========
      'permiso_resolucion': permisoResolucion,
'impr_aduana_destino': '221',
      'tipo_manifiesto': 'S',
      'login': selectedEmpresa?.login || '',
      'numero_aduana_origen': '',
      'impr_lugar_destino': formData.ciudadDestinoCodigoNumerico || '',
      'impr_aduana_origen': formData.aduanaPartidaCodigoNumerico || '997',
      'transito_aduanero_si': formData.transitoAduanero === 'Si' ? 'X' : '',
      'transito_aduanero_no': formData.transitoAduanero === 'No' ? 'X' : '',
      'descripcion_mercancias': formData.descripcionMercancias || '',
      'origen_mercancias': formData.origenMercanciasCodigo || '',
      'codigo_mercancias': formData.codigoOrigenMercancias || '',
      'tipo_carga': formData.tipoCarga || 'Carga General',
      'tipo_transito': formData.tipoTransito || 'Transito',
      'moneda': formData.moneda || 'USD',
      'deposito_fiscal': formData.depositoFiscalNombre || '',
      'codigo_deposito': formData.depositoFiscalCodigo || '',
      'numero_contenedor1': formData.contenedor1 || '',
      'numero_contenedor2': formData.contenedor2 || '',
      'total_bultos': formData.cantidadBultos || '0',
      'total_peso_bruto': formData.pesoBruto || '0.0',
      'carga_peligrosa': 'N',
      'numero_referencia': formData.numeroReferencia || '',
      'id_sender': 'MIC-DTA 1.0',

      // ========== FECHAS ==========
      'fechas': {
        'fecha': {
          'valor': formatDate(formData.fechaEmision || ''),
          'nombre': 'FEM'
        }
      },

      // ========== LOCACIONES (3 OBLIGATORIAS) ==========
      'locaciones': [
        {
          'descripcion': formData.aduanaPartidaDescripcion || 'Chile - Iquique',
          'nombre': 'ADO',
          'codigo': formData.aduanaPartidaCodigo || 'CLIQQ',
          'nombre_deposito_fiscal': '',
          'codigo_deposito_fiscal': ''
        },
        {
          'descripcion': `Bolivia - ${getNombreCiudad(formData.ciudadDestinoCodigo || '')}`,
          'nombre': 'LD',
          'codigo': formData.ciudadDestinoCodigo || '',
          'nombre_deposito_fiscal': formData.depositoFiscalNombre || '',
          'codigo_deposito_fiscal': formData.depositoFiscalCodigo || ''
        },
        {
          'descripcion': `Bolivia - ${getNombreCiudad(formData.aduanaDestinoCodigo || '')}`,
          'nombre': 'ADD',
          'codigo': formData.aduanaDestinoCodigo || '',
          'nombre_deposito_fiscal': formData.aduanaDestinoDepositoNombre || '',
          'codigo_deposito_fiscal': formData.aduanaDestinoDepositoCodigo || ''
        }
      ],

      // ========== PARTICIPACIONES ==========
      'participaciones': [
        // EMI - Siempre igual (porteador)
        {
          'valor_id': formData.rolContribuyente || '',
          'valor_id2': '',
          'nombres': formData.porteadorNombre || '',
          'direccion': formData.porteadorDomicilio || '',
          'comuna': formData.porteadorComuna || '',
          'tipo_id': 'RUT',
          'tipo_id2': '',
          'codigo_comuna': '',
          'codigo_pais': 'CL',
          'nacion_id': 'CL',
          'nombre_pais': 'Chile',
          'nombre': 'EMI'
        },
        // EMIDO - CON APOYO: agrega valor_id2 y tipo_id2 del propietario
        {
          'valor_id': formData.rolContribuyente || '',
          'valor_id2': conApoyo ? (formData.propietarioRol || '') : '',
          'nombres': formData.porteadorNombre || '',
          'direccion': formData.porteadorDomicilio || '',
          'comuna': formData.porteadorComuna || '',
          'tipo_id': formData.tipoIdentificador || 'RUT',
          'tipo_id2': conApoyo ? 'COD/NIT' : '',
          'codigo_comuna': '',
          'codigo_pais': 'CL',
          'nacion_id': 'CL',
          'nombre_pais': 'Chile',
          'nombre': 'EMIDO'
        },
        // PROP - Siempre usa formData.propietarioXXX primero, con fallback según modo
        {
          'valor_id': conApoyo 
            ? (formData.propietarioRol || '') 
            : (formData.propietarioRol || formData.rolContribuyente || ''),
          'valor_id2': '',
          'nombres': conApoyo
            ? (formData.propietarioNombre || '')
            : (formData.propietarioNombre || formData.porteadorNombre || ''),
          'direccion': conApoyo
            ? (formData.propietarioDomicilio || '')
            : (formData.propietarioDomicilio || formData.porteadorDomicilio || ''),
          'comuna': conApoyo ? '' : (formData.propietarioComuna || formData.porteadorComuna || ''),
          'tipo_id': conApoyo 
            ? (formData.propietarioTipoId || 'COD/NIT')
            : (formData.propietarioTipoId || 'RUT'),
          'tipo_id2': '',
          'codigo_comuna': '',
          'codigo_pais': conApoyo 
            ? (formData.propietarioPais || 'BO')
            : (formData.propietarioPais || 'CL'),
          'nacion_id': conApoyo
            ? (formData.propietarioPais || 'BO')
            : (formData.propietarioPais || 'CL'),
          'nombre_pais': conApoyo 
            ? getNombrePais(formData.propietarioPais || 'BO')
            : getNombrePais(formData.propietarioPais || 'CL'),
          'nombre': 'PROP'
        },
        // COND - Siempre igual (conductor)
        {
          'valor_id': formData.idConductor || '',
          'valor_id2': '',
          'nombres': formData.nombreConductor || '',
          'direccion': '',
          'comuna': '',
          'tipo_id': formData.tipoIdConductor || 'CI.',
          'tipo_id2': '',
          'codigo_comuna': '',
          'codigo_pais': '',
          'nacion_id': 'BO',
          'nombre_pais': '',
          'nombre': 'COND'
        }
      ],

      // ========== OPERACIÓN DE TRANSPORTE ==========
      'optransporte': {
        'lastre': 'N',
        'ruta': formData.ruta || '',
        'remonta': 'N',
        'sentido_operacion': 'S',
        'vehiculos': [
          {
            'nacionalidad_vehiculo': formData.paisPlaca || 'BO',
            'tipo': 'CMNTITULAR',
            'chassis': formData.chassis || '',
            'capacidad_arrastre': formData.capacidadArrastre || '',
            'marca': formData.marca || '',
            'desc_nacionalidad_vehiculo': getNombrePais(formData.paisPlaca || 'BO'),
            'patente_vehiculo': formData.placaCamion || '',
            'ano_vehiculo': formData.anio || ''
          },
          ...(formData.placaRemolque ? [{
            'nacionalidad_vehiculo': formData.paisRemolque || 'BO',
            'tipo': 'SRMTITULAR',
            'chassis': '',
            'capacidad_arrastre': '',
            'marca': '',
            'desc_nacionalidad_vehiculo': getNombrePais(formData.paisRemolque || 'BO'),
            'patente_vehiculo': formData.placaRemolque || '',
            'ano_vehiculo': ''
          }] : [])
        ]
      },

      // ========== DOCUMENTOS (CRT) ==========
      'documentos': [
        {
          'Locaciones': [
            {
              'descripcion': `Bolivia - ${getNombreCiudad(formData.aduanaDestinoCodigo || '')}`,
              'nombre': 'ADD',
              'codigo': formData.aduanaDestinoCodigo || ''
            }
          ],
          'impr_aduana_destino': formData.aduanaDestinoCodigoNumerico || '',
          'deposito_fiscal': formData.aduanaDestinoDepositoNombre || '',
          'codigo_deposito': formData.aduanaDestinoDepositoCodigo || '',
          'moneda': formData.moneda || 'USD',
          'valor_seguro': formData.valorSeguro || '0',
          'parcial': formData.esParcial === 'Si' ? 'S' : 'N',
          'valor_fot': formData.valorFot || '0.1',
          'dato_imprimir': formData.aduanaDestinoCodigoNumerico || '',
          'valor_flete': formData.valorFlete || '0.0',
          'numero': formData.numeroCartaPorte || '',
          'origen_mercancia': formData.origenMercanciasCodigo || '',
          'desc_origen_mercancia': formData.origenMercancias || '',
          'nombre_remitente': formData.remitenteNombre || '',
          'domicilio_remitente': formData.remitenteDomicilio || '',
          'nombre_destinatario': formData.destinatarioNombre || '',
          'domicilio_destinatario': formData.destinatarioDomicilio || '',
          'nombre_consignatario': formData.consignatarioNombre || '',
          'domicilio_consignatario': formData.consignatarioDomicilio || '',
          'numero_dus': '',
          'numero_guia': '',
          'tipo_id_emisor': '',
          'valor_id_emisor': '',
          'nac_id_emisor': '',
          'emisor': '',
          'tipo': 'CP',
          'fecha': '',
          'precintos': formData.numeroPrecintos
            ? formData.numeroPrecintos.split(',').map((p: string) => ({
                'numero': p.trim(),
                'emisor': '',
                'codigo': ''
              }))
            : [],
          'documentos_anexos': formData.documentosAnexos ? [{
            'numero': '',
            'fecha': '',
            'numero_dus': '',
            'numero_guia': '',
            'numero_reexpedicion': '',
            'tipo_bulto': '',
            'cantidad_bultos': '',
            'peso_bruto': '',
            'tipo_documento': formData.documentosAnexos
          }] : [],
          'items': [
            {
              'marcas': formData.descripcionMercancias || '',
              'descripcion': formData.descripcionMercancias || '',
              'numero_item': '',
              'peso_bruto': formData.pesoBruto || '0.0',
              'cantidad': formData.cantidadBultos || '0',
              'contenedor_vacio': formData.contenedorVacio ? 'SI' : 'NO',
              'tipo_bulto': formData.tipoBultosCodigo || '',
              'desc_tipo_bulto': formData.tipoBultos || '',
              'codigo_tipo_bulto': ''
            }
          ]
        }
      ]
    };

    // 3. Llamar al backend Python para GENERAR el XML
    setIsGenerating(true);
    setLoadingMessage("Generando XML...");

    const backendUrl = 'https://api.xn--salteeriamaria-unb.com:9443/generate-xml';
    
    console.log('🔍 === DATOS ENVIADOS AL BACKEND ===');
    console.log('xmlData completo:', JSON.stringify(xmlData, null, 2));
    console.log('Primeros 10 campos:', Object.keys(xmlData).slice(0, 10));
    console.log('=====================================');
    console.log('🚀 Llamando a backend:', backendUrl);

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
    <div className="min-h-screen bg-background">
      {/* Header with Step Indicator */}
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
              <StepIndicator currentStep={4} />
            </div>
          </div>
          <div className="md:hidden mt-4">
            <StepIndicator currentStep={4} />
          </div>
        </div>
      </header>

      {/* Summary Bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: File & Company Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-success" />
                <span className="text-muted-foreground truncate max-w-[150px]">{crtFile?.name || "CRT.xlsx"}</span>
              </div>
              {micEntradaFile && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-info" />
                  <span className="text-muted-foreground truncate max-w-[150px]">{micEntradaFile.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground truncate max-w-[200px]">{selectedEmpresa?.nombre_display}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                <span className="text-muted-foreground">{conApoyo ? "Con Apoyo" : "Sin Apoyo"}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setCurrentStep(1)}
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={resetAll}
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo</span>
              </Button>
            </div>
          </div>

          {/* Manual Fields Status */}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
            <span className="text-muted-foreground">Campos manuales:</span>
            <div className="flex items-center gap-1">
              {formData.valorFot ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              )}
              <span className={formData.valorFot ? "text-success" : "text-warning"}>FOT</span>
            </div>
            <div className="flex items-center gap-1">
              {formData.valorFlete ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              )}
              <span className={formData.valorFlete ? "text-success" : "text-warning"}>Flete</span>
            </div>
            <div className="flex items-center gap-1">
              {formData.ruta ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              )}
              <span className={formData.ruta ? "text-success" : "text-warning"}>Ruta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Note */}
      <div className="container mx-auto px-4 pt-4">
        <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm text-foreground">
          <p className="font-semibold mb-1">⚠️ Mamá, cuidado con:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
            <li>Código aduana destino</li>
            <li>Código país origen mercancía</li>
            <li>Contenedor N°2</li>
          </ol>
        </div>
      </div>

      {/* Main Form Area */}
      <main className="container mx-auto px-4 py-8">
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
              disabled={isGenerating || !manualFieldsComplete}
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