import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useMicStore } from "@/store/micStore";
import dropdownsConfig from "@/data/dropdowns_config.json";

import {
  Building2,
  FileText,
  Calendar,
  Truck,
  User,
  Package,
  DollarSign,
  MapPin,
  FileCheck,
  Lock,
} from "lucide-react";

const { paises, tipo_identificador, aduanas_bolivia, monedas, tipo_bultos } =
  dropdownsConfig.dropdowns;

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBg: string;
  children: React.ReactNode;
}

function SectionCard({ icon, title, subtitle, iconBg, children }: SectionCardProps) {
  return (
    <Card className="border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
          <div className="text-left">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function FormSections() {
  const { formData, updateFormData, conApoyo } = useMicStore();

  return (
    <div className="space-y-6">
      {/* Section 2: Porteador */}
      <SectionCard
        icon={<Building2 className="w-4 h-4 text-primary" />}
        iconBg="bg-primary/10"
        title="Datos del Porteador"
        subtitle="Información de la empresa transportista"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="porteadorNombre">Nombre del porteador</Label>
            <Input
              id="porteadorNombre"
              value={formData.porteadorNombre}
              onChange={(e) =>
                updateFormData({ porteadorNombre: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>País</Label>
            <Select
              value={formData.porteadorPais}
              onValueChange={(value) =>
                updateFormData({ porteadorPais: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {paises.map((pais) => (
                  <SelectItem key={pais.codigo} value={pais.codigo}>
                    {pais.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="porteadorComuna">Comuna</Label>
            <Input
              id="porteadorComuna"
              value={formData.porteadorComuna}
              onChange={(e) =>
                updateFormData({ porteadorComuna: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="porteadorDomicilio">Domicilio</Label>
            <Textarea
              id="porteadorDomicilio"
              value={formData.porteadorDomicilio}
              onChange={(e) =>
                updateFormData({ porteadorDomicilio: e.target.value })
              }
            />
          </div>

          {/* Campo Permiso-Resolución - EDITABLE */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="permisoResolucion">
              Permiso, Resolución, Seguro y Vencimientos
            </Label>
            <Textarea
              id="permisoResolucion"
              placeholder="Ej: PERMISO. 8229/2025 VTO. 07/01/2026 SEGURO. RCT-LP0201-40032-0 VTO. 07/03/2026"
              value={formData.permisoResolucion}
              onChange={(e) =>
                updateFormData({ permisoResolucion: e.target.value })
              }
              className="min-h-[80px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Este campo se pre-llena automáticamente si se subió el MIC Entrada
            </p>
          </div>

          <div className="md:col-span-2 pt-4 border-t">
            <h4 className="font-medium mb-4">Rol del Contribuyente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo identificador</Label>
                <Select
                  value={formData.tipoIdentificador}
                  onValueChange={(value) =>
                    updateFormData({ tipoIdentificador: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {tipo_identificador.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value || "none"}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rolContribuyente">Rol del contribuyente</Label>
                <Input
                  id="rolContribuyente"
                  value={formData.rolContribuyente}
                  onChange={(e) =>
                    updateFormData({ rolContribuyente: e.target.value })
                  }
                  className="font-mono"
                />
              </div>

              {conApoyo && (
                <>
                  {console.log('🔍 DEBUG RENDER Rol2:', {
                    tipoIdentificador2: formData.tipoIdentificador2,
                    rolContribuyente2: formData.rolContribuyente2,
                  })}
                  <div className="space-y-2">
                    <Label>Tipo identificador 2</Label>
                    <Select
                      value={formData.tipoIdentificador2 || ""}
                      onValueChange={(value) =>
                        updateFormData({ tipoIdentificador2: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {tipo_identificador.map((tipo) => (
                          <SelectItem key={tipo.value || "empty"} value={tipo.value || "none"}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rolContribuyente2">Rol 2</Label>
                    <Input
                      id="rolContribuyente2"
                      value={formData.rolContribuyente2}
                      onChange={(e) =>
                        updateFormData({ rolContribuyente2: e.target.value })
                      }
                      className="font-mono"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 3: Transit and Operation */}
      <SectionCard
        icon={<FileText className="w-4 h-4 text-info" />}
        iconBg="bg-info/10"
        title="Tránsito y Operación"
        subtitle="Tipo de operación y datos del MIC"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tránsito aduanero</Label>
            <RadioGroup
              value={formData.transitoAduanero}
              onValueChange={(value) =>
                updateFormData({ transitoAduanero: value })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Si" id="transito-si" />
                <Label htmlFor="transito-si">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="transito-no" />
                <Label htmlFor="transito-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Número MIC - READONLY, siempre vacío */}
          <div className="space-y-2">
            <Label htmlFor="numeroMic" className="flex items-center gap-2">
              Número MIC
              <Lock className="w-3 h-3 text-muted-foreground" />
            </Label>
            <Input
              id="numeroMic"
              value=""
              placeholder="(Generado por la aduana)"
              disabled
              className="font-mono bg-muted cursor-not-allowed"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipoOperacion">Tipo de operación</Label>
            <Input
              id="tipoOperacion"
              value={formData.tipoOperacion}
              onChange={(e) =>
                updateFormData({ tipoOperacion: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipoCarga">Tipo de carga</Label>
            <Input
              id="tipoCarga"
              value={formData.tipoCarga}
              onChange={(e) => updateFormData({ tipoCarga: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipoTransito">Tipo de tránsito</Label>
            <Input
              id="tipoTransito"
              value={formData.tipoTransito}
              onChange={(e) =>
                updateFormData({ tipoTransito: e.target.value })
              }
            />
          </div>
          
          {/* Número de Referencia - EDITABLE, auto-generado 5 dígitos */}
          <div className="space-y-2">
            <Label htmlFor="numeroReferencia">Número de referencia</Label>
            <Input
              id="numeroReferencia"
              value={formData.numeroReferencia}
              onChange={(e) =>
                updateFormData({ numeroReferencia: e.target.value })
              }
              className="font-mono"
              placeholder="Ej: 45023"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contenedor1">N° Contenedor 1</Label>
            <Input
              id="contenedor1"
              value={formData.contenedor1}
              onChange={(e) =>
                updateFormData({ contenedor1: e.target.value })
              }
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contenedor2">N° Contenedor 2</Label>
            <Input
              id="contenedor2"
              value={formData.contenedor2}
              onChange={(e) =>
                updateFormData({ contenedor2: e.target.value })
              }
              className="font-mono"
            />
          </div>
        </div>
      </SectionCard>

      {/* Section 4: Dates and Locations */}
      <SectionCard
        icon={<Calendar className="w-4 h-4 text-success" />}
        iconBg="bg-success/10"
        title="Fechas y Locaciones"
        subtitle="Fechas de emisión y aduanas"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hojaFolha">Hoja/Folha</Label>
            <Input
              id="hojaFolha"
              value={formData.hojaFolha}
              onChange={(e) => updateFormData({ hojaFolha: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaEmision">Fecha de emisión</Label>
            <Input
              id="fechaEmision"
              type="date"
              value={formData.fechaEmision}
              onChange={(e) =>
                updateFormData({ fechaEmision: e.target.value })
              }
            />
          </div>
          
          {/* CAMPO 7: Aduana de Partida - FIJO Chile - Iquique */}
          <div className="md:col-span-2 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <Label className="font-medium">Campo 7: Aduana de Partida (Fijo - No Editable)</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Aduana, ciudad y país de partida</Label>
                <Select disabled>
                  <SelectTrigger className="bg-muted cursor-not-allowed">
                    <SelectValue placeholder="Chile - Iquique" />
                  </SelectTrigger>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Código</Label>
                <Input
                  value="997"
                  disabled
                  className="font-mono bg-muted cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* CAMPO 8: Ciudad y País Destino Final - OBLIGATORIO */}
          {/* También copia automáticamente al Campo 24 (Aduana de Destino) */}
          <div className="md:col-span-2 p-4 rounded-lg border border-primary/20 bg-primary/5">
            <h4 className="font-medium mb-4">Campo 8: Ciudad y País de Destino Final</h4>
            <p className="text-xs text-muted-foreground mb-4">Este campo también define la Aduana de Destino (Campo 24)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ciudad y país de destino final <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.ciudadDestinoCodigo}
                  onValueChange={(value) => {
                    const aduana = aduanas_bolivia.find((a) => a.codigo === value);
                    // Actualiza Campo 8 Y Campo 24 simultáneamente
                    updateFormData({
                      ciudadDestinoCodigo: value,
                      ciudadDestinoFinal: aduana?.descripcion || "",
                      aduanaDestinoCodigo: value,
                      aduanaDestinoDescripcion: aduana?.descripcion || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar aduana" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-[300px]">
                    {aduanas_bolivia.map((aduana) => (
                      <SelectItem key={aduana.codigo} value={aduana.codigo}>
                        {aduana.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudadDestinoCodigoNumerico">Código <span className="text-destructive">*</span></Label>
                <Input
                  id="ciudadDestinoCodigoNumerico"
                  value={formData.ciudadDestinoCodigoNumerico || '221'}
                  onChange={(e) => {
                    // Actualiza Campo 8 Y Campo 24 simultáneamente
                    updateFormData({
                      ciudadDestinoCodigoNumerico: e.target.value,
                      aduanaDestinoCodigoNumerico: e.target.value,
                    });
                  }}
                  placeholder="Ej: 352"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositoFiscalNombre">Nombre depósito fiscal</Label>
                <Input
                  id="depositoFiscalNombre"
                  value={formData.depositoFiscalNombre}
                  onChange={(e) => {
                    updateFormData({
                      depositoFiscalNombre: e.target.value,
                      aduanaDestinoDepositoNombre: e.target.value,
                    });
                  }}
                  placeholder="Opcional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositoFiscalCodigo">Código depósito fiscal</Label>
                <Input
                  id="depositoFiscalCodigo"
                  value={formData.depositoFiscalCodigo}
                  onChange={(e) => {
                    updateFormData({
                      depositoFiscalCodigo: e.target.value,
                      aduanaDestinoDepositoCodigo: e.target.value,
                    });
                  }}
                  className="font-mono"
                  placeholder="Opcional"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 5: Truck Owner */}
      <SectionCard
        icon={<User className="w-4 h-4 text-purple-600" />}
        iconBg="bg-purple-100"
        title="Propietario del Camión"
        subtitle="Datos del propietario del vehículo"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="propietarioNombre">Nombre del propietario</Label>
            <Input
              id="propietarioNombre"
              value={formData.propietarioNombre}
              onChange={(e) =>
                updateFormData({ propietarioNombre: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>País</Label>
            <Select
              value={formData.propietarioPais}
              onValueChange={(value) =>
                updateFormData({ propietarioPais: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {paises.map((pais) => (
                  <SelectItem key={pais.codigo} value={pais.codigo}>
                    {pais.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="propietarioComuna">Comuna</Label>
            <Input
              id="propietarioComuna"
              value={formData.propietarioComuna}
              onChange={(e) =>
                updateFormData({ propietarioComuna: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="propietarioDomicilio">Domicilio</Label>
            <Textarea
              id="propietarioDomicilio"
              value={formData.propietarioDomicilio}
              onChange={(e) =>
                updateFormData({ propietarioDomicilio: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo identificador</Label>
            <Select
              value={formData.propietarioTipoId}
              onValueChange={(value) =>
                updateFormData({ propietarioTipoId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {tipo_identificador.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value || "none"}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="propietarioRol">Rol</Label>
            <Input
              id="propietarioRol"
              value={formData.propietarioRol}
              onChange={(e) =>
                updateFormData({ propietarioRol: e.target.value })
              }
              className="font-mono"
            />
          </div>
        </div>
      </SectionCard>

      {/* Section 6: Vehicle */}
      <SectionCard
        icon={<Truck className="w-4 h-4 text-orange-600" />}
        iconBg="bg-orange-100"
        title="Vehículo Original"
        subtitle="Datos del camión y remolque"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="placaCamion">Placa del camión</Label>
            <Input
              id="placaCamion"
              value={formData.placaCamion}
              onChange={(e) =>
                updateFormData({ placaCamion: e.target.value })
              }
              className="font-mono uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label>País placa</Label>
            <Select
              value={formData.paisPlaca}
              onValueChange={(value) => updateFormData({ paisPlaca: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {paises.map((pais) => (
                  <SelectItem key={pais.codigo} value={pais.codigo}>
                    {pais.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marca">Marca</Label>
            <Input
              id="marca"
              value={formData.marca}
              onChange={(e) => updateFormData({ marca: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chassis">Número chassis</Label>
            <Input
              id="chassis"
              value={formData.chassis}
              onChange={(e) => updateFormData({ chassis: e.target.value })}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacidadArrastre">Capacidad de arrastre</Label>
            <div className="relative">
              <Input
                id="capacidadArrastre"
                type="number"
                value={formData.capacidadArrastre}
                onChange={(e) =>
                  updateFormData({ capacidadArrastre: e.target.value })
                }
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                TON
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="anio">Año</Label>
            <Input
              id="anio"
              type="number"
              maxLength={4}
              value={formData.anio}
              onChange={(e) => updateFormData({ anio: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 pt-4 border-t">
            <h4 className="font-medium mb-4">Remolque / Semiremolque</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipoRemolque}
                  onValueChange={(value) =>
                    updateFormData({ tipoRemolque: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Semiremolque">Semiremolque</SelectItem>
                    <SelectItem value="Remolque">Remolque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="placaRemolque">Placa</Label>
                <Input
                  id="placaRemolque"
                  value={formData.placaRemolque}
                  onChange={(e) =>
                    updateFormData({ placaRemolque: e.target.value })
                  }
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label>País</Label>
                <Select
                  value={formData.paisRemolque}
                  onValueChange={(value) =>
                    updateFormData({ paisRemolque: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {paises.map((pais) => (
                      <SelectItem key={pais.codigo} value={pais.codigo}>
                        {pais.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 7: Bill of Lading and Customs */}
      <SectionCard
        icon={<FileCheck className="w-4 h-4 text-cyan-600" />}
        iconBg="bg-cyan-100"
        title="Carta de Porte y Aduana"
        subtitle="Datos de la carta de porte y aduana destino"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numeroCartaPorte">N° carta de porte</Label>
            <Input
              id="numeroCartaPorte"
              value={formData.numeroCartaPorte}
              onChange={(e) =>
                updateFormData({ numeroCartaPorte: e.target.value })
              }
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Parcial</Label>
            <RadioGroup
              value={formData.esParcial}
              onValueChange={(value) => updateFormData({ esParcial: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Si" id="parcial-si" />
                <Label htmlFor="parcial-si">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="parcial-no" />
                <Label htmlFor="parcial-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* CAMPO 24: Aduana de Destino - OCULTO, se copia automáticamente del Campo 8 */}
        </div>
      </SectionCard>

      {/* Section 8: Values and Currency */}
      <SectionCard
        icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        iconBg="bg-emerald-100"
        title="Valores y Moneda"
        subtitle="Origen de mercancías y moneda"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Select
              value={formData.moneda}
              onValueChange={(value) => updateFormData({ moneda: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {monedas.map((m) => (
                  <SelectItem key={m.codigo} value={m.codigo}>
                    {m.simbolo} {m.nombre} ({m.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Origen de mercancías</Label>
            <Select
              value={formData.origenMercancias}
              onValueChange={(value) => {
                updateFormData({
                  origenMercancias: value,
                  origenMercanciasCodigo: value,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {paises.map((pais) => (
                  <SelectItem key={pais.codigo} value={pais.codigo}>
                    {pais.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Section 9: Packages and Weight */}
      <SectionCard
        icon={<Package className="w-4 h-4 text-amber-600" />}
        iconBg="bg-amber-100"
        title="Bultos y Peso"
        subtitle="Tipo, cantidad de bultos y peso bruto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Tipo de bultos</Label>
            <Select
              value={formData.tipoBultos}
              onValueChange={(value) => {
                const tipo = tipo_bultos.find((t) => t.value === value);
                updateFormData({
                  tipoBultos: value,
                  tipoBultosCodigo: tipo?.codigo || "",
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de bulto" />
              </SelectTrigger>
              <SelectContent className="bg-popover max-h-[300px]">
                {tipo_bultos.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contenedorVacio"
              checked={formData.contenedorVacio}
              onCheckedChange={(checked) =>
                updateFormData({ contenedorVacio: checked as boolean })
              }
            />
            <Label htmlFor="contenedorVacio">Contenedor(es) Vacío(s)</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipoBultosCodigo">Código</Label>
            <Input
              id="tipoBultosCodigo"
              value={formData.tipoBultosCodigo}
              onChange={(e) =>
                updateFormData({ tipoBultosCodigo: e.target.value })
              }
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cantidadBultos">Cantidad de bultos</Label>
            <Input
              id="cantidadBultos"
              type="number"
              value={formData.cantidadBultos}
              onChange={(e) =>
                updateFormData({ cantidadBultos: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pesoBruto">Peso bruto</Label>
            <div className="relative">
              <Input
                id="pesoBruto"
                type="number"
                value={formData.pesoBruto}
                onChange={(e) =>
                  updateFormData({ pesoBruto: e.target.value })
                }
                className="pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                kg
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 10: Participants */}
      <SectionCard
        icon={<User className="w-4 h-4 text-pink-600" />}
        iconBg="bg-pink-100"
        title="Participantes"
        subtitle="Remitente, destinatario y consignatario"
      >
        <div className="space-y-6">
          {/* Remitente */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Remitente
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="remitenteNombre">Nombre</Label>
                <Input
                  id="remitenteNombre"
                  value={formData.remitenteNombre}
                  onChange={(e) =>
                    updateFormData({ remitenteNombre: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remitenteDomicilio">Domicilio</Label>
                <Textarea
                  id="remitenteDomicilio"
                  value={formData.remitenteDomicilio}
                  onChange={(e) =>
                    updateFormData({ remitenteDomicilio: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Destinatario */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Destinatario
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destinatarioNombre">Nombre</Label>
                <Input
                  id="destinatarioNombre"
                  value={formData.destinatarioNombre}
                  onChange={(e) =>
                    updateFormData({ destinatarioNombre: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinatarioDomicilio">Domicilio</Label>
                <Textarea
                  id="destinatarioDomicilio"
                  value={formData.destinatarioDomicilio}
                  onChange={(e) =>
                    updateFormData({ destinatarioDomicilio: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Consignatario */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Consignatario
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consignatarioNombre">Nombre</Label>
                <Input
                  id="consignatarioNombre"
                  value={formData.consignatarioNombre}
                  onChange={(e) =>
                    updateFormData({ consignatarioNombre: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consignatarioDomicilio">Domicilio</Label>
                <Textarea
                  id="consignatarioDomicilio"
                  value={formData.consignatarioDomicilio}
                  onChange={(e) =>
                    updateFormData({ consignatarioDomicilio: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 11: Documents and Seals */}
      <SectionCard
        icon={<FileText className="w-4 h-4 text-indigo-600" />}
        iconBg="bg-indigo-100"
        title="Documentos y Precintos"
        subtitle="Documentos anexos, precintos y descripción"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentosAnexos">Documentos anexos</Label>
            <Textarea
              id="documentosAnexos"
              placeholder="BL, DAM, DIM, etc."
              value={formData.documentosAnexos}
              onChange={(e) =>
                updateFormData({ documentosAnexos: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroPrecintos">Número de los precintos</Label>
            <Input
              id="numeroPrecintos"
              placeholder="Separados por coma"
              value={formData.numeroPrecintos}
              onChange={(e) =>
                updateFormData({ numeroPrecintos: e.target.value })
              }
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcionMercancias">
              Descripción de las mercancías
            </Label>
            <Textarea
              id="descripcionMercancias"
              value={formData.descripcionMercancias}
              onChange={(e) =>
                updateFormData({ descripcionMercancias: e.target.value })
              }
              className="min-h-[100px]"
            />
          </div>
        </div>
      </SectionCard>

      {/* Section 12: Driver and Route */}
      <SectionCard
        icon={<MapPin className="w-4 h-4 text-rose-600" />}
        iconBg="bg-rose-100"
        title="Conductor y Ruta"
        subtitle="Datos del conductor"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo identificador conductor</Label>
            <Select
              value={formData.tipoIdConductor}
              onValueChange={(value) =>
                updateFormData({ tipoIdConductor: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {tipo_identificador.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value || "none"}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="idConductor">Identificador conductor</Label>
            <Input
              id="idConductor"
              value={formData.idConductor}
              onChange={(e) =>
                updateFormData({ idConductor: e.target.value })
              }
              className="font-mono"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nombreConductor">Nombre conductor</Label>
            <Input
              id="nombreConductor"
              value={formData.nombreConductor}
              onChange={(e) =>
                updateFormData({ nombreConductor: e.target.value })
              }
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
