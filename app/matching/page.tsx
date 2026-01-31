"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Match {
  id: string;
  ruta: any;
  carga: any;
  score: number;
  razones: string[];
}

export default function MatchingPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  const [cargas, setCargas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataAndMatch();
  }, []);

  const fetchDataAndMatch = async () => {
    // Obtener rutas disponibles
    const { data: rutasData } = await supabase
      .from("scheduled_routes")
      .select("*")
      .eq("status", "available");

    // Obtener cargas buscando transporte
    const { data: cargasData } = await supabase
      .from("scheduled_loads")
      .select("*")
      .eq("status", "searching");

    // También obtener cargas pendientes de la tabla loads
    const { data: loadsPendientes } = await supabase
      .from("loads")
      .select("*")
      .eq("status", "pending");

    const todasLasCargas = [
      ...(cargasData || []).map(c => ({ ...c, tipo: "programada" })),
      ...(loadsPendientes || []).map(c => ({ ...c, tipo: "inmediata", cargo_type: c.cargo_type, weight_tons: c.weight_tons }))
    ];

    setRutas(rutasData || []);
    setCargas(todasLasCargas);

    // Ejecutar algoritmo de matching
    const matchesEncontrados = encontrarMatches(rutasData || [], todasLasCargas);
    setMatches(matchesEncontrados);

    setLoading(false);
  };

  const encontrarMatches = (rutas: any[], cargas: any[]): Match[] => {
    const matches: Match[] = [];

    rutas.forEach(ruta => {
      cargas.forEach(carga => {
        const resultado = calcularCompatibilidad(ruta, carga);
        
        if (resultado.score >= 50) {
          matches.push({
            id: `${ruta.id}-${carga.id}`,
            ruta,
            carga,
            score: resultado.score,
            razones: resultado.razones,
          });
        }
      });
    });

    // Ordenar por mejor score
    return matches.sort((a, b) => b.score - a.score);
  };

  const calcularCompatibilidad = (ruta: any, carga: any) => {
    let score = 0;
    const razones: string[] = [];

    // 1. Coincidencia de origen (40 puntos)
    if (ruta.origin === carga.origin) {
      score += 40;
      razones.push("✅ Mismo origen");
    } else if (ruta.origin.includes(carga.origin?.split(",")[0]) || carga.origin?.includes(ruta.origin.split(",")[0])) {
      score += 20;
      razones.push("🟡 Origen cercano");
    }

    // 2. Coincidencia de destino (40 puntos)
    if (ruta.destination === carga.destination) {
      score += 40;
      razones.push("✅ Mismo destino");
    } else if (ruta.destination.includes(carga.destination?.split(",")[0]) || carga.destination?.includes(ruta.destination.split(",")[0])) {
      score += 20;
      razones.push("🟡 Destino cercano");
    }

    // 3. Capacidad suficiente (10 puntos)
    const pesoRequerido = carga.weight_tons || 0;
    if (ruta.available_capacity_tons >= pesoRequerido) {
      score += 10;
      razones.push("✅ Capacidad suficiente");
    } else {
      razones.push("❌ Capacidad insuficiente");
    }

    // 4. Fechas compatibles (10 puntos)
    const fechaRuta = new Date(ruta.departure_date);
    const fechaCarga = new Date(carga.pickup_date);
    const diffDias = Math.abs((fechaRuta.getTime() - fechaCarga.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDias <= 1) {
      score += 10;
      razones.push("✅ Fechas coinciden");
    } else if (diffDias <= 3) {
      score += 5;
      razones.push("🟡 Fechas cercanas");
    }

    return { score, razones };
  };

  const confirmarMatch = async (match: Match) => {
    // Actualizar estado de la ruta
    await supabase
      .from("scheduled_routes")
      .update({ status: "partially_filled" })
      .eq("id", match.ruta.id);

    // Actualizar estado de la carga
    if (match.carga.tipo === "programada") {
      await supabase
        .from("scheduled_loads")
        .update({ status: "matched" })
        .eq("id", match.carga.id);
    } else {
      await supabase
        .from("loads")
        .update({ status: "matched" })
        .eq("id", match.carga.id);
    }

    // Crear registro de match
    await supabase.from("matches").insert({
      route_id: match.ruta.id,
      load_id: match.carga.tipo === "programada" ? null : match.carga.id,
      status: "confirmed",
      suggested_price: match.carga.offered_price || match.carga.max_budget || (match.ruta.price_per_ton * match.carga.weight_tons),
    });

    alert("🎉 ¡Match confirmado! Ambas partes serán notificadas.");
    fetchDataAndMatch();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-blue-800 text-white py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                🤖 Matching Inteligente
              </h1>
              <p className="text-purple-200 mt-1">
                Don Flete encuentra las mejores conexiones entre rutas y cargas
              </p>
            </div>
            <Link href="/dashboard/admin" className="text-purple-200 hover:text-white">
              ← Panel Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-4xl font-bold text-blue-600">{rutas.length}</p>
            <p className="text-gray-500">Rutas Disponibles</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-4xl font-bold text-green-600">{cargas.length}</p>
            <p className="text-gray-500">Cargas Buscando</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-4xl font-bold text-purple-600">{matches.length}</p>
            <p className="text-gray-500">Matches Encontrados</p>
          </div>
        </div>

        {/* Don Flete */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🤠</span>
            <div>
              <h2 className="text-xl font-bold text-amber-800">Don Flete dice:</h2>
              <p className="text-amber-900">
                {matches.length > 0
                  ? `¡Encontré ${matches.length} posibles conexiones! Los mejores matches tienen compatibilidad del ${matches[0]?.score}%.`
                  : "Aún no hay suficientes rutas y cargas para hacer matches. ¡Invita más usuarios!"}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Matches */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-purple-700 text-white p-4">
            <h2 className="text-xl font-bold">🔗 Matches Sugeridos</h2>
          </div>

          {loading ? (
            <p className="p-8 text-center text-gray-500">Analizando compatibilidades...</p>
          ) : matches.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg mb-2">No hay matches disponibles</p>
              <p className="text-gray-400">Necesitas rutas de transportistas y cargas de productores para generar matches</p>
            </div>
          ) : (
            <div className="divide-y">
              {matches.map((match) => (
                <div key={match.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Score */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`${getScoreColor(match.score)} text-white px-4 py-2 rounded-full font-bold`}>
                          {match.score}% Compatible
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {match.razones.map((razon, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {razon}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Detalles del match */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Ruta */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-600 font-semibold mb-2">🚛 RUTA DEL TRANSPORTISTA</p>
                          <p className="font-bold">{match.ruta.origin} → {match.ruta.destination}</p>
                          <p className="text-sm text-gray-600">📅 {match.ruta.departure_date}</p>
                          <p className="text-sm text-gray-600">📦 {match.ruta.available_capacity_tons} ton disponibles</p>
                          {match.ruta.price_per_ton && (
                            <p className="text-sm font-semibold text-green-600">${match.ruta.price_per_ton.toLocaleString()}/ton</p>
                          )}
                        </div>

                        {/* Carga */}
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-600 font-semibold mb-2">🌾 CARGA DEL PRODUCTOR</p>
                          <p className="font-bold">{match.carga.origin} → {match.carga.destination}</p>
                          <p className="text-sm text-gray-600">📅 {match.carga.pickup_date}</p>
                          <p className="text-sm text-gray-600">📦 {match.carga.cargo_type} - {match.carga.weight_tons} ton</p>
                          {(match.carga.offered_price || match.carga.max_budget) && (
                            <p className="text-sm font-semibold text-green-600">
                              ${(match.carga.offered_price || match.carga.max_budget)?.toLocaleString()} MXN
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botón confirmar */}
                    <div className="ml-4">
                      <button
                        onClick={() => confirmarMatch(match)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        ✓ Confirmar Match
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