"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Función de Don Flete - IA de predicciones
const getDonFleteInsights = (loads: any[], rutasDisponibles: number) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const month = today.getMonth();
  
  // Predicción de precios basada en día de la semana
  let precioPorTon = 1200;
  let tendencia = "estable";
  let mejorDia = "martes";
  
  if (dayOfWeek === 1 || dayOfWeek === 2) {
    precioPorTon = 1100;
    tendencia = "bajo";
    mejorDia = "hoy";
  } else if (dayOfWeek === 5 || dayOfWeek === 6) {
    precioPorTon = 1350;
    tendencia = "alto";
    mejorDia = "lunes";
  }
  
  // Temporadas de cosecha
  let temporada = "";
  if (month >= 8 && month <= 10) {
    temporada = "🌰 Temporada alta de nuez pecana. Alta demanda de transporte.";
    precioPorTon += 200;
  } else if (month >= 3 && month <= 5) {
    temporada = "🌶️ Temporada de chile. Precios de flete moderados.";
  } else if (month >= 6 && month <= 8) {
    temporada = "🍎 Temporada de manzana en Cuauhtémoc. Buena disponibilidad.";
  }
  
  return {
    precioPorTon,
    tendencia,
    mejorDia,
    temporada,
    rutasDisponibles,
    recomendacion: rutasDisponibles > 3 
      ? "Buen momento para publicar, hay varios transportistas disponibles." 
      : "Pocos transportistas disponibles. Considera programar con anticipación."
  };
};

export default function ShipperDashboard() {
  const [loads, setLoads] = useState<any[]>([]);
  const [rutasDisponibles, setRutasDisponibles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [donFleteInsights, setDonFleteInsights] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Obtener cargas del productor
    const { data: loadsData } = await supabase
      .from("loads")
      .select("*")
      .order("created_at", { ascending: false });

    // Obtener rutas disponibles de transportistas
    const { data: rutasData } = await supabase
      .from("scheduled_routes")
      .select("*")
      .eq("status", "available");

    if (loadsData) setLoads(loadsData);
    
    const numRutas = rutasData?.length || 0;
    setRutasDisponibles(numRutas);
    
    // Generar insights de Don Flete
    setDonFleteInsights(getDonFleteInsights(loadsData || [], numRutas));
    
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Pendiente</span>;
      case "matched":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Asignada</span>;
      case "in_transit":
        return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">En Tránsito</span>;
      case "delivered":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Entregada</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{status}</span>;
    }
  };

  const stats = {
    total: loads.length,
    pending: loads.filter(l => l.status === "pending").length,
    inTransit: loads.filter(l => l.status === "in_transit").length,
    delivered: loads.filter(l => l.status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🌾 Dashboard Productor</h1>
          <Link href="/" className="text-green-200 hover:text-white">
            ← Inicio
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Don Flete - Asistente IA */}
        {donFleteInsights && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🤠</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-amber-800 mb-2">Don Flete dice:</h2>
                <div className="space-y-2 text-amber-900">
                  <p>
                    💰 <strong>Precio promedio:</strong> El flete a CDMX está a <strong>${donFleteInsights.precioPorTon.toLocaleString()}/ton</strong> esta semana 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      donFleteInsights.tendencia === 'bajo' ? 'bg-green-100 text-green-800' :
                      donFleteInsights.tendencia === 'alto' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {donFleteInsights.tendencia === 'bajo' ? '↓ Precio bajo' :
                       donFleteInsights.tendencia === 'alto' ? '↑ Precio alto' : '→ Estable'}
                    </span>
                  </p>
                  <p>
                    🚛 <strong>Transportistas disponibles:</strong> {donFleteInsights.rutasDisponibles} rutas programadas en tu zona
                  </p>
                  <p>
                    📅 <strong>Mejor día para enviar:</strong> {donFleteInsights.mejorDia}
                  </p>
                  {donFleteInsights.temporada && (
                    <p>{donFleteInsights.temporada}</p>
                  )}
                  <p className="mt-3 p-3 bg-white/50 rounded-lg">
                    💡 <strong>Recomendación:</strong> {donFleteInsights.recomendacion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Total Cargas</h3>
            <p className="text-3xl font-bold text-green-700">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">En Tránsito</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Entregadas</h3>
            <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/dashboard/shipper/publicar">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 shadow">
              + Publicar Carga Inmediata
            </button>
          </Link>
          <Link href="/dashboard/shipper/programar">
            <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 shadow">
              📅 Programar Carga Futura
            </button>
          </Link>
          <Link href="/dashboard/shipper/buscar-rutas">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow">
              🚛 Ver Rutas Disponibles
            </button>
          </Link>
        </div>

        {/* Lista de cargas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-700 text-white p-4">
            <h2 className="text-xl font-bold">Mis Cargas</h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">Cargando...</p>
          ) : loads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No tienes cargas publicadas</p>
              <p className="text-sm text-gray-400">
                Publica tu primera carga para conectar con transportistas
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {loads.map((load) => (
                <div key={load.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-green-800">
                        {load.cargo_type} - {load.weight_tons} toneladas
                      </p>
                      <p className="text-gray-600">
                        📍 {load.origin} → {load.destination}
                      </p>
                      <p className="text-gray-600">
                        📅 {load.pickup_date} | 💰 ${load.offered_price?.toLocaleString()} MXN
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(load.status)}
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