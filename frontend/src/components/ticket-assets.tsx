"use client";
import { AssetType } from "@/enums/TicketAssetTypes";
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Music,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface IAsset {
  id: string;
  url: string;
  type: AssetType;
}

export default function TicketAssets({ assets }: { assets?: IAsset[] }) {
  const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null);

  if (!assets || assets.length === 0) return null;

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "file";
    link.click();
  };

  const handleOpen = (asset: IAsset) => {
    if (asset.type === AssetType.IMAGE || asset.type === AssetType.VIDEO) {
      setSelectedAsset(asset);
    } else {
      window.open(asset.url, "_blank");
    }
  };

  const renderAsset = (asset: IAsset) => {
    switch (asset.type) {
      case AssetType.IMAGE:
        return (
          <Image
            src={`${asset.url}`}
            alt="Asset"
            width={128}
            height={128}
            className="w-full h-32 object-cover cursor-pointer hover:opacity-90"
            onClick={() => handleOpen(asset)}
          />
        );

      case AssetType.VIDEO:
        return (
          <video
            className="w-full h-32 object-cover cursor-pointer"
            onClick={() => handleOpen(asset)}
          >
            <source src={asset.url} />
            Your browser does not support the video tag.
          </video>
        );

      case AssetType.AUDIO:
        return (
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music size={18} className="text-blue-500" />
              <span className="text-sm font-medium">Audio File</span>
            </div>
            <button
              onClick={() => handleDownload(asset.url)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Download size={18} />
            </button>
          </div>
        );

      case AssetType.PDF:
      case AssetType.DOC:
      case AssetType.EXCEL:
      case AssetType.OTHER:
        const Icon =
          asset.type === AssetType.PDF
            ? FileText
            : asset.type === AssetType.EXCEL
            ? FileSpreadsheet
            : File;
        return (
          <div
            onClick={() => handleOpen(asset)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Icon size={18} className="text-gray-500" />
              <span className="text-sm font-medium">{asset.type} File</span>
            </div>
            <Download
              size={18}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(asset.url);
              }}
              className="text-blue-600 hover:text-blue-800"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
          >
            {renderAsset(asset)}
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative max-w-3xl w-full p-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAsset(null);
              }}
              className="absolute z-10 top-4 right-4 bg-white rounded-full p-2 shadow cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {selectedAsset.type === AssetType.IMAGE && (
              <Image
                src={selectedAsset.url}
                alt="Preview"
                width={700}
                height={400}
                className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />
            )}

            {selectedAsset.type === AssetType.VIDEO && (
              <video
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-lg shadow-lg"
              >
                <source src={selectedAsset.url} />
              </video>
            )}
          </div>
        </div>
      )}
    </>
  );
}
