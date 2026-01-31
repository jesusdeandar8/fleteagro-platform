"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Función de Don Flete - IA para transportistas
const getDonFleteInsights = (loads: any[], rutas: any[]) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const month = today.getMonth();
  
  // Análisis de demanda
  let demanda = "normal";
  let demandaColor = "gray";
  
  if (loads.length > 5) {
    demanda = "alta";
    demandaColor = "green";
  } else if (loads.length < 2) {
    demanda = "baja";
    demandaColor = "red";
  }
  
  // Mejor ruta basada en cargas disponibles
  const destinos: { [key: string]: number } = {};
  loads.forEach(load => {
    destinos[load.destination] = (destinos[load.destination] || 0) + 1;
  });
  
  let mejorDestino = "CDMX - Central de Abasto";
  let maxCargas = 0;
  Object.entries(destinos).forEach(([destino, count]) => {
    if (count > maxCargas) {
      maxCargas = count;
      mejorDestino = destino;
    }
  });
  
  // Precio promedio
  const preciosValidos = loads.filter(l => l.offered_price).map(l => l.offered_price);
  const precioPromedio = preciosValidos.length > 0 
    ? preciosValidos.reduce((a, b) => a + b, 0) / preciosValidos.length 
    : 15000;
  
  // Temporadas
  let temporada = "";
  if (month >= 8 && month <= 10) {
    temporada = "🌰 Temporada de nuez pecana. Muchas cargas de Chihuahua a CDMX.";
  } else if (month >= 3 && month <= 5) {
    temporada = "🌶️ Temporada de chile. Alta demanda en ruta Delicias-CDMX.";
  } else if (month >= 6 && month <= 8) {
    temporada = "🍎 Temporada de manzana. Cargas desde Cuauhtémoc.";
  }
  
  // Recomendación de regreso
  const recomendacionRegreso = rutas.length === 0 
    ? "Publica tu ruta de regreso para no volver vacío."
    : `Tienes ${rutas.length} ruta(s) programada(s). ¡Bien planificado!`;
  
  return {
    cargasDisponibles: loads.length,
    demanda,
    demandaColor,
    mejorDestino,
    maxCargas,
    precioPromedio,
    temporada,
    recomendacionRegreso,
  };
};

export default function DriverDashboard() {
  const [loads, setLoads] = useState<any[]>([]);
  const [misRutas, setMisRutas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [donFleteInsights, setDonFleteInsights] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Cargas disponibles (pendientes)
    const { data: loadsData } = await supabase
      .from("loads")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    // Mis rutas programadas
    const { data: rutasData } = await supabase
      .from("scheduled_routes")
      .select("*")
      .order("departure_date", { ascending: true });

    if (loadsData) setLoads(loadsData);
    if (rutasData) setMisRutas(rutasData);
    
    // Generar insights de Don Flete
    setDonFleteInsights(getDonFleteInsights(loadsData || [], rutasData || []));
    
    setLoading(false);
  };

  const acceptLoad = async (loadId: string, price: number) => {
    setProcessingPayment(loadId);
    
    const { error } = await supabase
      .from("loads")
      .update({ status: "matched" })
      .eq("id", loadId);

    if (!error) {
      // Calcular comisión del 5%
      const comision = Math.round(price * 0.05 * 100); // En centavos para Stripe
      
      // Crear sesión de pago
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: comision,
          tripId: loadId,
          description: `Comisión 5% por carga - $${price.toLocaleString()} MXN`,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirigir a Stripe
      } else {
        alert("¡Carga aceptada! El productor será notificado.");
        fetchData();
      }
    }
    setProcessingPayment(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🚛 Dashboard Transportista</h1>
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
                    📦 <strong>Cargas disponibles:</strong> {donFleteInsights.cargasDisponibles} cargas esperando transporte
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      donFleteInsights.demandaColor === 'green' ? 'bg-green-100 text-green-800' :
                      donFleteInsights.demandaColor === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Demanda {donFleteInsights.demanda}
                    </span>
                  </p>
                  <p>
                    🎯 <strong>Ruta más solicitada:</strong> Hacia {donFleteInsights.mejorDestino} ({donFleteInsights.maxCargas} cargas)
                  </p>
                  <p>
                    💰 <strong>Precio promedio:</strong> ${donFleteInsights.precioPromedio.toLocaleString()} MXN por viaje
                  </p>
                  {donFleteInsights.temporada && (
                    <p>{donFleteInsights.temporada}</p>
                  )}
                  <p className="mt-3 p-3 bg-white/50 rounded-lg">
                    💡 <strong>Tip:</strong> {donFleteInsights.recomendacionRegreso}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Cargas Disponibles</h3>
            <p className="text-3xl font-bold text-green-700">{loads.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Mis Rutas Activas</h3>
            <p className="text-3xl font-bold text-blue-600">{misRutas.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Viajes Completados</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Calificación</h3>
            <p className="text-3xl font-bold text-yellow-600">⭐ 5.0</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/dashboard/driver/rutas">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 shadow">
              + Publicar Mi Ruta
            </button>
          </Link>
          <Link href="/dashboard/driver/buscar-cargas">
            <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 shadow">
              🔍 Buscar Cargas Programadas
            </button>
          </Link>
        </div>

        {/* Lista de cargas disponibles */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-700 text-white p-4">
            <h2 className="text-xl font-bold">Cargas Disponibles Ahora</h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">Cargando...</p>
          ) : loads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No hay cargas disponibles en este momento</p>
              <p className="text-sm text-gray-400">
                Publica tu ruta para que los productores te encuentren
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
                        📅 {load.pickup_date}
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        💰 ${load.offered_price?.toLocaleString()} MXN
                      </p>
                      <p className="text-sm text-orange-600">
                        Comisión FleteAgro (5%): ${((load.offered_price || 0) * 0.05).toLocaleString()} MXN
                      </p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => acceptLoad(load.id, load.offered_price || 0)}
                        disabled={processingPayment === load.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                      >
                        {processingPayment === load.id ? "Procesando..." : "Aceptar Carga"}
                      </button>
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