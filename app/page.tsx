import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-4xl">
        <h1 className="text-6xl font-bold mb-4">🚛 FleteAgro</h1>
        <p className="text-2xl mb-8">Plataforma de Logística Agrícola para México</p>
        <p className="text-lg mb-12 text-purple-100">
          Conectamos transportistas con productores para eliminar viajes vacíos y reducir costos
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href="/auth/register?role=driver" 
            className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            Soy Transportista
          </Link>
          <Link 
            href="/auth/register?role=shipper" 
            className="px-8 py-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition border-2 border-white"
          >
            Soy Productor
          </Link>
        </div>
      </div>
    </div>
  )
}
