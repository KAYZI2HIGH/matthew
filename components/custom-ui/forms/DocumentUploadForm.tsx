"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface DocumentUploadFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function DocumentUploadForm({
  onSubmit,
  onCancel,
}: DocumentUploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one file");
      return;
    }
    onSubmit({
      files,
      documentType,
    });
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-white">Upload Documents</DialogTitle>
        <DialogDescription className="text-neutral-400">
          Upload receipts, bank statements, invoices, or payroll records.
          Matthew will extract financial data automatically.
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Document Type */}
        <div className="space-y-2">
          <Label className="text-neutral-300">Document Type</Label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neutral-600 transition-colors"
          >
            <option value="">Select document type...</option>
            <option value="bank-statement">Bank Statement</option>
            <option value="receipt">Receipt</option>
            <option value="invoice">Invoice</option>
            <option value="payroll">Payroll Record</option>
            <option value="expense-sheet">Expense Sheet</option>
            <option value="crypto-receipt">Crypto Receipt</option>
            <option value="tax-receipt">Tax Payment Receipt</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="text-neutral-300">Select Files</Label>
          <div className="relative">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-neutral-600 hover:bg-neutral-800 transition-colors"
            >
              <Upload className="w-8 h-8 text-neutral-400 mb-2" />
              <span className="text-sm text-neutral-400">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-neutral-500 mt-1">
                PDF, JPG, PNG, XLSX, CSV
              </span>
            </label>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label className="text-neutral-300">Selected Files</Label>
            <div className="bg-neutral-800 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-neutral-900 rounded text-sm"
                >
                  <span className="text-neutral-300 truncate">{file.name}</span>
                  <span className="text-neutral-500 text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-neutral-800 rounded-lg p-3 text-xs text-neutral-400">
          <p>📄 Matthew will analyze these documents and extract:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Income and revenue amounts</li>
            <li>Expenses and deductions</li>
            <li>Capital gains transactions</li>
            <li>Crypto activity (if applicable)</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={files.length === 0}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload & Analyze
          </Button>
        </div>
      </form>
    </div>
  );
}
