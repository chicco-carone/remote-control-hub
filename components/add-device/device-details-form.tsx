"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useIsMobile } from "@/components/ui/use-mobile";
import {
  deviceTypes,
  esphomeProtocols,
  popularBrands,
} from "@/lib/esphome-constants";
import { Info } from "lucide-react";

interface DeviceDetailsFormProps {
  formData: {
    name: string;
    manufacturer: string;
    model: string;
    deviceType: string;
    notes: string;
    protocol: string;
  };
  errors: {
    name?: string;
    manufacturer?: string;
    deviceType?: string;
    protocol?: string;
  };
  handleInputChange: (
    field: keyof DeviceDetailsFormProps["formData"],
    value: string,
  ) => void;
}

export function DeviceDetailsForm({
  formData,
  errors,
  handleInputChange,
}: DeviceDetailsFormProps) {
  const { isAuthenticated } = useCurrentUser();
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Device Information</span>
              <Badge variant="outline">Step 1</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Device Name <span className="text-red-500">*</span>
                </Label>
                {!isAuthenticated ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="e.g., Samsung Smart TV 55 inch"
                        className={errors.name ? "border-red-500" : ""}
                        disabled
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Authentication required to add devices
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Samsung Smart TV 55 inch"
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceType">
                  Device Type <span className="text-red-500">*</span>
                </Label>
                {!isAuthenticated ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={formData.deviceType}
                        onValueChange={(value) =>
                          handleInputChange("deviceType", value)
                        }
                        disabled
                      >
                        <SelectTrigger
                          className={errors.deviceType ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                        <SelectContent position={isMobile ? "item-aligned" : "popper"}>
                          {deviceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent>
                      Authentication required to add devices
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Select
                    value={formData.deviceType}
                    onValueChange={(value) =>
                      handleInputChange("deviceType", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.deviceType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent position={isMobile ? "item-aligned" : "popper"}>
                      {deviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.deviceType && (
                  <p className="text-sm text-red-500">{errors.deviceType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">
                  Brand/Manufacturer <span className="text-red-500">*</span>
                </Label>
                {!isAuthenticated ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={formData.manufacturer}
                          onValueChange={(value) =>
                            handleInputChange("manufacturer", value)
                          }
                          disabled
                        >
                          <SelectTrigger
                            className={
                              errors.manufacturer ? "border-red-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select or type brand" />
                          </SelectTrigger>
                          <SelectContent position={isMobile ? "item-aligned" : "popper"}>
                            {popularBrands.map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent>
                        Authentication required to add devices
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          value={formData.manufacturer}
                          onChange={(e) =>
                            handleInputChange("manufacturer", e.target.value)
                          }
                          placeholder="Or type custom brand name"
                          className="mt-2"
                          disabled
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Authentication required to add devices
                      </TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Select
                      value={formData.manufacturer}
                      onValueChange={(value) =>
                        handleInputChange("manufacturer", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.manufacturer ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select or type brand" />
                      </SelectTrigger>
                      <SelectContent position={isMobile ? "item-aligned" : "popper"}>
                        {popularBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.manufacturer}
                      onChange={(e) =>
                        handleInputChange("manufacturer", e.target.value)
                      }
                      placeholder="Or type custom brand name"
                      className="mt-2"
                    />
                  </>
                )}
                {errors.manufacturer && (
                  <p className="text-sm text-red-500">{errors.manufacturer}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model Number (Optional)</Label>
                {!isAuthenticated ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) =>
                          handleInputChange("model", e.target.value)
                        }
                        placeholder="e.g., UN55TU8000, HT-S100F"
                        disabled
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Authentication required to add devices
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="e.g., UN55TU8000, HT-S100F"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              {!isAuthenticated ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Any additional information about the device, compatibility notes, or usage instructions..."
                      rows={4}
                      disabled
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    Authentication required to add devices
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional information about the device, compatibility notes, or usage instructions..."
                  rows={4}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>ESPHome Protocol</span>
              <Badge variant="outline">Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Select the ESPHome protocol that matches your remote control.
                All codes for this device will use the same protocol.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="protocol">
                Protocol Type <span className="text-red-500">*</span>
              </Label>
              {!isAuthenticated ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select
                      value={formData.protocol}
                      onValueChange={(value) =>
                        handleInputChange("protocol", value)
                      }
                      disabled
                    >
                      <SelectTrigger
                        className={errors.protocol ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select ESPHome protocol" />
                      </SelectTrigger>
                  <SelectContent className={`max-h-60 ${isMobile ? 'fixed' : ''}`} position={isMobile ? "popper" : "popper"} side={isMobile ? "top" : "bottom"}>
                    {esphomeProtocols.map((protocol) => (
                      <SelectItem
                        key={protocol.value}
                        value={protocol.value}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {protocol.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {protocol.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    Authentication required to add devices
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Select
                  value={formData.protocol}
                  onValueChange={(value) =>
                    handleInputChange("protocol", value)
                  }
                >
                  <SelectTrigger
                    className={errors.protocol ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select ESPHome protocol" />
                  </SelectTrigger>
                  <SelectContent className={`max-h-60 ${isMobile ? 'fixed' : ''}`} position={isMobile ? "popper" : "popper"} side={isMobile ? "top" : "bottom"}>
                    {esphomeProtocols.map((protocol) => (
                      <SelectItem key={protocol.value} value={protocol.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{protocol.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {protocol.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.protocol && (
                <p className="text-sm text-red-500">{errors.protocol}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
