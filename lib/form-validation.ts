/**
 * Form validation utilities for multi-step tax forms
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate PAYE form steps
 */
export const validatePayeStep = (
  step: number,
  formData: Record<string, string | number | undefined>
): ValidationResult => {
  const errors: string[] = [];

  if (step === 1) {
    // Income step validation
    if (
      !formData.monthlySalary ||
      parseFloat(String(formData.monthlySalary)) <= 0
    ) {
      errors.push("Monthly salary is required and must be greater than 0");
    }
    if (formData.allowances && parseFloat(String(formData.allowances)) < 0) {
      errors.push("Allowances cannot be negative");
    }
  }

  if (step === 2) {
    // Deductions step validation
    if (
      formData.pensionContribution &&
      parseFloat(String(formData.pensionContribution)) < 0
    ) {
      errors.push("Pension contribution cannot be negative");
    }
    if (formData.nhf && parseFloat(String(formData.nhf)) < 0) {
      errors.push("NHF cannot be negative");
    }
    if (
      formData.lifeInsurance &&
      parseFloat(String(formData.lifeInsurance)) < 0
    ) {
      errors.push("Life insurance cannot be negative");
    }
    if (
      formData.otherDeductions &&
      parseFloat(String(formData.otherDeductions)) < 0
    ) {
      errors.push("Other deductions cannot be negative");
    }
  }

  if (step === 3) {
    // Reliefs step validation
    if (formData.reliefs && parseFloat(String(formData.reliefs)) < 0) {
      errors.push("Reliefs cannot be negative");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Business Tax form steps
 */
export const validateBusinessStep = (
  step: number,
  formData: Record<string, string | number | undefined>
): ValidationResult => {
  const errors: string[] = [];

  if (step === 1) {
    // Business Info step validation
    if (!formData.businessName || String(formData.businessName).trim() === "") {
      errors.push("Business name is required");
    }
  }

  if (step === 2) {
    // Revenue & Expenses step validation
    if (!formData.revenue || parseFloat(String(formData.revenue)) <= 0) {
      errors.push("Revenue is required and must be greater than 0");
    }
    if (!formData.expenses || parseFloat(String(formData.expenses)) < 0) {
      errors.push("Expenses are required and cannot be negative");
    }
    if (formData.revenue && formData.expenses) {
      const revenue = parseFloat(String(formData.revenue));
      const expenses = parseFloat(String(formData.expenses));
      if (expenses > revenue) {
        errors.push("Expenses cannot exceed revenue");
      }
    }
  }

  if (step === 3) {
    // Additional Income step validation
    if (
      formData.salariesPaid &&
      parseFloat(String(formData.salariesPaid)) < 0
    ) {
      errors.push("Salaries paid cannot be negative");
    }
    if (
      formData.capitalGains &&
      parseFloat(String(formData.capitalGains)) < 0
    ) {
      errors.push("Capital gains cannot be negative");
    }
    if (formData.cryptoGains && parseFloat(String(formData.cryptoGains)) < 0) {
      errors.push("Crypto gains cannot be negative");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Crypto Tax form steps
 */
export const validateCryptoStep = (
  step: number,
  formData: Record<string, string | number | undefined>,
  inputMethod: string
): ValidationResult => {
  const errors: string[] = [];

  if (step === 1) {
    // Input Method step - no validation needed, just a selection
    return { isValid: true, errors: [] };
  }

  if (step === 2) {
    // Transaction Details step validation
    if (!formData.tokenName || String(formData.tokenName).trim() === "") {
      errors.push("Token name is required");
    }
    if (!formData.quantity || parseFloat(String(formData.quantity)) <= 0) {
      errors.push("Quantity is required and must be greater than 0");
    }

    if (inputMethod === "manual") {
      if (!formData.buyPrice || parseFloat(String(formData.buyPrice)) <= 0) {
        errors.push("Buy price is required and must be greater than 0");
      }
      if (!formData.sellPrice || parseFloat(String(formData.sellPrice)) <= 0) {
        errors.push("Sell price is required and must be greater than 0");
      }
      if (formData.sellPrice) {
        const sellPrice = parseFloat(String(formData.sellPrice));
        if (sellPrice <= 0) {
          errors.push("Sell price must be greater than 0");
        }
      }
    } else if (inputMethod === "hash") {
      if (
        !formData.transactionHash ||
        String(formData.transactionHash).trim() === ""
      ) {
        errors.push("Transaction hash is required");
      }
    }
  }

  if (step === 3) {
    // Dates & Fees step validation
    if (!formData.purchaseDate || String(formData.purchaseDate).trim() === "") {
      errors.push("Purchase date is required");
    }
    if (!formData.saleDate || String(formData.saleDate).trim() === "") {
      errors.push("Sale date is required");
    }
    if (formData.gasFees && parseFloat(String(formData.gasFees)) < 0) {
      errors.push("Gas fees cannot be negative");
    }
    if (formData.purchaseDate && formData.saleDate) {
      const purchase = new Date(String(formData.purchaseDate));
      const sale = new Date(String(formData.saleDate));
      if (sale <= purchase) {
        errors.push("Sale date must be after purchase date");
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
