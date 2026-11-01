"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  getDeliveryEstimate,
  type DeliveryEstimate,
} from "@/lib/api/delivery";
import { CheckoutError } from "@/lib/api/orders";
import { checkoutFieldClass, digitsOnly } from "@/lib/checkout";
import { formatDeliveryRange } from "@/lib/date";

const INVALID_PIN = "Please enter a valid 6-digit PIN code.";
const GENERIC_ERROR = "Unable to check delivery right now. Please try again.";
const UNSERVICEABLE = "Delivery is currently unavailable for this PIN code.";

type DeliveryEstimatorProps = {
  /** Prefill the standalone input (product page). */
  initialPincode?: string;
  /**
   * Controlled PIN from checkout address fields.
   * When set, the input/check UI is hidden and estimates auto-run
   * once the value is a valid 6-digit PIN (debounced).
   */
  pincode?: string;
  /** Debounce for controlled/auto mode. Default 400ms. */
  debounceMs?: number;
  className?: string;
  /** Tighter layout for checkout. */
  compact?: boolean;
};

type ResultState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "invalid"; message: string }
  | { kind: "error"; message: string }
  | { kind: "unserviceable"; message: string }
  | { kind: "success"; estimate: DeliveryEstimate };

function isValidPincode(value: string) {
  return /^\d{6}$/.test(value);
}

export default function DeliveryEstimator({
  initialPincode = "",
  pincode: controlledPincode,
  debounceMs = 400,
  className = "",
  compact = false,
}: DeliveryEstimatorProps) {
  const isControlled = controlledPincode !== undefined;
  const inputId = useId();
  const [inputValue, setInputValue] = useState(() =>
    digitsOnly(initialPincode).slice(0, 6)
  );
  const [result, setResult] = useState<ResultState>({ kind: "idle" });
  /** PIN that the current non-idle result belongs to. */
  const [resultPincode, setResultPincode] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const activePincode = isControlled
    ? digitsOnly(controlledPincode).slice(0, 6)
    : digitsOnly(inputValue).slice(0, 6);

  async function runEstimate(pincode: string) {
    if (!isValidPincode(pincode)) {
      setResult({ kind: "invalid", message: INVALID_PIN });
      setResultPincode(pincode);
      return;
    }

    const requestId = ++requestIdRef.current;
    setResult({ kind: "loading" });
    setResultPincode(pincode);

    try {
      const estimate = await getDeliveryEstimate(pincode);
      if (requestId !== requestIdRef.current) return;

      if (!estimate.serviceable) {
        setResult({ kind: "unserviceable", message: UNSERVICEABLE });
        setResultPincode(pincode);
        return;
      }

      setResult({ kind: "success", estimate });
      setResultPincode(pincode);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      const message =
        error instanceof CheckoutError && error.message
          ? error.message
          : GENERIC_ERROR;
      setResult({ kind: "error", message });
      setResultPincode(pincode);
    }
  }

  function handleCheck() {
    const pin = digitsOnly(inputValue).slice(0, 6);
    if (pin !== inputValue) setInputValue(pin);
    void runEstimate(pin);
  }

  // Drop stale results (including in-flight) when the PIN no longer matches.
  useEffect(() => {
    if (result.kind === "idle") return;
    if (resultPincode === activePincode) return;

    requestIdRef.current += 1;
    setResult({ kind: "idle" });
    setResultPincode(null);
  }, [activePincode, result.kind, resultPincode]);

  // Controlled mode: debounce auto-check when PIN becomes valid.
  useEffect(() => {
    if (!isControlled) return;

    if (!isValidPincode(activePincode)) {
      requestIdRef.current += 1;
      setResult({ kind: "idle" });
      setResultPincode(null);
      return;
    }

    if (
      resultPincode === activePincode &&
      (result.kind === "success" ||
        result.kind === "unserviceable" ||
        result.kind === "error" ||
        result.kind === "loading")
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void runEstimate(activePincode);
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled, activePincode, debounceMs]);

  const busy = result.kind === "loading";
  const showForm = !isControlled;
  // Only show result UI when it still matches the current PIN.
  const displayResult =
    result.kind !== "idle" && resultPincode === activePincode ? result : null;

  if (isControlled && !displayResult) {
    return null;
  }

  return (
    <div className={className}>
      {!compact ? (
        <h3 className="text-sm font-semibold text-gray-900">
          Check Delivery Availability
        </h3>
      ) : (
        <p className="text-sm font-semibold text-gray-900">Estimated delivery</p>
      )}

      {showForm ? (
        <div className="mt-2 flex gap-2">
          <label htmlFor={inputId} className="sr-only">
            6-digit PIN code
          </label>
          <input
            id={inputId}
            className={checkoutFieldClass}
            value={inputValue}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="Enter 6-digit PIN code"
            aria-invalid={
              displayResult?.kind === "invalid" || displayResult?.kind === "error"
            }
            aria-describedby={`${inputId}-status`}
            disabled={busy}
            onChange={(e) => {
              setInputValue(digitsOnly(e.target.value).slice(0, 6));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!busy) handleCheck();
              }
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={handleCheck}
            className="shrink-0 border border-[#A02C68] px-4 text-sm font-semibold text-[#A02C68] transition hover:bg-[#FBF0F4] disabled:opacity-60"
          >
            {busy ? "…" : "Check"}
          </button>
        </div>
      ) : null}

      <div
        id={`${inputId}-status`}
        className={showForm || compact ? "mt-2" : "mt-1"}
        aria-live="polite"
        aria-busy={busy}
      >
        {displayResult?.kind === "loading" ? (
          <p className="text-xs text-gray-500">Checking delivery…</p>
        ) : null}

        {displayResult?.kind === "invalid" || displayResult?.kind === "error" ? (
          <p className="text-xs text-red-700">{displayResult.message}</p>
        ) : null}

        {displayResult?.kind === "unserviceable" ? (
          <p className="text-xs text-red-700">{displayResult.message}</p>
        ) : null}

        {displayResult?.kind === "success" ? (
          <div className="border border-[#E8D0DA] bg-[#FBF0F4] px-3 py-3">
            {!compact ? (
              <p className="text-xs font-semibold tracking-wide text-[#A02C68] uppercase">
                Estimated delivery
              </p>
            ) : null}
            <p
              className={`${compact ? "" : "mt-1 "}text-base font-semibold text-gray-900`}
            >
              {formatDeliveryRange(
                displayResult.estimate.estimatedDelivery.from,
                displayResult.estimate.estimatedDelivery.to
              )}
            </p>
            {displayResult.estimate.region?.name ? (
              <p className="mt-1 text-sm text-gray-600">
                Delivery to {displayResult.estimate.region.name}
              </p>
            ) : null}
            {!compact ? (
              <p className="mt-1 text-xs text-gray-500">
                Includes preparation and courier transit time.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
