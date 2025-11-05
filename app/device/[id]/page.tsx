"use client";

import { ExportCodesDialog } from "@/components/add-device/export-codes-dialog";
import { DeviceHeader } from "@/components/device/device-header";
import { DeviceInfoCard } from "@/components/device/device-info-card";
import { DeviceSidebar } from "@/components/device/device-sidebar";
import { ExportInfoCard } from "@/components/device/export-info-card";
import { RemoteCodesList } from "@/components/device/remote-codes-list";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useClipboard } from "@/hooks/use-clipboard";
import { useDeviceState } from "@/hooks/use-device-state";
import { useExportLogic } from "@/hooks/use-export-logic";
import { useShare } from "@/hooks/use-share";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DevicePage() {
  const params = useParams();
  const deviceId = params.id as Id<"devices">;
  const device = useQuery(api.queries.getDeviceById, { id: deviceId });

  const { localDevice, handleVoteChange, effectiveness } =
    useDeviceState(device);

  const { copiedCode, copyToClipboard } = useClipboard();

  const { sharedRecently, handleShare } = useShare(
    localDevice?.name || "",
    localDevice?.manufacturer || "",
  );

  const {
    espHomeFormattedCodes,
    isExportDialogOpen,
    selectedExportFormat,
    handleDirectExport,
    handleOpenModal,
    handleCloseModal,
  } = useExportLogic(localDevice, "esphome");

  if (!localDevice) {
    return (
      <div className="min-h-screen bg-background">
        <DeviceHeader
          name="Device Not Found"
          manufacturer=""
          onDirectExport={() => {}}
          onShare={() => {}}
          sharedRecently={false}
        />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Device not found</h2>
            <p className="text-muted-foreground mb-4">
              The device you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/">
              <Button>Browse All Devices</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <DeviceHeader
        name={localDevice.name}
        manufacturer={localDevice.manufacturer}
        model={localDevice.model}
        onDirectExport={handleDirectExport}
        onShare={handleShare}
        sharedRecently={sharedRecently}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Info Card */}
            <DeviceInfoCard
              deviceType={localDevice.deviceType}
              effectiveness={effectiveness}
              uploadedAt={localDevice.uploadedAt}
              codeCount={localDevice.codes.length}
              notes={localDevice.notes}
            />

            {/* Export Information Card */}
            <ExportInfoCard
              codeCount={localDevice.codes.length}
              deviceType={localDevice.deviceType}
              manufacturer={localDevice.manufacturer}
              onOpenModal={handleOpenModal}
            />

            {/* Remote Codes */}
            <RemoteCodesList
              codes={localDevice.codes}
              deviceId={localDevice.id}
              canManage={Boolean((localDevice as any).canManage)}
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />
          </div>

          {/* Sidebar */}
          <DeviceSidebar
            uploadedBy={localDevice.uploadedBy}
            uploadedByImage={localDevice.uploadedByImage}
            codeCount={localDevice.codes.length}
            totalVotes={localDevice.totalVotes}
            effectiveness={effectiveness}
          />
        </div>
      </main>

      {/* Export Dialog */}
      <ExportCodesDialog
        isOpen={isExportDialogOpen}
        onClose={handleCloseModal}
        codes={espHomeFormattedCodes}
        deviceName={localDevice.name}
        deviceType={localDevice.deviceType}
        manufacturer={localDevice.manufacturer}
        model={localDevice.model}
        initialFormat={selectedExportFormat}
      />
    </div>
  );
}
