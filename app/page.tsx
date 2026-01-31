import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const productos = [
    { nombre: "Nuez Pecana", imagen: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400", desc: "Chihuahua → CDMX" },
    { nombre: "Manzana", imagen: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", desc: "Cuauhtémoc → Guadalajara" },
    { nombre: "Chile", imagen: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400", desc: "Delicias → Monterrey" },
    { nombre: "Tomate", imagen: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", desc: "Sinaloa → CDMX" },
    { nombre: "Cebolla", imagen: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400", desc: "Delicias → Central de Abasto" },
    { nombre: "Alfalfa", imagen: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400", desc: "Chihuahua → Torreón" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-green-800 text-white py-4 px-6 flex justify-between items-center fixed w-full z-50">
        <div className="text-2xl font-bold">🚛 FleteAgro</div>
        <div className="space-x-4">
          <Link href="/auth/login" className="hover:text-orange-400">Iniciar Sesión</Link>
          <Link href="/auth/register" className="bg-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-600">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero Section con imagen de fondo */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920')",
          }}
        >
          <div className="absolute inset-0 bg-green-900/70"></div>
        </div>
        
        {/* Contenido */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Del Campo a la Ciudad,<br />
            <span className="text-orange-400">Sin Viajes Vacíos</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Conectamos productores agrícolas con transportistas confiables.<br />
            Ahorra hasta 40% en tus fletes.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=shipper" className="bg-orange-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-orange-600 transition shadow-lg">
              🌾 Soy Productor
            </Link>
            <Link href="/auth/register?role=driver" className="bg-white text-green-800 px-8 py-4 rounded-lg text-xl font-bold hover:bg-green-50 transition shadow-lg">
              🚛 Soy Transportista
            </Link>
          </div>
        </div>
      </section>

      {/* Productos que Movemos */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-4">
            Productos que Movemos
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Especialistas en transporte de productos agrícolas del norte de México
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {productos.map((producto, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="h-32 overflow-hidden">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-green-800">{producto.nombre}</h3>
                  <p className="text-sm text-gray-500">{producto.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 px-6 bg-green-800 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-5xl font-bold text-orange-400">500+</p>
            <p className="text-green-200">Transportistas</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-orange-400">1,200+</p>
            <p className="text-green-200">Cargas Movidas</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-orange-400">40%</p>
            <p className="text-green-200">Ahorro Promedio</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-orange-400">98%</p>
            <p className="text-green-200">Entregas a Tiempo</p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">
            ¿Por qué FleteAgro?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-orange-500">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Ahorra Dinero</h3>
              <p className="text-gray-600">Elimina intermediarios y reduce costos hasta 40% en tus fletes agrícolas.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-orange-500">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Transportistas Verificados</h3>
              <p className="text-gray-600">Todos nuestros transportistas pasan por un proceso de verificación.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-orange-500">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Fácil de Usar</h3>
              <p className="text-gray-600">Publica tu carga en minutos y recibe ofertas de transportistas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Desde el Corazón del Campo */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-4">
            Desde el Corazón del Campo
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Conectamos las regiones agrícolas más importantes de México
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600" 
                alt="Campos de cultivo"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Chihuahua</h3>
                <p className="text-green-200">Nuez, Manzana, Algodón</p>
              </div>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600" 
                alt="Huertos"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Sinaloa</h3>
                <p className="text-green-200">Tomate, Pepino, Berenjena</p>
              </div>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600" 
                alt="Agricultura"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Delicias</h3>
                <p className="text-green-200">Chile, Cebolla, Alfalfa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">
            ¿Cómo Funciona?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Para Productores */}
            <div className="bg-green-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                🌾 Para Productores
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</span>
                  <div>
                    <p className="font-semibold">Publica tu carga</p>
                    <p className="text-gray-600">Indica origen, destino, tipo de producto y fecha.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</span>
                  <div>
                    <p className="font-semibold">Recibe ofertas</p>
                    <p className="text-gray-600">Transportistas verificados te envían sus propuestas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</span>
                  <div>
                    <p className="font-semibold">Elige y envía</p>
                    <p className="text-gray-600">Selecciona el mejor transportista y listo.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Para Transportistas */}
            <div className="bg-orange-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-orange-600 mb-6 flex items-center gap-2">
                🚛 Para Transportistas
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="bg-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</span>
                  <div>
                    <p className="font-semibold">Regístrate gratis</p>
                    <p className="text-gray-600">Crea tu perfil y verifica tu unidad.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</span>
                  <div>
                    <p className="font-semibold">Encuentra cargas</p>
                    <p className="text-gray-600">Ve cargas disponibles en tu ruta.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</span>
                  <div>
                    <p className="font-semibold">Gana más</p>
                    <p className="text-gray-600">Elimina viajes vacíos y aumenta tus ingresos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 px-6 bg-green-800 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-green-700 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-xl">👨‍🌾</div>
                <div>
                  <p className="font-bold">Juan Pérez</p>
                  <p className="text-green-200 text-sm">Productor de Nuez, Chihuahua</p>
                </div>
              </div>
              <p className="text-green-100">"Antes batallaba mucho para encontrar transporte. Ahora en minutos tengo varias opciones y ahorro dinero."</p>
            </div>
            <div className="bg-green-700 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-xl">🚛</div>
                <div>
                  <p className="font-bold">Roberto Sánchez</p>
                  <p className="text-green-200 text-sm">Transportista, Delicias</p>
                </div>
              </div>
              <p className="text-green-100">"Ya no regreso vacío. Siempre encuentro carga de regreso y mis ingresos aumentaron 30%."</p>
            </div>
            <div className="bg-green-700 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-xl">👩‍🌾</div>
                <div>
                  <p className="font-bold">María González</p>
                  <p className="text-green-200 text-sm">Productora de Chile, Delicias</p>
                </div>
              </div>
              <p className="text-green-100">"La plataforma es muy fácil de usar. Hasta mi papá de 65 años la puede usar sin problemas."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para empezar?</h2>
          <p className="text-xl mb-8">Únete a FleteAgro hoy y transforma tu logística agrícola.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-white text-orange-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-orange-50 transition shadow-lg inline-block">
              Crear Cuenta Gratis
            </Link>
            <Link href="#" className="border-2 border-white text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-orange-600 transition inline-block">
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🚛 FleteAgro</h3>
            <p className="text-green-200">Conectando el campo mexicano con los mercados.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Productos</h3>
            <p className="text-green-200">Nuez Pecana</p>
            <p className="text-green-200">Manzana</p>
            <p className="text-green-200">Chile y Tomate</p>
            <p className="text-green-200">Alfalfa</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <p className="text-green-200">contacto@fleteagro.mx</p>
            <p className="text-green-200">+52 614 123 4567</p>
            <p className="text-green-200">Chihuahua, México</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <p className="text-green-200">Términos y Condiciones</p>
            <p className="text-green-200">Política de Privacidad</p>
            <p className="text-green-200">Aviso Legal</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-green-700 text-center text-green-300">
          <p>© 2026 FleteAgro. Todos los derechos reservados. Hecho en Chihuahua, México 🇲🇽</p>
        </div>
      </footer>
    </div>
  )
}