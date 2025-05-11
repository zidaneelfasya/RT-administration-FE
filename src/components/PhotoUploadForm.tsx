"use client";

import axios from "@/lib/axios";
import { Camera, Check, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface FormState {
  foto_ktp: File | null;
  preview: string | null;
}

export default function PhotoUploadForm() {
  const [form, setForm] = useState<FormState>({
    foto_ktp: null,
    preview: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validasi tipe file (hanya gambar)
    if (!file.type.match("image.*")) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Validasi ukuran file (maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);

    setForm({
      ...form,
      foto_ktp: file,
      preview: previewUrl,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (form.preview) {
      URL.revokeObjectURL(form.preview);
    }

    setForm({
      ...form,
      foto_ktp: null,
      preview: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const id = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : null;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.foto_ktp) {
      alert("Silakan upload foto KTP terlebih dahulu");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("foto_ktp", form.foto_ktp);

      const response = await axios.post(`/api/penghuni/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      // const response = await fetch('/api/penghuni', {
      //     method: 'POST',
      //     headers: {
      //         Accept: 'application/json',
      //     },
      //     body: formData,
      //     credentials: 'include',
      // });

      if (!response) {
        throw new Error("Gagal menambahkan penghuni");
      }

      const data = response;
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 1000);

      // Reset form setelah sukses
      handleRemoveFile();
      setForm({
        foto_ktp: null,
        preview: null,
      });
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      alert(errorMessage);
    } finally {
      window.location.href = "/penghuni";
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Tambah Penghuni Baru
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Nama Lengkap */}

          {/* Foto KTP Upload */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Foto KTP*
            </label>
            <div
              className={`relative rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${form.preview ? "bg-gray-50" : "bg-white"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!form.preview ? (
                <div className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                    <Camera className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="mb-1 text-gray-700">
                      Drag & drop atau{" "}
                      <button
                        type="button"
                        className="font-medium text-blue-500 hover:text-blue-700"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        pilih file
                      </button>
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG atau PNG (Maks. 2MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative mx-auto max-h-48">
                    <img
                      src={form.preview}
                      alt="Preview KTP"
                      className="mx-auto h-auto max-h-48 rounded-lg object-contain shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="truncate font-medium">
                      {form.foto_ktp?.name}
                    </p>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
                required
              />
            </div>
          </div>

          {/* Status Penghuni */}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading || !form.foto_ktp }
              className={`flex items-center justify-center rounded-md px-4 py-2 font-medium text-white transition-colors ${
                !form.foto_ktp || isUploading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Menyimpan...</span>
                </>
              ) : uploadSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Berhasil!</span>
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
