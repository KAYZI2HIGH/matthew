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
import { ScrollArea } from "@/components/ui/scroll-area";

interface PayeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PAYE_STEPS = ["Income", "Deductions", "Reliefs", "Documents"];

export function PayeForm({ onSubmit, onCancel }: PayeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    monthlySalary: "",
    annualSalary: "",
    allowances: "",
    pensionContribution: "",
    nhf: "",
    lifeInsurance: "",
    otherDeductions: "",
    reliefs: "",
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
    onSubmit({
      ...formData,
      documents: uploadedFiles,
    });
  };

  const handleMonthlyChange = (value: string) => {
    handleChange("monthlySalary", value);
    handleChange("annualSalary", (parseFloat(value) * 12).toString());
  };

  const handleNext = () => {
    if (currentStep < PAYE_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercent = (currentStep / PAYE_STEPS.length) * 100;

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-sm tracking-wide">
          PAYE Tax Calculator
        </DialogTitle>
        <DialogDescription className="text-xs">
          Calculate your Pay As You Earn (PAYE) tax
        </DialogDescription>
        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden -mx-6 mt-2">
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Income */}
        <ScrollArea className="h-68 pr-2">
          {currentStep === 1 && (
            <FieldGroup className="gap-3">
              <FieldGroup className="gap-2">
                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="monthly-salary"
                  >
                    Monthly Salary (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="monthly-salary"
                      type="number"
                      value={formData.monthlySalary}
                      onChange={(e) => handleMonthlyChange(e.target.value)}
                      placeholder="e.g., 500000"
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      The amount you earn from your job each month before any
                      deductions
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="annual-salary"
                  >
                    Annual Salary (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="annual-salary"
                      type="number"
                      value={formData.annualSalary}
                      disabled
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      Your monthly salary × 12 (calculated automatically)
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="allowances"
                  >
                    Total Allowances (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="allowances"
                      type="number"
                      value={formData.allowances}
                      onChange={(e) =>
                        handleChange("allowances", e.target.value)
                      }
                      placeholder="Housing, transport, etc."
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      Extra money you receive: housing allowance, transport
                      allowance, meal allowance, etc.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldGroup>
          )}

          {/* Step 2: Deductions */}
          {currentStep === 2 && (
            <FieldGroup className="gap-3">
              <FieldGroup className="gap-2">
                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="pension"
                  >
                    Pension Contribution (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="pension"
                      type="number"
                      value={formData.pensionContribution}
                      onChange={(e) =>
                        handleChange("pensionContribution", e.target.value)
                      }
                      placeholder="8% of salary (optional)"
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      Money deducted for your retirement savings (e.g., from
                      PenCom)
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="nhf"
                  >
                    NHF Contribution (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="nhf"
                      type="number"
                      value={formData.nhf}
                      onChange={(e) => handleChange("nhf", e.target.value)}
                      placeholder="National Housing Fund"
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      National Housing Fund deduction (helps you save for
                      housing)
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="life-insurance"
                  >
                    Life Insurance (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="life-insurance"
                      type="number"
                      value={formData.lifeInsurance}
                      onChange={(e) =>
                        handleChange("lifeInsurance", e.target.value)
                      }
                      placeholder="Life insurance premiums"
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      Amount deducted for your life insurance policy premiums
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="other-deductions"
                  >
                    Other Deductions (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="other-deductions"
                      type="number"
                      value={formData.otherDeductions}
                      onChange={(e) =>
                        handleChange("otherDeductions", e.target.value)
                      }
                      placeholder="Any other deductions"
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      Any other amounts taken from your salary (union dues,
                      loans, etc.)
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldGroup>
          )}

          {/* Step 3: Reliefs */}
          {currentStep === 3 && (
            <FieldGroup className="gap-3">
              <FieldGroup className="gap-2">
                <Field>
                  <FieldLabel
                    className="text-xs"
                    htmlFor="reliefs"
                  >
                    Consolidated Relief Allowance (₦)
                  </FieldLabel>
                  <FieldContent className="gap-1">
                    <Input
                      id="reliefs"
                      type="number"
                      value={formData.reliefs}
                      onChange={(e) => handleChange("reliefs", e.target.value)}
                      placeholder="CRA - usually 1% of annual salary"
                      className="text-xs h-8"
                    />
                    <FieldDescription className="text-xs">
                      A reduction in the amount of tax you pay - typically 1% of
                      your total yearly salary (minimum ₦200,000)
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
              <div className="p-2 bg-muted rounded border">
                <p className="text-xs">
                  💡 <strong>Example:</strong> If your annual salary is
                  ₦6,000,000, your relief is usually ₦60,000 (1%) or ₦200,000,
                  whichever is higher
                </p>
              </div>
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
                    id="paye-file-input"
                  />
                  <label
                    htmlFor="paye-file-input"
                    className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-foreground hover:bg-muted transition-colors"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                    <span className="text-xs font-medium text-foreground">
                      Click to upload payroll records
                    </span>
                    <span className="text-xs text-muted-foreground">
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
        <div className="flex gap-2 pt-4 mt-4 border-t">
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
          {currentStep < PAYE_STEPS.length ? (
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
              Calculate PAYE
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
