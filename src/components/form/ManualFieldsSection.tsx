import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { useMicStore } from "@/store/micStore";

export function ManualFieldsSection() {
  const { formData, updateFormData } = useMicStore();

  return (
    <div className="bg-warning-background border-2 border-warning-border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-warning-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-warning-foreground">
            Completar Manualmente
          </h2>
          <p className="text-sm text-warning-foreground/80">
            Estos 4 campos deben ser completados por el usuario
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Valor FOT */}
        <div className="space-y-2">
          <Label htmlFor="valorFot" className="text-warning-foreground font-semibold">
            Valor FOT *
          </Label>
          <div className="relative">
            <Input
              id="valorFot"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.valorFot}
              onChange={(e) => updateFormData({ valorFot: e.target.value })}
              className="pr-12 bg-white border-warning-border focus-visible:ring-warning"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              USD
            </span>
          </div>
        </div>

        {/* Valor Flete */}
        <div className="space-y-2">
          <Label htmlFor="valorFlete" className="text-warning-foreground font-semibold">
            Valor Flete *
          </Label>
          <div className="relative">
            <Input
              id="valorFlete"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.valorFlete}
              onChange={(e) => updateFormData({ valorFlete: e.target.value })}
              className="pr-12 bg-white border-warning-border focus-visible:ring-warning"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              USD
            </span>
          </div>
        </div>

        {/* Valor Seguro */}
        <div className="space-y-2">
          <Label htmlFor="valorSeguro" className="text-warning-foreground font-semibold">
            Valor Seguro
            <span className="ml-1 text-xs font-normal text-warning-foreground/60">
              (opcional)
            </span>
          </Label>
          <div className="relative">
            <Input
              id="valorSeguro"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.valorSeguro}
              onChange={(e) => updateFormData({ valorSeguro: e.target.value })}
              className="pr-12 bg-white border-warning-border focus-visible:ring-warning"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              USD
            </span>
          </div>
        </div>
      </div>

      {/* Ruta */}
      <div className="space-y-2">
        <Label htmlFor="ruta" className="text-warning-foreground font-semibold">
          Ruta *
        </Label>
        <Textarea
          id="ruta"
          placeholder="Ej: IQUIQUE-HUARA-COLCHANE-PISIGA SANTA CRUZ"
          value={formData.ruta}
          onChange={(e) => updateFormData({ ruta: e.target.value })}
          className="bg-white border-warning-border focus-visible:ring-warning min-h-[80px]"
        />
        <p className="text-xs text-warning-foreground/70">
          Ingresa la ruta completa del transporte separando cada punto con guiones
        </p>
      </div>
    </div>
  );
}
