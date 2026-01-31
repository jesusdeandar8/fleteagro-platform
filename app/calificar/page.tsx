"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams, useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CalificarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tripId = searchParams.get("trip");
  const userName = searchParams.get("nombre") || "Usuario";
  const userType = searchParams.get("tipo") || "transportista";
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }
    
    setSaving(true);

    const { error } = await supabase.from("ratings").insert({
      trip_id: tripId || null,
      rating: rating,
      comment: comment,
      review_type: userType === "transportista" ? "shipper_to_driver" : "driver_to_shipper",
    });

    if (!error) {
      setSaved(true);
    } else {
      alert("Error al guardar: " + error.message);
    }
    setSaving(false);
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">¡Gracias por tu calificación!</h1>
          <p className="text-gray-600 mb-6">Tu opinión nos ayuda a mejorar FleteAgro</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard/shipper")}
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">
            {userType === "transportista" ? "🚛" : "🌾"}
          </div>
          <h1 className="text-2xl font-bold text-green-800">
            Califica a {userName}
          </h1>
          <p className="text-gray-500">
            {userType === "transportista" ? "¿Cómo fue tu experiencia con este transportista?" : "¿Cómo fue tu experiencia con este productor?"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Estrellas */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-5xl transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? "⭐" : "☆"}
              </button>
            ))}
          </div>

          {/* Mensaje según calificación */}
          <div className="text-center mb-6">
            {rating === 0 && <p className="text-gray-400">Selecciona una calificación</p>}
            {rating === 1 && <p className="text-red-500 font-semibold">Muy malo 😞</p>}
            {rating === 2 && <p className="text-orange-500 font-semibold">Malo 😕</p>}
            {rating === 3 && <p className="text-yellow-500 font-semibold">Regular 😐</p>}
            {rating === 4 && <p className="text-green-500 font-semibold">Bueno 🙂</p>}
            {rating === 5 && <p className="text-green-600 font-semibold">¡Excelente! 🤩</p>}
          </div>

          {/* Comentario */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Cuéntanos más sobre tu experiencia..."
            />
          </div>

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={saving || rating === 0}
            className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? "Enviando..." : "Enviar Calificación"}
          </button>
        </form>

        {/* Categorías rápidas */}
        {rating > 0 && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 mb-3">¿Qué destacas de {userName}?</p>
            <div className="flex flex-wrap gap-2">
              {userType === "transportista" ? (
                <>
                  <QuickTag label="Puntual" onClick={(tag) => setComment(comment + " " + tag)} />
                  <QuickTag label="Cuidadoso con la carga" onClick={(tag) => setComment(comment + " " + tag)} />
                  <QuickTag label="Buena comunicación" onClick={(tag) => setComment(comment + " " + tag)} />
                  <QuickTag label="Camión en buen estado" onClick={(tag) => setComment(comment + " " + tag)} />
                  <QuickTag label="Amable" onClick={(tag) => setComment(comment + " " + tag)} />
                </>
              ) : (
                <>
                  <QuickTag label="Carga lista a tiempo" onClick={(tag) => setComment(comment + " " + tag)} />
                  <QuickTag label="Buena comunicación" onClick={(tag) => setComment(comment + " " + tag)} />
                  <QuickTag label="Pago puntual" onClick={(tag) => setComment(comment + " " + tag)} />
                  <QuickTag label="Amable" onClick={(tag) => setComment(comment + " " + tag)} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickTag({ label, onClick }: { label: string; onClick: (tag: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
    >
      {label}
    </button>
  );
}