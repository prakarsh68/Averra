import { useState } from "react";

const AIDetect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    if (!file) return alert("Please upload an image");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/detect", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">AI Disaster Detection</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleDetect}
        className="block mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Detecting..." : "Run AI Detection"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <p><strong>Detected:</strong> {result.detected ? "Yes" : "No"}</p>
          <p><strong>Type:</strong> {result.type}</p>
          <p><strong>Severity:</strong> {result.severity}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
};

export default AIDetect;
