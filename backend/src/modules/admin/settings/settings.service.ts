import prisma from "../../../db";
import { BadRequestError } from "../../../middlewares/error";
import { allowedFormats } from "../../../utils/allowedDateformat";
import { SETTINGS_KEY } from "../../../utils/config";
import type { updateSettingsInput } from "./settings.schema";

export const updateSettingsService = async (data: updateSettingsInput) => {
  const { dateFormat } = data;

  if (!allowedFormats.includes(dateFormat)) {
    throw new BadRequestError("Invalid date format");
  }

  const updated = await prisma.settings.upsert({
    where: { key: SETTINGS_KEY },
    update: { dateFormat },
    create: { key: SETTINGS_KEY, dateFormat },
  });

  return {
    success: true,
    message: "Settings updated successfully",
    data: updated,
  };
};

export const getSettingsService = async () => {
  let settings = await prisma.settings.findUnique({
    where: { key: SETTINGS_KEY },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        key: SETTINGS_KEY,
        dateFormat: "dd/MM/yyyy",
      },
    });
  }

  return {
    success: true,
    message: "Settings fetched successfully",
    data: settings,
  };
};
