import { toast } from "sonner";
import axios from "axios";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";

type ApiErrorResponse = {
  message?: string;
  error?: Record<string, string[] | string>;
};

export function handleApiError<T extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>
) {
  if (!axios.isAxiosError(error)) {
    toast.error("Something went wrong");
    console.error("Unexpected error:", error);
    return;
  }

  const data = error.response?.data as ApiErrorResponse | undefined;

  if (data?.error) {
    Object.entries(data.error).forEach(([field, msgs]) => {
      const message = Array.isArray(msgs) ? msgs[0] : String(msgs);
      setError?.(field as Path<T>, { type: "server", message });
      console.error(`Validation error on ${field}:`, message);
    });

    toast.error(
      Object.values(data.error)[0]?.[0] || data.message || "Validation failed"
    );
    return;
  }

  toast.error(data?.message || error.message || "Unexpected error");
}
