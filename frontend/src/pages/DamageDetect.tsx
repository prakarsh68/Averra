import { useState } from "react";

const DamageDetect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleClassify = async () => {
    if (!file) return alert("Upload an image first!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/classify-damage", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Damage Severity Classifier</h2>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button
        onClick={handleClassify}
        className="block mt-4 px-6 py-2 bg-red-600 text-white rounded"
      >
        {loading ? "Analyzing..." : "Classify Damage"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <p><strong>Damage:</strong> {result.damage_severity}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
};

export default DamageDetect;
