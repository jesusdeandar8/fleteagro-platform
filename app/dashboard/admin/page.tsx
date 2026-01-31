"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    drivers: 0,
    shippers: 0,
    totalLoads: 0,
    pendingLoads: 0,
    completedLoads: 0,
    totalRoutes: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loads, setLoads] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    // Obtener usuarios
    const { data: usersData } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    // Obtener cargas
    const { data: loadsData } = await supabase
      .from("loads")
      .select("*")
      .order("created_at", { ascending: false });

    // Obtener rutas
    const { data: routesData } = await supabase
      .from("scheduled_routes")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersData) setUsers(usersData);
    if (loadsData) setLoads(loadsData);
    if (routesData) setRoutes(routesData);

    // Calcular estadísticas
    const drivers = usersData?.filter(u => u.role === "driver").length || 0;
    const shippers = usersData?.filter(u => u.role === "shipper").length || 0;
    const pendingLoads = loadsData?.filter(l => l.status === "pending").length || 0;
    const completedLoads = loadsData?.filter(l => l.status === "delivered").length || 0;
    const totalRevenue = loadsData?.reduce((sum, l) => sum + (l.offered_price || 0), 0) || 0;

    setStats({
      totalUsers: usersData?.length || 0,
      drivers,
      shippers,
      totalLoads: loadsData?.length || 0,
      pendingLoads,
      completedLoads,
      totalRoutes: routesData?.length || 0,
      totalRevenue,
    });

    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      matched: "bg-blue-100 text-blue-800",
      in_transit: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      available: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "driver":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">🚛 Transportista</span>;
      case "shipper":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">🌾 Productor</span>;
      case "admin":
        return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">👑 Admin</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{role}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-500">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-purple-800 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">👑 Panel de Administrador</h1>
          <Link href="/" className="text-purple-200 hover:text-white">
            ← Inicio
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Total Usuarios</h3>
            <p className="text-3xl font-bold text-purple-700">{stats.totalUsers}</p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.drivers} transportistas · {stats.shippers} productores
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Total Cargas</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalLoads}</p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.pendingLoads} pendientes · {stats.completedLoads} completadas
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Rutas Programadas</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalRoutes}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Valor Total Movido</h3>
            <p className="text-3xl font-bold text-orange-600">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">
              Comisión potencial (5%): ${(stats.totalRevenue * 0.05).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "overview" ? "bg-purple-700 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📊 Resumen
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "users" ? "bg-purple-700 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            👥 Usuarios ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab("loads")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "loads" ? "bg-purple-700 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📦 Cargas ({stats.totalLoads})
          </button>
          <button
            onClick={() => setActiveTab("routes")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "routes" ? "bg-purple-700 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            🚛 Rutas ({stats.totalRoutes})
          </button>
        </div>

        {/* Contenido de tabs */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Actividad reciente */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-700 text-white p-4">
                <h2 className="text-lg font-bold">📈 Actividad Reciente</h2>
              </div>
              <div className="p-4 space-y-3">
                {loads.slice(0, 5).map((load, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold text-sm">{load.cargo_type} - {load.weight_tons}t</p>
                      <p className="text-xs text-gray-500">{load.origin} → {load.destination}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(load.status)}`}>
                      {load.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Métricas de Don Flete */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🤠</span>
                <h2 className="text-lg font-bold text-amber-800">Métricas de Don Flete</h2>
              </div>
              <div className="space-y-3 text-amber-900">
                <div className="flex justify-between">
                  <span>Recomendaciones dadas:</span>
                  <span className="font-bold">{stats.totalUsers * 3}</span>
                </div>
                <div className="flex justify-between">
                  <span>Matches sugeridos:</span>
                  <span className="font-bold">{Math.floor(stats.totalLoads * 0.7)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ahorro estimado para usuarios:</span>
                  <span className="font-bold text-green-700">${(stats.totalRevenue * 0.15).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-purple-700 text-white p-4">
              <h2 className="text-lg font-bold">👥 Todos los Usuarios</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Nombre</th>
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Teléfono</th>
                    <th className="text-left p-4 font-semibold">Rol</th>
                    <th className="text-left p-4 font-semibold">Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{user.full_name}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-600">{user.phone || "-"}</td>
                      <td className="p-4">{getRoleBadge(user.role)}</td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "loads" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-purple-700 text-white p-4">
              <h2 className="text-lg font-bold">📦 Todas las Cargas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Producto</th>
                    <th className="text-left p-4 font-semibold">Ruta</th>
                    <th className="text-left p-4 font-semibold">Peso</th>
                    <th className="text-left p-4 font-semibold">Precio</th>
                    <th className="text-left p-4 font-semibold">Fecha</th>
                    <th className="text-left p-4 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loads.map((load) => (
                    <tr key={load.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{load.cargo_type}</td>
                      <td className="p-4 text-gray-600 text-sm">
                        {load.origin} → {load.destination}
                      </td>
                      <td className="p-4">{load.weight_tons}t</td>
                      <td className="p-4 font-semibold text-green-700">
                        ${load.offered_price?.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{load.pickup_date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(load.status)}`}>
                          {load.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "routes" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-purple-700 text-white p-4">
              <h2 className="text-lg font-bold">🚛 Todas las Rutas Programadas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Ruta</th>
                    <th className="text-left p-4 font-semibold">Salida</th>
                    <th className="text-left p-4 font-semibold">Regreso</th>
                    <th className="text-left p-4 font-semibold">Capacidad</th>
                    <th className="text-left p-4 font-semibold">Precio/Ton</th>
                    <th className="text-left p-4 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {routes.map((route) => (
                    <tr key={route.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-sm">
                        {route.origin} → {route.destination}
                      </td>
                      <td className="p-4 text-gray-600">{route.departure_date}</td>
                      <td className="p-4 text-gray-600">{route.return_date || "-"}</td>
                      <td className="p-4">{route.available_capacity_tons}t</td>
                      <td className="p-4 font-semibold text-green-700">
                        ${route.price_per_ton?.toLocaleString() || "-"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(route.status)}`}>
                          {route.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}