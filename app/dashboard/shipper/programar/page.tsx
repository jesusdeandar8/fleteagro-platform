"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CargasProgramadas() {
  const [cargas, setCargas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    pickup_date: "",
    cargo_type: "",
    weight_tons: "",
    max_budget: "",
    notes: "",
  });

  useEffect(() => {
    fetchCargas();
  }, []);

  const fetchCargas = async () => {
    const { data } = await supabase
      .from("scheduled_loads")
      .select("*")
      .order("pickup_date", { ascending: true });

    if (data) setCargas(data);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("scheduled_loads").insert({
      origin: form.origin,
      destination: form.destination,
      pickup_date: form.pickup_date,
      cargo_type: form.cargo_type,
      weight_tons: parseFloat(form.weight_tons),
      max_budget: form.max_budget ? parseFloat(form.max_budget) : null,
      notes: form.notes || null,
      status: "searching",
    });

    if (!error) {
      setShowForm(false);
      setForm({
        origin: "",
        destination: "",
        pickup_date: "",
        cargo_type: "",
        weight_tons: "",
        max_budget: "",
        notes: "",
      });
      fetchCargas();
    }
    setSaving(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "searching":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Buscando Transporte</span>;
      case "matched":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Match Encontrado</span>;
      case "confirmed":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Confirmado</span>;
      case "completed":
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Completado</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🌾 Mis Cargas Programadas</h1>
          <Link href="/dashboard/shipper" className="text-green-200 hover:text-white">
            ← Volver al Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Botón Nueva Carga */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            {showForm ? "✕ Cancelar" : "+ Programar Nueva Carga"}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">Programar Carga Futura</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Origen *</label>
                <select
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Selecciona origen</option>
                  <option value="Chihuahua, Chihuahua">Chihuahua, Chihuahua</option>
                  <option value="Delicias, Chihuahua">Delicias, Chihuahua</option>
                  <option value="Cuauhtémoc, Chihuahua">Cuauhtémoc, Chihuahua</option>
                  <option value="Jiménez, Chihuahua">Jiménez, Chihuahua</option>
                  <option value="Camargo, Chihuahua">Camargo, Chihuahua</option>
                  <option value="Culiacán, Sinaloa">Culiacán, Sinaloa</option>
                  <option value="Guanajuato, Guanajuato">Guanajuato, Guanajuato</option>
                  <option value="Torreón, Coahuila">Torreón, Coahuila</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Destino *</label>
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
                  <option value="Puebla, Puebla">Puebla, Puebla</option>
                  <option value="León, Guanajuato">León, Guanajuato</option>
                  <option value="Torreón, Coahuila">Torreón, Coahuila</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Recolección *</label>
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
                <label className="block text-sm font-medium mb-1">Tipo de Producto *</label>
                <select
                  name="cargo_type"
                  value={form.cargo_type}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Selecciona producto</option>
                  <option value="Nuez Pecana">Nuez Pecana</option>
                  <option value="Manzana">Manzana</option>
                  <option value="Chile">Chile</option>
                  <option value="Tomate">Tomate</option>
                  <option value="Cebolla">Cebolla</option>
                  <option value="Alfalfa">Alfalfa</option>
                  <option value="Algodón">Algodón</option>
                  <option value="Maíz">Maíz</option>
                  <option value="Frijol">Frijol</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Peso (toneladas) *</label>
                <input
                  type="number"
                  name="weight_tons"
                  value={form.weight_tons}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ej: 10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Presupuesto Máximo (MXN)</label>
                <input
                  type="number"
                  name="max_budget"
                  value={form.max_budget}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ej: 25000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notas adicionales</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  placeholder="Ej: Necesita refrigeración, producto frágil, horario flexible..."
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Programar Carga"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Cargas Programadas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-700 text-white p-4">
            <h2 className="text-xl font-bold">Mis Cargas Programadas</h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">Cargando...</p>
          ) : cargas.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No tienes cargas programadas</p>
              <p className="text-sm text-gray-400">
                Programa tu carga con anticipación para encontrar mejores precios
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {cargas.map((carga) => (
                <div key={carga.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-green-800">
                        {carga.cargo_type} - {carga.weight_tons} toneladas
                      </p>
                      <p className="text-gray-600">
                        📍 {carga.origin} → {carga.destination}
                      </p>
                      <p className="text-gray-600">
                        📅 Recolección: {carga.pickup_date}
                        {carga.max_budget && ` | 💰 Presupuesto: $${carga.max_budget.toLocaleString()}`}
                      </p>
                      {carga.notes && <p className="text-sm text-gray-500 mt-1">📝 {carga.notes}</p>}
                    </div>
                    <div className="text-right">
                      {getStatusBadge(carga.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}