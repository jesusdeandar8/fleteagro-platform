"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DriverDashboard() {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableLoads();
  }, []);

  const fetchAvailableLoads = async () => {
    const { data } = await supabase
      .from("loads")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (data) {
      setLoads(data);
    }
    setLoading(false);
  };

  const acceptLoad = async (loadId: string) => {
    const { error } = await supabase
      .from("loads")
      .update({ status: "matched" })
      .eq("id", loadId);

    if (!error) {
      alert("¡Carga aceptada! El productor será notificado.");
      fetchAvailableLoads();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Transportista</h1>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Cargas Disponibles</h3>
          <p className="text-3xl font-bold text-purple-600">{loads.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Viajes Completados</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Calificación</h3>
          <p className="text-3xl font-bold text-yellow-600">⭐ 5.0</p>
        </div>
      </div>

      {/* Lista de cargas disponibles */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold p-4 border-b">Cargas Disponibles</h2>
        
        {loading ? (
          <p className="p-4 text-center text-gray-500">Cargando...</p>
        ) : loads.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No hay cargas disponibles en este momento</p>
        ) : (
          loads.map((load) => (
            <div key={load.id} className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{load.cargo_type} - {load.weight_tons} toneladas</p>
                  <p className="text-gray-600">{load.origin} → {load.destination}</p>
                  <p className="text-sm text-gray-400">Fecha: {load.pickup_date}</p>
                  <p className="text-xl font-bold text-green-600 mt-2">${load.offered_price?.toLocaleString()} MXN</p>
                </div>
                <button
                  onClick={() => acceptLoad(load.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                  Aceptar Carga
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}