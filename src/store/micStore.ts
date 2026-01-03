import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Empresa {
  id: string;
  login: string;
  nombre_display: string;
  campo_1_porteador: {
    nombre: string;
    pais: string;
    pais_nombre: string;
    comuna: string;
    domicilio: string;
  };
  campo_2_rol_contribuyente: {
    tipo_id: string;
    valor_id: string;
    tipo_id2: string;
    valor_id2: string;
  };
  datos_xml: {
    "tipo-manifiesto": string;
    "tipo-carga": string;
    "tipo-transito": string;
    moneda: string;
    "carga-peligrosa": string;
    "id-sender": string;
    lastre: string;
    remonta: string;
    "sentido-operacion": string;
  };
}

export interface ExtractedData {
  [key: string]: any;
}

export interface FormData {
  // Manual fields
  valorFot: string;
  valorFlete: string;
  valorSeguro: string;
  ruta: string;
  
  // Porteador
  porteadorNombre: string;
  porteadorPais: string;
  porteadorComuna: string;
  porteadorDomicilio: string;
  permisoResolucion: string; // Campo editable para permiso-resolucion
  
  // Rol contribuyente
  tipoIdentificador: string;
  rolContribuyente: string;
  tipoIdentificador2: string;
  rolContribuyente2: string;
  
  // Transito
  transitoAduanero: string;
  numeroMic: string;
  tipoOperacion: string;
  tipoCarga: string;
  tipoTransito: string;
  numeroReferencia: string;
  contenedor1: string;
  contenedor2: string;
  
  // Fechas y locaciones
  hojaFolha: string;
  fechaEmision: string;
  // Aduana de partida - FIJO: Chile - Iquique
  aduanaPartidaCodigo: string; // CLIQQ
  aduanaPartidaDescripcion: string; // Chile - Iquique
  aduanaPartidaCodigoNumerico: string; // 997
  ciudadDestinoFinal: string;
  ciudadDestinoCodigo: string;
  ciudadDestinoCodigoNumerico: string; // Manual input
  depositoFiscalNombre: string;
  depositoFiscalCodigo: string;
  
  // Propietario camion
  propietarioNombre: string;
  propietarioPais: string;
  propietarioComuna: string;
  propietarioDomicilio: string;
  propietarioTipoId: string;
  propietarioRol: string;
  
  // Vehiculo
  placaCamion: string;
  paisPlaca: string;
  marca: string;
  chassis: string;
  capacidadArrastre: string;
  anio: string;
  tipoRemolque: string;
  placaRemolque: string;
  paisRemolque: string;
  
  // Carta porte
  numeroCartaPorte: string;
  aduanaDestinoCodigo: string;
  aduanaDestinoDescripcion: string;
  aduanaDestinoCodigoNumerico: string; // Manual input
  aduanaDestinoDepositoNombre: string;
  aduanaDestinoDepositoCodigo: string;
  esParcial: string;
  
  // Valores
  moneda: string;
  origenMercancias: string;
  origenMercanciasCodigo: string;
  
  // Bultos
  tipoBultos: string;
  tipoBultosCodigo: string;
  contenedorVacio: boolean;
  cantidadBultos: string;
  pesoBruto: string;
  
  // Participantes
  remitenteNombre: string;
  remitenteDomicilio: string;
  destinatarioNombre: string;
  destinatarioDomicilio: string;
  consignatarioNombre: string;
  consignatarioDomicilio: string;
  
  // Documentos
  documentosAnexos: string;
  numeroPrecintos: string;
  descripcionMercancias: string;
  numeroBl: string;
  
  // Conductor
  tipoIdConductor: string;
  idConductor: string;
  nombreConductor: string;
}

interface MicState {
  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Files
  crtFile: File | null;
  micEntradaFile: File | null;
  setCrtFile: (file: File | null) => void;
  setMicEntradaFile: (file: File | null) => void;
  
  // Company
  selectedEmpresa: Empresa | null;
  setSelectedEmpresa: (empresa: Empresa | null) => void;
  
