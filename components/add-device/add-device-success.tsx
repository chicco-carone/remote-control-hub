"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Id } from "@/convex/_generated/dataModel";
import { ESPHomeCode } from "@/types/form";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddDeviceSuccessProps {
  formData: {
    name: string;
    manufacturer: string;
    model: string;
    deviceType: string;
    notes: string;
    protocol: string;
  };
  codes: ESPHomeCode[];
  newDeviceId: Id<"devices"> | null;
  onReset: () => void;
}

export function AddDeviceSuccess({
  formData,
  codes,
  newDeviceId,
  onReset,
}: AddDeviceSuccessProps) {
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Device Added Successfully!
              </h2>
              <p className="text-muted-foreground">
                Your ESPHome device &quot;{formData.name}&quot; with{" "}
                {formData.protocol.toUpperCase()} protocol has been added to the
                Remote Control Hub.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Device:</span>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Brand:</span>
                  <p className="font-medium">{formData.manufacturer}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Protocol:</span>
                  <p className="font-medium">
                    {formData.protocol.toUpperCase()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Codes:</span>
                  <p className="font-medium">
                    {codes.filter((c) => c.name.trim()).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {newDeviceId && (
                <Button
                  onClick={() => router.push(`/device/${newDeviceId}`)}
                  size="lg"
                >
                  View Device
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                size="lg"
              >
                Browse Devices
              </Button>
              <Button variant="ghost" onClick={onReset} size="lg">
                Add Another Device
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
