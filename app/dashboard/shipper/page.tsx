"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ShipperDashboard() {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async () => {
    const { data, error } = await supabase
      .from("loads")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setLoads(data);
    }
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Productor</h1>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Cargas</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">En Tránsito</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Entregadas</h3>
          <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
        </div>
      </div>

      {/* Botón publicar carga */}
      <div className="mb-8">
        <Link href="/dashboard/shipper/publicar">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700">
            + Publicar Nueva Carga
          </button>
        </Link>
      </div>

      {/* Lista de cargas */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold p-4 border-b">Mis Cargas</h2>
        
        {loading ? (
          <p className="p-4 text-center text-gray-500">Cargando...</p>
        ) : loads.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No tienes cargas publicadas</p>
        ) : (
          loads.map((load) => (
            <div key={load.id} className="p-4 border-b flex justify-between items-center">
              <div>
                <p className="font-semibold">{load.cargo_type} - {load.weight_tons} toneladas</p>
                <p className="text-gray-500">{load.origin} → {load.destination}</p>
                <p className="text-sm text-gray-400">Fecha: {load.pickup_date} | ${load.offered_price?.toLocaleString()} MXN</p>
              </div>
              {getStatusBadge(load.status)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}