  // Mode
  conApoyo: boolean;
  setConApoyo: (value: boolean) => void;
  
  // Extracted data
  extractedData: ExtractedData | null;
  setExtractedData: (data: ExtractedData | null) => void;
  
  // Form data
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  
  // Loading states
  isExtracting: boolean;
  setIsExtracting: (value: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  
  // Reset
  resetAll: () => void;
}

const initialFormData: FormData = {
  valorFot: '',
  valorFlete: '',
  valorSeguro: '',
  ruta: '',
  porteadorNombre: '',
  porteadorPais: '',
  porteadorComuna: '',
  porteadorDomicilio: '',
  permisoResolucion: '',
  tipoIdentificador: '',
  rolContribuyente: '',
  tipoIdentificador2: '',
  rolContribuyente2: '',
  transitoAduanero: 'Si',
  numeroMic: '',
  tipoOperacion: 'Salida',
  tipoCarga: 'Carga General',
  tipoTransito: 'Transito',
  numeroReferencia: '',
  contenedor1: '',
  contenedor2: '',
  hojaFolha: '1/1',
  fechaEmision: new Date().toISOString().split('T')[0],
  // Aduana de partida - FIJO: Chile - Iquique
  aduanaPartidaCodigo: 'CLIQQ',
  aduanaPartidaDescripcion: 'Chile - Iquique',
  aduanaPartidaCodigoNumerico: '997',
  ciudadDestinoFinal: '',
  ciudadDestinoCodigo: '',
  ciudadDestinoCodigoNumerico: '221',
  depositoFiscalNombre: '',
  depositoFiscalCodigo: '',
  propietarioNombre: '',
  propietarioPais: '',
  propietarioComuna: '',
  propietarioDomicilio: '',
  propietarioTipoId: '',
  propietarioRol: '',
  placaCamion: '',
  paisPlaca: '',
  marca: '',
  chassis: '',
  capacidadArrastre: '',
  anio: '',
  tipoRemolque: 'Semiremolque',
  placaRemolque: '',
  paisRemolque: '',
  numeroCartaPorte: '',
  aduanaDestinoCodigo: '',
  aduanaDestinoDescripcion: '',
  aduanaDestinoCodigoNumerico: '',
  aduanaDestinoDepositoNombre: '',
  aduanaDestinoDepositoCodigo: '',
  esParcial: 'Si',
  moneda: 'USD',
  origenMercancias: '',
  origenMercanciasCodigo: '',
  tipoBultos: '',
  tipoBultosCodigo: '',
  contenedorVacio: false,
  cantidadBultos: '',
  pesoBruto: '',
  remitenteNombre: '',
  remitenteDomicilio: '',
  destinatarioNombre: '',
  destinatarioDomicilio: '',
  consignatarioNombre: '',
  consignatarioDomicilio: '',
  documentosAnexos: '',
  numeroPrecintos: '',
  descripcionMercancias: '',
  numeroBl: '',
  tipoIdConductor: '',
  idConductor: '',
  nombreConductor: '',
};

export const useMicStore = create<MicState>()((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  
  crtFile: null,
  micEntradaFile: null,
  setCrtFile: (file) => set({ crtFile: file }),
  setMicEntradaFile: (file) => set({ micEntradaFile: file }),
  
  selectedEmpresa: null,
  setSelectedEmpresa: (empresa) => set({ selectedEmpresa: empresa }),
  
  conApoyo: false,
  setConApoyo: (value) => set({ conApoyo: value }),
  
  extractedData: null,
  setExtractedData: (data) => set({ extractedData: data }),
  
  formData: initialFormData,
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  
  isExtracting: false,
  setIsExtracting: (value) => set({ isExtracting: value }),
  isGenerating: false,
  setIsGenerating: (value) => set({ isGenerating: value }),
  
  resetAll: () => set({
    currentStep: 1,
    crtFile: null,
    micEntradaFile: null,
    selectedEmpresa: null,
    conApoyo: false,
    extractedData: null,
    formData: initialFormData,
    isExtracting: false,
    isGenerating: false,
  }),
}));
