"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PublicarCarga() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    cargo_type: "",
    weight_tons: "",
    pickup_date: "",
    offered_price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("loads").insert({
      origin: form.origin,
      destination: form.destination,
      cargo_type: form.cargo_type,
      weight_tons: parseFloat(form.weight_tons),
      pickup_date: form.pickup_date,
      offered_price: parseFloat(form.offered_price),
      status: "pending",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard/shipper");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Publicar Nueva Carga</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Origen</label>
            <select
              name="origin"
              value={form.origin}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Selecciona origen</option>
              <option value="Delicias, Chihuahua">Delicias, Chihuahua</option>
              <option value="Chihuahua, Chihuahua">Chihuahua, Chihuahua</option>
              <option value="Cuauhtémoc, Chihuahua">Cuauhtémoc, Chihuahua</option>
              <option value="Culiacán, Sinaloa">Culiacán, Sinaloa</option>
              <option value="Guanajuato, Guanajuato">Guanajuato, Guanajuato</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Destino</label>
            <select
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Selecciona destino</option>
              <option value="CDMX - Central de Abasto">CDMX - Central de Abasto</option>
              <option value="Guadalajara, Jalisco">Guadalajara, Jalisco</option>
              <option value="Monterrey, Nuevo León">Monterrey, Nuevo León</option>
              <option value="Querétaro, Querétaro">Querétaro, Querétaro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Carga</label>
            <select
              name="cargo_type"
              value={form.cargo_type}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Selecciona tipo</option>
              <option value="Tomates">Tomates</option>
              <option value="Manzanas">Manzanas</option>
              <option value="Chiles">Chiles</option>
              <option value="Cebollas">Cebollas</option>
              <option value="Papas">Papas</option>
              <option value="Aguacates">Aguacates</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Peso (toneladas)</label>
            <input
              type="number"
              name="weight_tons"
              value={form.weight_tons}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Ej: 5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Recolección</label>
            <input
              type="date"
              name="pickup_date"
              value={form.pickup_date}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Precio Ofrecido (MXN)</label>
            <input
              type="number"
              name="offered_price"
              value={form.offered_price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Ej: 15000"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar Carga"}
          </button>
        </form>
      </div>
    </div>
  );
}