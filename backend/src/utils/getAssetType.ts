import { AssetType } from "../generated/prisma";

export const getAssetTypeFromUrl = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return AssetType.IMAGE;

    case "mp4":
    case "mov":
    case "avi":
      return AssetType.VIDEO;

    case "mp3":
    case "wav":
      return AssetType.AUDIO;

    case "pdf":
      return AssetType.PDF;
    case "doc":
    case "docx":
      return AssetType.DOC;

    case "xls":
    case "xlsx":
      return AssetType.EXCEL;

    default:
      return AssetType.OTHER;
  }
};
