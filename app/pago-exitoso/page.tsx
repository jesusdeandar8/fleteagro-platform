"use client";
import Link from "next/link";

export default function PagoExitoso() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. La comisión de FleteAgro ha sido cobrada.
        </p>
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <p className="text-green-800 font-semibold">🤠 Don Flete dice:</p>
          <p className="text-green-700 text-sm">
            "¡Gracias por usar FleteAgro! Tu viaje ha sido registrado."
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard/driver"
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
          >
            Ir al Dashboard
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