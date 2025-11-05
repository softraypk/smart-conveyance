"use client";

import {useState} from "react";
import {api} from "@/lib/api"; // assuming your project uses api helper
import toast from "react-hot-toast";

interface DocumentFormProps {
    id: string;
    onUploadSuccess?: () => void;
}

export default function DocumentForm({id, onUploadSuccess}: DocumentFormProps) {
    const [fileType, setFileType] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!fileType) {
            toast.error("Please select a file type.");
            return;
        }
        if (!file) {
            toast.error("Please choose a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("document", file);
        setUploading(true);

        try {
            const response = await api(`/cases/${id}/documents/${fileType}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                toast.success("File uploaded successfully!");
                setFile(null);
                setFileType("");
                setUploading(false);
                onUploadSuccess?.();
            } else {
                toast.error("Error: " + response.results.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload file.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm border border-border-light dark:border-border-dark mb-8">
            <h3 className="text-lg font-semibold mb-6">Upload Documents</h3>

            <div className="flex flex-col gap-6">
                {/* File Type Dropdown */}
                <div className="flex flex-col">
                    <label className="font-semibold mb-2 dark:text-gray-300">File Type*</label>
                    <select
                        className="form-input w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-background-dark dark:border-gray-600 dark:text-white"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        required
                    >
                        <option value="">Select File Type</option>
                        <option value="FORM_F">Form F</option>
                        <option value="NOC">NOC</option>
                        <option value="BANK_CLEARENCE_LETTER">Bank Clearance Letter</option>
                        <option value="VALUATION">Valuation</option>
                        <option value="FOL">Fol</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                {/* File Upload */}
                <div
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center border-border-light dark:border-border-dark">
          <span className="material-symbols-outlined text-5xl text-primary/50 mb-2">
            upload_file
          </span>
                    <h4 className="font-semibold">Upload Document</h4>
                    <p className="text-xs text-foreground-light/70 dark:text-foreground-dark/70 mt-1">
                        PDF, JPG, PNG up to 5MB
                    </p>

                    <button
                        type="button"
                        onClick={() => document.getElementById("fileInput")?.click()}
                        disabled={uploading}
                        className="mt-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary font-semibold text-sm py-2 px-4 rounded-full transition-colors disabled:opacity-60"
                    >
                        {uploading ? "Uploading..." : "Choose File"}
                    </button>

                    <input
                        id="fileInput"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        type="file"
                        name="document"
                        onChange={handleFileChange}
                    />

                    {file && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                            Selected: <strong>{file.name}</strong>
                        </p>
                    )}
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="self-end bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-60"
                >
                    {uploading ? "Uploading..." : "Upload File"}
                </button>
            </div>
        </div>
    );
}