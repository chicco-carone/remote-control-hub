"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/use-current-user";
import { protocolParameters } from "@/lib/esphome-constants";
import { ProtocolParameter } from "@/types/constants";
import { ESPHomeCode } from "@/types/form";
import { Info, Plus, Save, Trash2 } from "lucide-react";

interface ESPHomeCodesFormProps {
  codes: ESPHomeCode[];
  protocol: string;
  errors: {
    codes?: {
      [codeIndex: number]: {
        name?: string;
        parameters?: { [paramName: string]: string };
      };
    };
    general?: string;
  };
  isSubmitting: boolean;
  handleCodeChange: (index: number, field: "name", value: string) => void;
  handleParameterChange: (
    codeIndex: number,
    paramName: string,
    value: string | number | boolean,
  ) => void;
  addCodeField: () => void;
  removeCodeField: (index: number) => void;
  onPrevStep: () => void;
  onSubmit: () => void;
}

export function ESPHomeCodesForm({
  codes,
  protocol,
  errors,
  isSubmitting,
  handleCodeChange,
  handleParameterChange,
  addCodeField,
  removeCodeField,
  onPrevStep,
  onSubmit,
}: ESPHomeCodesFormProps) {
  const { isAuthenticated } = useCurrentUser();

  const renderParameterInput = (
    codeIndex: number,
    param: ProtocolParameter,
  ) => {
    const value = codes[codeIndex]?.parameters[param.name] || "";

    if (param.type === "boolean") {
      return (
        <div className="flex items-center space-x-2">
          {!isAuthenticated ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Checkbox
                  id={`param-${codeIndex}-${param.name}`}
                  checked={value === "true"}
                  onCheckedChange={(checked) =>
                    handleParameterChange(
                      codeIndex,
                      param.name,
                      checked ? "true" : "false",
                    )
                  }
                  disabled
                />
              </TooltipTrigger>
              <TooltipContent>
                Authentication required to add devices
              </TooltipContent>
            </Tooltip>
          ) : (
            <Checkbox
              id={`param-${codeIndex}-${param.name}`}
              checked={value === "true"}
              onCheckedChange={(checked) =>
                handleParameterChange(
                  codeIndex,
                  param.name,
                  checked ? "true" : "false",
                )
              }
            />
          )}
          <Label
            htmlFor={`param-${codeIndex}-${param.name}`}
            className="text-sm"
          >
            {param.label}
          </Label>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={`param-${codeIndex}-${param.name}`}>
          {param.label}{" "}
          {param.required && <span className="text-red-500">*</span>}
        </Label>
        {!isAuthenticated ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id={`param-${codeIndex}-${param.name}`}
                value={value}
                onChange={(e) =>
                  handleParameterChange(codeIndex, param.name, e.target.value)
                }
                placeholder={param.placeholder}
                className={`${
                  param.type === "bytes" || param.type === "list"
                    ? "font-mono text-sm"
                    : ""
                } ${errors.codes?.[codeIndex]?.parameters?.[param.name] ? "border-red-500" : ""}`}
                disabled
              />
            </TooltipTrigger>
            <TooltipContent>
              Authentication required to add devices
            </TooltipContent>
          </Tooltip>
        ) : (
          <Input
            id={`param-${codeIndex}-${param.name}`}
            value={value}
            onChange={(e) =>
              handleParameterChange(codeIndex, param.name, e.target.value)
            }
            placeholder={param.placeholder}
            className={`${
              param.type === "bytes" || param.type === "list"
                ? "font-mono text-sm"
                : ""
            } ${errors.codes?.[codeIndex]?.parameters?.[param.name] ? "border-red-500" : ""}`}
          />
        )}
        {param.description && (
          <p className="text-xs text-muted-foreground">{param.description}</p>
        )}
        {errors.codes?.[codeIndex]?.parameters?.[param.name] && (
          <p className="text-sm text-red-500 mt-1">
            {errors.codes[codeIndex].parameters![param.name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>ESPHome Remote Codes</span>
              <Badge variant="outline">Step 2</Badge>
              <Badge variant="secondary">{protocol.toUpperCase()}</Badge>
            </CardTitle>
            {!isAuthenticated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={addCodeField}
                    size="sm"
                    disabled
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Code
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Authentication required to add devices
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button type="button" onClick={addCodeField} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Code
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              All codes will use the <strong>{protocol.toUpperCase()}</strong>{" "}
              protocol. Copy the parameter values from your ESPHome dumper
              output.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {codes.map((code, index) => (
              <Card key={index} className="border-dashed">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`code-name-${index}`}>
                          Function Name <span className="text-red-500">*</span>
                        </Label>
                        {!isAuthenticated ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                id={`code-name-${index}`}
                                value={code.name}
                                onChange={(e) =>
                                  handleCodeChange(
                                    index,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g., Power On/Off, Volume Up, Channel Down"
                                disabled
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              Authentication required to add devices
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Input
                            id={`code-name-${index}`}
                            value={code.name}
                            onChange={(e) =>
                              handleCodeChange(index, "name", e.target.value)
                            }
                            placeholder="e.g., Power On/Off, Volume Up, Channel Down"
                            className={errors.codes?.[index]?.name ? "border-red-500" : ""}
                          />
                        )}
                        {errors.codes?.[index]?.name && (
                          <p className="text-sm text-red-500 mt-1">{errors.codes[index].name}</p>
                        )}
                      </div>
                      {codes.length > 1 ? (
                        !isAuthenticated ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeCodeField(index)}
                                className="shrink-0"
                                disabled
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Authentication required to add devices
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeCodeField(index)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )
                      ) : null}
                    </div>

                    {protocol && protocolParameters[protocol] && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">
                          Protocol Parameters
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {protocolParameters[protocol].map((param) => (
                            <div key={param.name}>
                              {renderParameterInput(index, param)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border-l-4 border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              ESPHome Tips:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>
                • Use the ESPHome remote receiver dumper to get the exact
                parameter values
              </li>
              <li>• Copy the values exactly as shown in the dumper output</li>
              <li>
                • For hex values, include the 0x prefix (e.g., 0x20DF10EF)
              </li>
              <li>• For byte arrays, use the format [0xA1, 0x82, 0x40, ...]</li>
              <li>• Test your codes with ESPHome before submitting</li>
            </ul>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onPrevStep}>
              Back to Device Details
            </Button>
            {!isAuthenticated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onSubmit} size="lg" disabled>
                    <Save className="mr-2 h-4 w-4" />
                    Add Device
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Authentication required to add devices
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button onClick={onSubmit} size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Device...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Device
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
