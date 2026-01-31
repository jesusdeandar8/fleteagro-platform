"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RutasProgramadas() {
  const [rutas, setRutas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departure_date: "",
    return_date: "",
    available_capacity_tons: "",
    price_per_ton: "",
    notes: "",
  });

  useEffect(() => {
    fetchRutas();
  }, []);

  const fetchRutas = async () => {
    const { data } = await supabase
      .from("scheduled_routes")
      .select("*")
      .order("departure_date", { ascending: true });

    if (data) setRutas(data);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("scheduled_routes").insert({
      origin: form.origin,
      destination: form.destination,
      departure_date: form.departure_date,
      return_date: form.return_date || null,
      available_capacity_tons: parseFloat(form.available_capacity_tons),
      price_per_ton: form.price_per_ton ? parseFloat(form.price_per_ton) : null,
      notes: form.notes || null,
      status: "available",
    });

    if (!error) {
      setShowForm(false);
      setForm({
        origin: "",
        destination: "",
        departure_date: "",
        return_date: "",
        available_capacity_tons: "",
        price_per_ton: "",
        notes: "",
      });
      fetchRutas();
    }
    setSaving(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Disponible</span>;
      case "partially_filled":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Parcialmente Lleno</span>;
      case "full":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Lleno</span>;
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
          <h1 className="text-2xl font-bold">🚛 Mis Rutas Programadas</h1>
          <Link href="/dashboard/driver" className="text-green-200 hover:text-white">
            ← Volver al Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Botón Nueva Ruta */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            {showForm ? "✕ Cancelar" : "+ Publicar Nueva Ruta"}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">Nueva Ruta Programada</h2>
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
                  <option value="CDMX - Central de Abasto">CDMX - Central de Abasto</option>
                  <option value="Guadalajara, Jalisco">Guadalajara, Jalisco</option>
                  <option value="Monterrey, Nuevo León">Monterrey, Nuevo León</option>
                  <option value="Culiacán, Sinaloa">Culiacán, Sinaloa</option>
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
                  <option value="Chihuahua, Chihuahua">Chihuahua, Chihuahua</option>
                  <option value="Delicias, Chihuahua">Delicias, Chihuahua</option>
                  <option value="Torreón, Coahuila">Torreón, Coahuila</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Salida *</label>
                <input
                  type="date"
                  name="departure_date"
                  value={form.departure_date}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Regreso (opcional)</label>
                <input
                  type="date"
                  name="return_date"
                  value={form.return_date}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Capacidad Disponible (toneladas) *</label>
                <input
                  type="number"
                  name="available_capacity_tons"
                  value={form.available_capacity_tons}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ej: 20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Precio por Tonelada (MXN)</label>
                <input
                  type="number"
                  name="price_per_ton"
                  value={form.price_per_ton}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ej: 1500"
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
                  placeholder="Ej: Camión refrigerado, disponible para múltiples paradas..."
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Publicar Ruta"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Rutas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-700 text-white p-4">
            <h2 className="text-xl font-bold">Mis Rutas Programadas</h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">Cargando...</p>
          ) : rutas.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No tienes rutas programadas</p>
              <p className="text-sm text-gray-400">
                Publica tu primera ruta para que los productores puedan encontrarte
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {rutas.map((ruta) => (
                <div key={ruta.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-green-800">
                        {ruta.origin} → {ruta.destination}
                      </p>
                      <p className="text-gray-600">
                        📅 Salida: {ruta.departure_date}
                        {ruta.return_date && ` | Regreso: ${ruta.return_date}`}
                      </p>
                      <p className="text-gray-600">
                        📦 Capacidad: {ruta.available_capacity_tons} toneladas
                        {ruta.price_per_ton && ` | $${ruta.price_per_ton.toLocaleString()}/ton`}
                      </p>
                      {ruta.notes && <p className="text-sm text-gray-500 mt-1">📝 {ruta.notes}</p>}
                    </div>
                    <div className="text-right">
                      {getStatusBadge(ruta.status)}
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