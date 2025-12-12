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

interface BusinessTaxFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const BUSINESS_STEPS = [
  "Business Info",
  "Revenue & Expenses",
  "Additional Income",
  "Documents",
];

export function BusinessTaxForm({ onSubmit, onCancel }: BusinessTaxFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    revenue: "",
    expenses: "",
    profit: "",
    salariesPaid: "",
    capitalGains: "",
    cryptoGains: "",
    allowableDeductions: "",
    exemptions: "",
    taxPaid: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };

    // Auto-calculate profit
    if (field === "revenue" || field === "expenses") {
      const rev = parseFloat(updated.revenue) || 0;
      const exp = parseFloat(updated.expenses) || 0;
      updated.profit = (rev - exp).toString();
    }

    setFormData(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      documents: uploadedFiles,
    });
  };

  const handleNext = () => {
    if (currentStep < BUSINESS_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercent = (currentStep / BUSINESS_STEPS.length) * 100;

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-sm tracking-wide">
          Business Tax Calculator
        </DialogTitle>
        <DialogDescription className="text-xs">
          Calculate CIT, Development Levy, and CGT
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
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <FieldGroup className="gap-3">
              <FieldGroup className="gap-2">
                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="business-name"
                  >
                    Business Name
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="business-name"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) =>
                        handleChange("businessName", e.target.value)
                      }
                      placeholder="e.g., Chioma's Fashion Boutique"
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      The official name of your business or company
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="tax-paid"
                  >
                    Tax Already Paid (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="tax-paid"
                      type="number"
                      value={formData.taxPaid}
                      onChange={(e) => handleChange("taxPaid", e.target.value)}
                      placeholder="Provisional tax or previous payments"
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      Provisional tax or any other business taxes you've already
                      paid this year
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldGroup>
          )}

          {/* Step 2: Revenue & Expenses */}
          {currentStep === 2 && (
            <FieldGroup className="gap-3">
              <FieldSet className="gap-2">
                <FieldLegend className="text-sm">
                  Revenue & Expenses
                </FieldLegend>
                <FieldDescription className="text-xs">
                  Your business income and costs
                </FieldDescription>
                <FieldGroup className="gap-2">
                  <Field>
                    <FieldLabel
                      className="text-xs"
                      htmlFor="revenue"
                    >
                      Annual Revenue (₦)
                    </FieldLabel>
                    <FieldContent className="gap-1">
                      <Input
                        id="revenue"
                        type="number"
                        value={formData.revenue}
                        onChange={(e) =>
                          handleChange("revenue", e.target.value)
                        }
                        placeholder="e.g., 15000000"
                        className="text-xs h-8"
                      />
                      <FieldDescription className="text-xs">
                        Total money your business earned before any costs (money
                        from all sales and services)
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      className="text-xs"
                      htmlFor="expenses"
                    >
                      Annual Expenses (₦)
                    </FieldLabel>
                    <FieldContent className="gap-1">
                      <Input
                        id="expenses"
                        type="number"
                        value={formData.expenses}
                        onChange={(e) =>
                          handleChange("expenses", e.target.value)
                        }
                        placeholder="e.g., 8000000"
                        className="text-xs h-8"
                      />
                      <FieldDescription className="text-xs">
                        Total money you spent to run your business (materials,
                        rent, utilities, salaries, etc.)
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      className="text-xs"
                      htmlFor="profit"
                    >
                      Profit Before Tax (₦)
                    </FieldLabel>
                    <FieldContent className="gap-1">
                      <Input
                        id="profit"
                        type="number"
                        value={formData.profit}
                        disabled
                        className="text-xs h-8"
                      />
                      <FieldDescription className="text-xs">
                        Revenue minus expenses (calculated automatically)
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      className="text-xs"
                      htmlFor="salaries"
                    >
                      Salaries Paid (₦)
                    </FieldLabel>
                    <FieldContent className="gap-1">
                      <Input
                        id="salaries"
                        type="number"
                        value={formData.salariesPaid}
                        onChange={(e) =>
                          handleChange("salariesPaid", e.target.value)
                        }
                        placeholder="Total staff salaries"
                        className="text-xs h-8"
                      />
                      <FieldDescription className="text-xs">
                        Total money you paid to all your employees during the
                        year
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      className="text-xs"
                      htmlFor="deductions"
                    >
                      Allowable Deductions (₦)
                    </FieldLabel>
                    <FieldContent className="gap-1">
                      <Input
                        id="deductions"
                        type="number"
                        value={formData.allowableDeductions}
                        onChange={(e) =>
                          handleChange("allowableDeductions", e.target.value)
                        }
                        placeholder="Business expenses, depreciation, etc."
                        className="text-xs h-8"
                      />
                      <FieldDescription className="text-xs">
                        Business expenses that the government allows you to
                        reduce your taxable profit (depreciation, training,
                        etc.)
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          )}

          {/* Step 3: Additional Income */}
          {currentStep === 3 && (
            <FieldGroup className="gap-3">
              <FieldSet className="gap-2">
                <FieldLegend className="text-sm">
                  Additional Income & Exemptions
                </FieldLegend>
                <FieldDescription className="text-xs">
                  Any other income sources or tax breaks
                </FieldDescription>
                <FieldGroup className="gap-2">
                  <Field>
                    <FieldLabel
                      className="text-xs"
                      htmlFor="capital-gains"
                    >
                      Capital Gains from Asset Sales (₦)
                    </FieldLabel>
                    <FieldContent className="gap-1">
                      <Input
                        id="capital-gains"
                        type="number"
                        value={formData.capitalGains}
                        onChange={(e) =>
                          handleChange("capitalGains", e.target.value)
                        }
                        placeholder="Profit from selling assets"
                        className="text-xs h-8"
                      />
                      <FieldDescription className="text-xs">
                        Profit you made from selling business assets like
                        vehicles, equipment, or property
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      className="text-xs"
                      htmlFor="crypto-gains"
                    >
                      Crypto Gains (₦)
                    </FieldLabel>
                    <FieldContent className="gap-1">
                      <Input
                        id="crypto-gains"
                        type="number"
                        value={formData.cryptoGains}
                        onChange={(e) =>
                          handleChange("cryptoGains", e.target.value)
                        }
                        placeholder="Crypto trading profits (if any)"
                        className="text-xs h-8"
                      />
                      <FieldDescription className="text-xs">
                        Profit from buying and selling cryptocurrency (Bitcoin,
                        Ethereum, etc.)
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      className="text-xs"
                      htmlFor="exemptions"
                    >
                      Tax Exemptions (₦)
                    </FieldLabel>
                    <FieldContent className="gap-1">
                      <Input
                        id="exemptions"
                        type="number"
                        value={formData.exemptions}
                        onChange={(e) =>
                          handleChange("exemptions", e.target.value)
                        }
                        placeholder="Any tax-exempt income"
                        className="text-xs h-8"
                      />
                      <FieldDescription className="text-xs">
                        Income that is exempt from tax (e.g., certain grants,
                        subsidies, or special business incentives)
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <FieldGroup className="gap-3">
              <FieldSet className="gap-2">
                <FieldLegend className="text-sm">
                  Supporting Documents
                </FieldLegend>
                <FieldDescription className="text-xs">
                  Upload files to support your tax calculation (optional but
                  recommended)
                </FieldDescription>
                <FieldGroup className="gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="business-file-input"
                    />
                    <label
                      htmlFor="business-file-input"
                      className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-foreground hover:bg-muted transition-colors"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="text-xs font-medium text-foreground">
                        Click to upload financial records
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
              </FieldSet>
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
            className="text-xs h-8"
          >
            Back
          </Button>
          {currentStep < BUSINESS_STEPS.length ? (
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
              Calculate Business Tax
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
