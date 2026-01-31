"use client";
import Link from "next/link";

export default function PagoCancelado() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-800 mb-2">Pago Cancelado</h1>
        <p className="text-gray-600 mb-6">
          El pago no se completó. No se realizó ningún cargo a tu tarjeta.
        </p>
        <div className="bg-amber-50 p-4 rounded-lg mb-6">
          <p className="text-amber-800 font-semibold">🤠 Don Flete dice:</p>
          <p className="text-amber-700 text-sm">
            "No te preocupes, puedes intentar de nuevo cuando gustes."
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard/driver"
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
          >
            Volver al Dashboard
          </Link>
          <Link
            href="/"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}