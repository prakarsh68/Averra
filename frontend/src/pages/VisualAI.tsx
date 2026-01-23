import { useState } from "react";

const VisualAI = () => {
  const [file, setFile] = useState<File | null>(null);
  const [maskUrl, setMaskUrl] = useState<string | null>(null);

  const handleSegment = async () => {
    if (!file) return alert("Upload an image first");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/segment", {
      method: "POST",
      body: formData
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setMaskUrl(url);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Visual AI – Disaster Segmentation</h2>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button
        onClick={handleSegment}
        className="block mt-4 px-6 py-2 bg-purple-600 text-white rounded"
      >
        Generate Disaster Mask
      </button>

      {maskUrl && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">AI Generated Mask</h3>
          <img src={maskUrl} alt="Segmentation Mask" className="border" />
        </div>
      )}
    </div>
  );
};

export default VisualAI;
