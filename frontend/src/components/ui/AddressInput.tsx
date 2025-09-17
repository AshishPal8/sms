"use client";
import React, { useMemo } from "react";
import { Country, State, City } from "country-state-city";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Address } from "@/types/address.types";

type Props = {
  value?: Address | null;
  onChange?: (val: Address) => void;
  disabled?: boolean;
  className?: string;
};

export default function AddressInput({
  value,
  onChange,
  disabled,
  className,
}: Props) {
  const currentValue = value || {
    houseNumber: "",
    locality: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  };

  const updateField = (field: keyof Address, newValue: string) => {
    const updated = { ...currentValue, [field]: newValue };

    // Clear dependent fields when parent changes
    if (field === "country") {
      updated.state = "";
      updated.city = "";
    } else if (field === "state") {
      updated.city = "";
    }

    onChange?.(updated);
  };

  // Get countries, states, cities
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () =>
      currentValue.country
        ? State.getStatesOfCountry(currentValue.country)
        : [],
    [currentValue.country]
  );
  const cities = useMemo(
    () =>
      currentValue.country && currentValue.state
        ? City.getCitiesOfState(currentValue.country, currentValue.state)
        : [],
    [currentValue.country, currentValue.state]
  );

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      <FormItem>
        <FormLabel>House / Flat No.</FormLabel>
        <FormControl>
          <Input
            disabled={disabled}
            value={currentValue.houseNumber || ""}
            onChange={(e) => updateField("houseNumber", e.target.value)}
            placeholder="House number"
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Locality / Street</FormLabel>
        <FormControl>
          <Input
            disabled={disabled}
            value={currentValue.locality || ""}
            onChange={(e) => updateField("locality", e.target.value)}
            placeholder="Locality or street"
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Country</FormLabel>
        <FormControl>
          <Select
            value={currentValue.country || ""}
            onValueChange={(val) => updateField("country", val)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>State</FormLabel>
        <FormControl>
          <Select
            value={currentValue.state || ""}
            onValueChange={(val) => updateField("state", val)}
            disabled={disabled || !states.length}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  states.length ? "Select state" : "Select country first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>City</FormLabel>
        <FormControl>
          <Select
            value={currentValue.city || ""}
            onValueChange={(val) => updateField("city", val)}
            disabled={disabled || !cities.length}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  cities.length ? "Select city" : "Select state first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Postal Code</FormLabel>
        <FormControl>
          <Input
            disabled={disabled}
            value={currentValue.postalCode || ""}
            onChange={(e) => updateField("postalCode", e.target.value)}
            placeholder="Pin / Postal code"
            maxLength={6}
          />
        </FormControl>
      </FormItem>
    </div>
  );
}
