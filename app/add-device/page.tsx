"use client";

import { AddDeviceHeader } from "@/components/add-device/add-device-header";
import { AddDeviceProgress } from "@/components/add-device/add-device-progress";
import { AddDeviceSuccess } from "@/components/add-device/add-device-success";
import { DeviceDetailsForm } from "@/components/add-device/device-details-form";
import { ESPHomeCaptureInterface } from "@/components/add-device/esphome-capture-interface";
import { ESPHomeCodesForm } from "@/components/add-device/esphome-codes-form";
import { ESPHomeConnectionForm } from "@/components/add-device/esphome-connection-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { esphomeAPI } from "@/lib/esphome-api";
import { protocolParameters } from "@/lib/esphome-constants";
import { transmitActionSchema } from "@/lib/esphome-validation";
import { ZodError } from "zod";
import type { ESPHomeConnection, ESPHomeDevice } from "@/types/esphome";
import { CapturedButtonCode } from "@/types/esphome";
import { ESPHomeCode, FormData, FormErrors } from "@/types/form";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, Edit, Radio } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddDevicePage() {
  const { isAuthenticated } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState<Id<"devices"> | null>(null);

  const createDevice = useMutation(api.mutations.devices.createDevice);
  const upsertUser = useMutation(api.mutations.users.upsertUser);
  const convexUser = useQuery(api.queries.viewer, { lastUpsert: undefined });
  const { user: clerkUser } = useUser();

  // Upsert user when authenticated and user data is available
  useEffect(() => {
    if (
      clerkUser &&
      convexUser &&
      "_isTemporary" in convexUser &&
      convexUser._isTemporary
    ) {
      upsertUser({
        clerkId: clerkUser.id,
        name:
          clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || undefined,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        username:
          clerkUser.username ||
          clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
          "user",
        image: clerkUser.imageUrl || "",
        emailVerificationTime:
          clerkUser.primaryEmailAddress?.verification?.status === "verified"
            ? Date.now()
            : undefined,
      });
    }
  }, [clerkUser, convexUser, upsertUser]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    manufacturer: "",
    model: "",
    deviceType: "",
    notes: "",
    protocol: "",
  });

  const [codes, setCodes] = useState<ESPHomeCode[]>([
    { name: "", protocol: "", parameters: {} },
  ]);

  const [errors, setErrors] = useState<FormErrors>({});

  const [captureMethod, setCaptureMethod] = useState<"manual" | "esphome">(
    "manual",
  );
  const [espHomeConnection, setEspHomeConnection] =
    useState<ESPHomeConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (field === "protocol") {
      setCodes((prev) =>
        prev.map((code) => ({
          ...code,
          protocol: value,
          parameters: {},
        })),
      );
    }
  };

  const handleCodeChange = (index: number, field: "name", value: string) => {
    setCodes((prev) =>
      prev.map((code, i) => (i === index ? { ...code, [field]: value } : code)),
    );

    if (errors.codes) {
      setErrors((prev) => ({ ...prev, codes: undefined }));
    }
  };

  const handleParameterChange = (
    codeIndex: number,
    paramName: string,
    value: string | number | boolean,
  ) => {
    setCodes((prev) =>
      prev.map((code, i) =>
        i === codeIndex
          ? { ...code, parameters: { ...code.parameters, [paramName]: value } }
          : code,
      ),
    );
  };

  const addCodeField = () => {
    setCodes((prev) => [
      ...prev,
      { name: "", protocol: formData.protocol, parameters: {} },
    ]);
  };

  const removeCodeField = (index: number) => {
    if (codes.length > 1) {
      setCodes((prev) => prev.filter((_, i) => i !== index));
    }
  };


  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Device name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Device name must be at least 3 characters";
    }

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = "Manufacturer is required";
    }

    if (!formData.deviceType) {
      newErrors.deviceType = "Device type is required";
    }

    if (!formData.protocol) {
      newErrors.protocol = "ESPHome protocol is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    const validCodes = codes.filter((code) => code.name.trim());

    if (validCodes.length === 0) {
      newErrors.codes = {};
      setErrors(newErrors);
      return false;
    }

    let hasErrors = false;

    validCodes.forEach((code, index) => {
      const codeErrors: { name?: string; parameters?: { [key: string]: string } } = {};

      // Validate name
      if (!code.name.trim()) {
        codeErrors.name = "Function name is required";
        hasErrors = true;
      }

      // Validate parameters using Zod
      try {
        const paramsToValidate: Record<string, unknown> = {};

        // Convert string parameters to appropriate types for Zod validation
        Object.entries(code.parameters).forEach(([key, value]) => {
          if (typeof value === 'string') {
            // Try to parse as number
            const numValue = Number(value);
            if (!isNaN(numValue) && value.trim() !== '') {
              paramsToValidate[key] = numValue;
            } else if (value === 'true') {
              paramsToValidate[key] = true;
            } else if (value === 'false') {
              paramsToValidate[key] = false;
            } else if (value.startsWith('[') && value.endsWith(']')) {
              // Handle array format like [0xA1, 0x82, 0x40]
              try {
                const arrayStr = value.slice(1, -1);
                const arrayValues = arrayStr.split(',').map(s => {
                  const trimmed = s.trim();
                  if (trimmed.startsWith('0x')) {
                    return parseInt(trimmed, 16);
                  }
                  return parseInt(trimmed, 10);
                });
                paramsToValidate[key] = arrayValues;
              } catch {
                paramsToValidate[key] = value;
              }
            } else {
              paramsToValidate[key] = value;
            }
          } else {
            paramsToValidate[key] = value;
          }
        });

        // Validate with Zod
        const validationData = {
          protocol: code.protocol,
          params: paramsToValidate
        };

        console.log('Validating code:', code.name, 'protocol:', code.protocol);
        console.log('Validation data:', validationData);

        transmitActionSchema.parse(validationData);

        console.log('Validation passed for:', code.name);
      } catch (error) {
        if (error instanceof ZodError) {
          console.log('Validation failed for:', code.name, 'errors:', error.issues);
          codeErrors.parameters = {};
          error.issues.forEach((issue) => {
            if (issue.path.length > 1 && issue.path[0] === 'params') {
              const paramName = issue.path[1] as string;
              codeErrors.parameters![paramName] = issue.message;
            } else {
              console.log('Unexpected error path:', issue.path, 'message:', issue.message);
            }
          });
          hasErrors = true;
        } else {
          console.log('Non-Zod error during validation:', error);
        }
      }

      if (codeErrors.name || codeErrors.parameters) {
        if (!newErrors.codes) newErrors.codes = {};
        newErrors.codes[index] = codeErrors;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatCodeForSubmission = (code: ESPHomeCode) => {
    const protocolParams = protocolParameters[code.protocol] || [];
    let formattedCode = `${code.protocol}:\n`;

    for (const param of protocolParams) {
      const value = code.parameters[param.name];
      if (value !== undefined && value !== "") {
        if (param.type === "string") {
          formattedCode += `  ${param.name}: "${value}"\n`;
        } else if (param.type === "boolean") {
          formattedCode += `  ${param.name}: ${value}\n`;
        } else {
          formattedCode += `  ${param.name}: ${value}\n`;
        }
      }
    }

    return formattedCode.trim();
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const validCodes = codes.filter((code) => code.name.trim());
      const formattedCodes = validCodes.map((code) => ({
        name: code.name,
        code: formatCodeForSubmission(code),
      }));

      const result = await createDevice({
        name: formData.name,
        manufacturer: formData.manufacturer,
        model: formData.model || undefined,
        deviceType: formData.deviceType,
        notes: formData.notes || undefined,
        codes: formattedCodes,
      });

      if (result) {
        setNewDeviceId(result.deviceId);
        setSubmitSuccess(true);
        setCurrentStep(3);
      }
    } catch (error) {
      console.error("Failed to submit device:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 1:
        return 33;
      case 2:
        return 66;
      case 3:
        return 100;
      default:
        return 0;
    }
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 5;

    if (formData.name.trim()) completed++;
    if (formData.manufacturer.trim()) completed++;
    if (formData.deviceType) completed++;
    if (formData.protocol) completed++;
    if (codes.some((code) => code.name.trim())) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setCurrentStep(1);
    setFormData({
      name: "",
      manufacturer: "",
      model: "",
      deviceType: "",
      notes: "",
      protocol: "",
    });
    setCodes([{ name: "", protocol: "", parameters: {} }]);
    setErrors({});
  };

  const handleESPHomeConnect = async (device: ESPHomeDevice) => {
    setIsConnecting(true);
    setConnectionError(undefined);

    try {
      const connection = await esphomeAPI.connect(device, formData.protocol);
      setEspHomeConnection(connection);
    } catch (error) {
      setConnectionError(
        error instanceof Error ? error.message : "Connection failed",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleESPHomeCodesReady = (capturedCodes: CapturedButtonCode[]) => {
    const formattedCodes = capturedCodes.map((item) => ({
      name: item.button.name,
      protocol: formData.protocol,
      parameters: item.code!.parameters,
    }));
    setCodes(formattedCodes);
    setCurrentStep(3);
  };

  if (submitSuccess) {
    return (
      <>
        <AddDeviceHeader
          title="Success!"
          description="Your ESPHome device has been added successfully"
        />
        <AddDeviceSuccess
          formData={formData}
          codes={codes}
          newDeviceId={newDeviceId}
          onReset={handleResetForm}
        />
      </>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <AddDeviceHeader
          title="Add ESPHome Device"
          description="Share remote control codes for ESPHome users"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <AddDeviceProgress
              currentStep={currentStep}
              getStepProgress={getStepProgress}
              getCompletionPercentage={getCompletionPercentage}
            />

            {errors.general && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {currentStep === 1 && (
              <DeviceDetailsForm
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
              />
            )}

            {currentStep === 1 && (
              <div className="pt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Capture Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {!isAuthenticated ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card className="cursor-not-allowed opacity-50">
                              <CardContent className="p-4 text-center">
                                <Edit className="h-8 w-8 mx-auto mb-2" />
                                <h3 className="font-medium">Manual Entry</h3>
                                <p className="text-sm text-muted-foreground">
                                  Enter codes manually
                                </p>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent>
                            Authentication required to add devices
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Card
                          className={`cursor-pointer transition-colors ${captureMethod === "manual" ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => setCaptureMethod("manual")}
                        >
                          <CardContent className="p-4 text-center">
                            <Edit className="h-8 w-8 mx-auto mb-2" />
                            <h3 className="font-medium">Manual Entry</h3>
                            <p className="text-sm text-muted-foreground">
                              Enter codes manually
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {!isAuthenticated ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card className="cursor-not-allowed opacity-50">
                              <CardContent className="p-4 text-center">
                                <Radio className="h-8 w-8 mx-auto mb-2" />
                                <h3 className="font-medium">ESPHome Capture</h3>
                                <p className="text-sm text-muted-foreground">
                                  Capture directly from device
                                </p>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent>
                            Authentication required to add devices
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Card
                          className={`cursor-pointer transition-colors ${captureMethod === "esphome" ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => setCaptureMethod("esphome")}
                        >
                          <CardContent className="p-4 text-center">
                            <Radio className="h-8 w-8 mx-auto mb-2" />
                            <h3 className="font-medium">ESPHome Capture</h3>
                            <p className="text-sm text-muted-foreground">
                              Capture directly from device
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex justify-end mt-6">
                {!isAuthenticated ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleNextStep} size="lg" disabled>
                        Continue to Remote Codes
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Authentication required to add devices
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    onClick={handleNextStep}
                    size="lg"
                    disabled={
                      !formData.name ||
                      !formData.manufacturer ||
                      !formData.deviceType ||
                      !formData.protocol
                    }
                  >
                    Continue to Remote Codes
                  </Button>
                )}
              </div>
            )}

            {currentStep === 2 && captureMethod === "manual" && (
              <ESPHomeCodesForm
                codes={codes}
                protocol={formData.protocol}
                errors={errors}
                isSubmitting={isSubmitting}
                handleCodeChange={handleCodeChange}
                handleParameterChange={handleParameterChange}
                addCodeField={addCodeField}
                removeCodeField={removeCodeField}
                onPrevStep={handlePrevStep}
                onSubmit={handleSubmit}
              />
            )}

            {currentStep === 2 &&
              captureMethod === "esphome" &&
              !espHomeConnection && (
                <ESPHomeConnectionForm
                  onConnect={handleESPHomeConnect}
                  isConnecting={isConnecting}
                  connectionError={connectionError}
                  isConnected={!!espHomeConnection}
                />
              )}

            {currentStep === 2 &&
              captureMethod === "esphome" &&
              espHomeConnection && (
                <ESPHomeCaptureInterface
                  connection={espHomeConnection}
                  protocol={formData.protocol}
                  deviceType={formData.deviceType}
                  deviceName={formData.name}
                  manufacturer={formData.manufacturer}
                  model={formData.model}
                  onCodesReady={handleESPHomeCodesReady}
                />
              )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
