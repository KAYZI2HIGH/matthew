"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

interface CryptoTaxFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CRYPTO_STEPS = [
  "Input Method",
  "Transaction Details",
  "Dates & Fees",
  "Documents",
];

export function CryptoTaxForm({ onSubmit, onCancel }: CryptoTaxFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputMethod, setInputMethod] = useState<"manual" | "hash">("manual");
  const [formData, setFormData] = useState({
    tokenName: "",
    quantity: "",
    buyPrice: "",
    sellPrice: "",
    gasFees: "",
    transactionHash: "",
    purchaseDate: "",
    saleDate: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      inputMethod,
      documents: uploadedFiles,
    };
    onSubmit(payload);
  };

  const handleNext = () => {
    if (currentStep < CRYPTO_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercent = (currentStep / CRYPTO_STEPS.length) * 100;

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-sm tracking-wide">
          Crypto Tax Calculator
        </DialogTitle>
        <DialogDescription className="text-xs">
          Calculate your crypto capital gains tax
        </DialogDescription>
        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden -mx-6 mt-2">
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <ScrollArea className="h-68 pr-2">
          {/* Step 1: Input Method */}
          {currentStep === 1 && (
            <FieldGroup className="gap-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setInputMethod("manual")}
                  variant={inputMethod === "manual" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs h-8"
                >
                  Manual Entry
                </Button>
                <Button
                  type="button"
                  onClick={() => setInputMethod("hash")}
                  variant={inputMethod === "hash" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs h-8"
                >
                  Transaction Hash
                </Button>
              </div>
            </FieldGroup>
          )}

          {/* Step 2: Transaction Details */}
          {currentStep === 2 && (
            <FieldGroup className="gap-3">
              <FieldGroup className="gap-2">
                {inputMethod === "manual" ? (
                  <>
                    <Field>
                      <FieldLabel
                        className="text-xs"
                        htmlFor="token-name"
                      >
                        Token Name
                      </FieldLabel>
                      <FieldContent className="gap-1">
                        <Input
                          id="token-name"
                          type="text"
                          className="text-xs h-8"
                          value={formData.tokenName}
                          onChange={(e) =>
                            handleChange("tokenName", e.target.value)
                          }
                          placeholder="e.g., Bitcoin, Ethereum"
                        />
                        <FieldDescription className="text-xs">
                          The name of the cryptocurrency you bought/sold (e.g.,
                          Bitcoin, Ethereum, Cardano)
                        </FieldDescription>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel
                        className="text-xs"
                        htmlFor="quantity"
                      >
                        Quantity
                      </FieldLabel>
                      <FieldContent className="gap-1">
                        <Input
                          id="quantity"
                          type="number"
                          step="0.00000001"
                          className="text-xs h-8"
                          value={formData.quantity}
                          onChange={(e) =>
                            handleChange("quantity", e.target.value)
                          }
                          placeholder="e.g., 2.5"
                        />
                        <FieldDescription className="text-xs">
                          How much of the cryptocurrency you bought/sold
                        </FieldDescription>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel
                        className="text-xs"
                        htmlFor="buy-price"
                      >
                        Buy Price (₦/unit)
                      </FieldLabel>
                      <FieldContent className="gap-1">
                        <Input
                          id="buy-price"
                          type="number"
                          className="text-xs h-8"
                          value={formData.buyPrice}
                          onChange={(e) =>
                            handleChange("buyPrice", e.target.value)
                          }
                          placeholder="e.g., 60000000"
                        />
                        <FieldDescription className="text-xs">
                          The price in Naira for one unit when you bought it
                        </FieldDescription>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel
                        className="text-xs"
                        htmlFor="sell-price"
                      >
                        Sell Price (₦/unit)
                      </FieldLabel>
                      <FieldContent className="gap-1">
                        <Input
                          id="sell-price"
                          type="number"
                          className="text-xs h-8"
                          value={formData.sellPrice}
                          onChange={(e) =>
                            handleChange("sellPrice", e.target.value)
                          }
                          placeholder="e.g., 120000000"
                        />
                        <FieldDescription className="text-xs">
                          The price in Naira for one unit when you sold it
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </>
                ) : (
                  <>
                    <Field>
                      <FieldLabel
                        className="text-xs"
                        htmlFor="tx-hash"
                      >
                        Transaction Hash
                      </FieldLabel>
                      <FieldContent className="gap-1">
                        <Input
                          id="tx-hash"
                          type="text"
                          className="text-xs h-8"
                          value={formData.transactionHash}
                          onChange={(e) =>
                            handleChange("transactionHash", e.target.value)
                          }
                          placeholder="0x..."
                        />
                        <FieldDescription className="text-xs">
                          A unique identifier for your blockchain transaction
                          (found in your wallet or exchange records)
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                    <div className="p-2 bg-muted rounded border">
                      <p className="text-xs">
                        💡 <strong>Matthew will extract</strong> buy price, sell
                        price, and gas fees from the blockchain using this hash.
                      </p>
                    </div>
                  </>
                )}
              </FieldGroup>
            </FieldGroup>
          )}

          {/* Step 3: Dates & Fees */}
          {currentStep === 3 && (
            <FieldGroup className="gap-3">
              <FieldGroup className="gap-2">
                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="purchase-date"
                  >
                    Purchase Date
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="purchase-date"
                      type="date"
                      className="text-xs h-8"
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        handleChange("purchaseDate", e.target.value)
                      }
                    />
                    <FieldDescription className="text-xs">
                      The day you bought the cryptocurrency
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="sale-date"
                  >
                    Sale Date
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="sale-date"
                      type="date"
                      className="text-xs h-8"
                      value={formData.saleDate}
                      onChange={(e) => handleChange("saleDate", e.target.value)}
                    />
                    <FieldDescription className="text-xs">
                      The day you sold the cryptocurrency
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="gas-fees"
                  >
                    Gas Fees (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="gas-fees"
                      type="number"
                      className="text-xs h-8"
                      value={formData.gasFees}
                      onChange={(e) => handleChange("gasFees", e.target.value)}
                      placeholder="Transaction fees"
                    />
                    <FieldDescription className="text-xs">
                      The transaction fee you paid to the blockchain network
                      (cryptocurrency networks charge fees to process
                      transactions)
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldGroup>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <FieldGroup className="gap-3">
              <FieldGroup className="gap-2">
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="crypto-file-input"
                  />
                  <label
                    htmlFor="crypto-file-input"
                    className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-foreground hover:bg-muted transition-colors"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                    <span className="text-xs font-medium text-foreground">
                      Click to upload crypto receipts
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG, or Excel files
                    </span>
                  </label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="p-2 bg-muted rounded border">
                    <p className="text-xs font-medium mb-1">
                      {uploadedFiles.length} file(s) selected:
                    </p>
                    <ul className="text-xs space-y-0.5">
                      {uploadedFiles.map((file, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-1"
                        >
                          <span className="text-muted-foreground">📄</span>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </FieldGroup>
            </FieldGroup>
          )}
        </ScrollArea>

        {/* Navigation Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline"
            size="sm"
            className="text-xs h-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </Button>
          {currentStep < CRYPTO_STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              size="sm"
              className="flex-1 text-xs h-8"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              size="sm"
              className="flex-1 text-xs h-8"
            >
              Calculate Crypto Tax
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
