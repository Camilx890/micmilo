import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileSpreadsheet, FileText, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMicStore } from "@/store/micStore";
import { cn } from "@/lib/utils";

export function Step1FileUpload() {
  const { crtFile, micEntradaFile, setCrtFile, setMicEntradaFile, setCurrentStep } = useMicStore();
  
  const onDropCrt = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCrtFile(acceptedFiles[0]);
    }
  }, [setCrtFile]);

  const onDropMic = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setMicEntradaFile(acceptedFiles[0]);
    }
  }, [setMicEntradaFile]);

  const {
    getRootProps: getCrtRootProps,
    getInputProps: getCrtInputProps,
    isDragActive: isCrtDragActive,
  } = useDropzone({
    onDrop: onDropCrt,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const {
    getRootProps: getMicRootProps,
    getInputProps: getMicInputProps,
    isDragActive: isMicDragActive,
  } = useDropzone({
    onDrop: onDropMic,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const canProceed = !!crtFile;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Subir Archivos</h1>
        <p className="text-muted-foreground">
          Sube los archivos necesarios para generar el XML MIC/DTA
        </p>
      </div>

      {/* CRT File - Required */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">CRT.xlsx</h2>
          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
            Obligatorio
          </span>
        </div>
        
        {crtFile ? (
          <div className="flex items-center justify-between p-4 bg-success-background border border-success-border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <div>
                <p className="font-medium text-foreground">{crtFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(crtFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCrtFile(null)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div
            {...getCrtRootProps()}
            className={cn(
              "upload-zone cursor-pointer",
              isCrtDragActive ? "upload-zone-active" : "upload-zone-default"
            )}
          >
            <input {...getCrtInputProps()} />
            <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-foreground font-medium">
              {isCrtDragActive
                ? "Suelta el archivo aquí..."
                : "Arrastra y suelta tu archivo CRT.xlsx aquí"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              o haz click para seleccionar el archivo
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Formatos aceptados: .xlsx, .xls
            </p>
          </div>
        )}
      </div>

      {/* MIC Entrada PDF - Optional */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-info" />
          <h2 className="text-lg font-semibold">MIC Entrada.pdf</h2>
          <span className="text-xs bg-info-background text-info px-2 py-0.5 rounded-full font-medium">
            Opcional
          </span>
        </div>

        <div className="flex items-center gap-2 p-3 bg-info-background/50 border border-info-border/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-info shrink-0" />
          <p className="text-sm text-info-foreground">
            Sube este archivo para auto-completar datos de conductor y vehículos
          </p>
        </div>
        
        {micEntradaFile ? (
          <div className="flex items-center justify-between p-4 bg-success-background border border-success-border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <div>
                <p className="font-medium text-foreground">{micEntradaFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(micEntradaFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMicEntradaFile(null)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div
            {...getMicRootProps()}
            className={cn(
              "upload-zone cursor-pointer",
              isMicDragActive ? "upload-zone-active" : "upload-zone-default"
            )}
          >
            <input {...getMicInputProps()} />
            <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-foreground font-medium">
              {isMicDragActive
                ? "Suelta el archivo aquí..."
                : "Arrastra y suelta tu archivo MIC Entrada.pdf aquí"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              o haz click para seleccionar el archivo
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Formato aceptado: .pdf
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          disabled={!canProceed}
          onClick={() => setCurrentStep(2)}
          className="min-w-[140px]"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
