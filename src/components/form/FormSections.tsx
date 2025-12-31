import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
} from "lucide-react";

const { paises, tipo_identificador, aduanas_bolivia, monedas, tipo_bultos } =
  dropdownsConfig.dropdowns;

export function FormSections() {
  const { formData, updateFormData, conApoyo } = useMicStore();

  return (
    <Accordion
      type="multiple"
      defaultValue={["porteador"]}
      className="space-y-3"
    >
      {/* Section 2: Porteador */}
      <AccordionItem value="porteador" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Datos del Porteador</h3>
              <p className="text-xs text-muted-foreground">
                Información de la empresa transportista
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
                    <div className="space-y-2">
                      <Label>Tipo identificador 2</Label>
                      <Select
                        value={formData.tipoIdentificador2}
                        onValueChange={(value) =>
                          updateFormData({ tipoIdentificador2: value })
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
        </AccordionContent>
      </AccordionItem>

      {/* Section 3: Transit and Operation */}
      <AccordionItem value="transito" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-info" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Tránsito y Operación</h3>
              <p className="text-xs text-muted-foreground">
                Tipo de operación y datos del MIC
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
            <div className="space-y-2">
              <Label htmlFor="numeroMic">Número MIC</Label>
              <Input
                id="numeroMic"
                value={formData.numeroMic}
                onChange={(e) => updateFormData({ numeroMic: e.target.value })}
                className="font-mono"
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
            <div className="space-y-2">
              <Label htmlFor="numeroReferencia">Número de referencia</Label>
              <Input
                id="numeroReferencia"
                value={formData.numeroReferencia}
                onChange={(e) =>
                  updateFormData({ numeroReferencia: e.target.value })
                }
                className="font-mono"
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
        </AccordionContent>
      </AccordionItem>

      {/* Section 4: Dates and Locations */}
      <AccordionItem value="fechas" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-success" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Fechas y Locaciones</h3>
              <p className="text-xs text-muted-foreground">
                Fechas de emisión y aduanas
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
            <div className="space-y-2">
              <Label>Aduana de partida</Label>
              <Select
                value={formData.aduanaPartidaCodigo}
                onValueChange={(value) => {
                  const aduana = aduanas_bolivia.find((a) => a.codigo === value);
                  updateFormData({
                    aduanaPartidaCodigo: value,
                    aduanaPartidaDescripcion: aduana?.descripcion || "",
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
              <Label htmlFor="aduanaPartidaCodigo">Código aduana partida</Label>
              <Input
                id="aduanaPartidaCodigo"
                value={formData.aduanaPartidaCodigo}
                onChange={(e) =>
                  updateFormData({ aduanaPartidaCodigo: e.target.value })
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudadDestinoFinal">
                Ciudad y país destino final
              </Label>
              <Input
                id="ciudadDestinoFinal"
                value={formData.ciudadDestinoFinal}
                onChange={(e) =>
                  updateFormData({ ciudadDestinoFinal: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudadDestinoCodigo">Código destino</Label>
              <Input
                id="ciudadDestinoCodigo"
                value={formData.ciudadDestinoCodigo}
                onChange={(e) =>
                  updateFormData({ ciudadDestinoCodigo: e.target.value })
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depositoFiscalNombre">
                Nombre depósito fiscal
              </Label>
              <Input
                id="depositoFiscalNombre"
                value={formData.depositoFiscalNombre}
                onChange={(e) =>
                  updateFormData({ depositoFiscalNombre: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depositoFiscalCodigo">
                Código depósito fiscal
              </Label>
              <Input
                id="depositoFiscalCodigo"
                value={formData.depositoFiscalCodigo}
                onChange={(e) =>
                  updateFormData({ depositoFiscalCodigo: e.target.value })
                }
                className="font-mono"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Section 5: Truck Owner */}
      <AccordionItem value="propietario" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Propietario del Camión</h3>
              <p className="text-xs text-muted-foreground">
                Datos del propietario del vehículo
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
        </AccordionContent>
      </AccordionItem>

      {/* Section 6: Vehicle */}
      <AccordionItem value="vehiculo" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Truck className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Vehículo Original</h3>
              <p className="text-xs text-muted-foreground">
                Datos del camión y remolque
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
        </AccordionContent>
      </AccordionItem>

      {/* Section 7: Bill of Lading and Customs */}
      <AccordionItem value="cartaporte" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Carta de Porte y Aduana</h3>
              <p className="text-xs text-muted-foreground">
                Datos de la carta de porte y aduana destino
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
            <div className="space-y-2">
              <Label>Aduana de destino</Label>
              <Select
                value={formData.aduanaDestinoCodigo}
                onValueChange={(value) => {
                  const aduana = aduanas_bolivia.find((a) => a.codigo === value);
                  updateFormData({
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
              <Label htmlFor="aduanaDestinoCodigo">Código aduana destino</Label>
              <Input
                id="aduanaDestinoCodigo"
                value={formData.aduanaDestinoCodigo}
                onChange={(e) =>
                  updateFormData({ aduanaDestinoCodigo: e.target.value })
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aduanaDestinoDepositoNombre">
                Nombre depósito fiscal
              </Label>
              <Input
                id="aduanaDestinoDepositoNombre"
                value={formData.aduanaDestinoDepositoNombre}
                onChange={(e) =>
                  updateFormData({
                    aduanaDestinoDepositoNombre: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aduanaDestinoDepositoCodigo">
                Código depósito fiscal
              </Label>
              <Input
                id="aduanaDestinoDepositoCodigo"
                value={formData.aduanaDestinoDepositoCodigo}
                onChange={(e) =>
                  updateFormData({
                    aduanaDestinoDepositoCodigo: e.target.value,
                  })
                }
                className="font-mono"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Section 8: Values and Currency */}
      <AccordionItem value="valores" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Valores y Moneda</h3>
              <p className="text-xs text-muted-foreground">
                Origen de mercancías y moneda
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
        </AccordionContent>
      </AccordionItem>

      {/* Section 9: Packages and Weight */}
      <AccordionItem value="bultos" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Bultos y Peso</h3>
              <p className="text-xs text-muted-foreground">
                Tipo, cantidad de bultos y peso bruto
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
        </AccordionContent>
      </AccordionItem>

      {/* Section 10: Participants */}
      <AccordionItem value="participantes" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
              <User className="w-4 h-4 text-pink-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Participantes</h3>
              <p className="text-xs text-muted-foreground">
                Remitente, destinatario y consignatario
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
        </AccordionContent>
      </AccordionItem>

      {/* Section 11: Documents and Seals */}
      <AccordionItem value="documentos" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Documentos y Precintos</h3>
              <p className="text-xs text-muted-foreground">
                Documentos anexos, precintos y descripción
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
        </AccordionContent>
      </AccordionItem>

      {/* Section 12: Driver and Route */}
      <AccordionItem value="conductor" className="form-section border">
        <AccordionTrigger className="form-section-header hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Conductor y Ruta</h3>
              <p className="text-xs text-muted-foreground">
                Datos del conductor
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="form-section-content">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
