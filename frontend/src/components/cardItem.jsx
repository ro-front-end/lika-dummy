import { useState, useRef, useEffect } from "react";

export default function CardItem({ card, onSwipe, lastResult }) {
  const elRef = useRef(null);
  const startX = useRef(0);
  const [posX, setPosX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [transition, setTransition] = useState("transform 0.25s ease");
  const hasSwiped = useRef(false);

  // umbral en px
  const THRESHOLD = 120;

  // Bloquea todo si estamos mostrando el resultado
  useEffect(() => {
    if (lastResult) {
      // reset safe
      setPosX(0);
      setDragging(false);
      hasSwiped.current = true; // evita swipes accidentales
    } else {
      hasSwiped.current = false;
    }
  }, [lastResult]);

  // Pointer handlers
  const onPointerDown = (e) => {
    if (lastResult) return;
    const clientX = e.clientX;
    startX.current = clientX;
    setDragging(true);
    setTransition("none");
    // capture pointer so we keep receiving events
    try {
      e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const onPointerMove = (e) => {
    if (!dragging || lastResult) return;
    const dx = e.clientX - startX.current;
    setPosX(dx);
    // evita scroll/pinch en mobile si es posible
    if (e.cancelable) e.preventDefault();
  };

  const finishSwipe = (direction) => {
    if (hasSwiped.current) return;
    hasSwiped.current = true;

    // animar fuera de pantalla y llamar onSwipe después
    const off =
      direction === "right"
        ? window.innerWidth * 1.1
        : -window.innerWidth * 1.1;

    setTransition("transform 0.35s ease");
    setPosX(off);

    // esperar a que termine la animación antes de llamar (350ms)
    setTimeout(() => {
      onSwipe(direction, card);
      // dejar pos a 0 porque CardList avanzará la tarjeta o mostrará resultado
      setPosX(0);
      setTransition("transform 0.25s ease");
      setDragging(false);
    }, 360);
  };

  const onPointerUp = () => {
    if (!dragging || lastResult) return;
    setDragging(false);
    setTransition("transform 0.25s ease");

    if (posX > THRESHOLD) finishSwipe("right");
    else if (posX < -THRESHOLD) finishSwipe("left");
    else {
      // reset
      setPosX(0);
      hasSwiped.current = false;
    }
  };

  // Attach passive-safe listeners to the element
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const handlePointerDown = (e) => onPointerDown(e);
    const handlePointerMove = (e) => onPointerMove(e);
    const handlePointerUp = () => onPointerUp();

    el.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, posX, lastResult]);

  // ----------------------------
  // MODO RESULTADO (misma tarjeta)
  // ----------------------------
  if (lastResult) {
    return (
      <div
        className={`w-80 p-6 rounded-3xl shadow-xl text-center text-white flex flex-col gap-4 ${
          lastResult.correct ? "bg-green-600" : "bg-red-600"
        }`}
        style={{ transition: "all 0.25s ease" }}
      >
        <div className="text-6xl">{lastResult.correct ? "✔" : "✘"}</div>

        <h3 className="font-bold text-xl">
          {lastResult.correct ? "Correct!" : "Incorrect"}
        </h3>

        <p className="text-white/90 text-sm">{lastResult.explanation}</p>

        <p className="text-xs opacity-80">Next question loading…</p>
      </div>
    );
  }

  // ----------------------------
  // TARJETA NORMAL (swipe)
  // ----------------------------
  const rotate = Math.max(-12, Math.min(12, (posX / window.innerWidth) * 40));

  return (
    <div
      ref={elRef}
      className="bg-white rounded-3xl shadow-2xl shadow-neutral-700 w-76 select-none cursor-grab active:cursor-grabbing flex flex-col gap-4"
      style={{
        transform: `translateX(${posX}px) rotate(${rotate}deg)`,
        transition,
        touchAction: "none", // importante para prevenir scroll en mobile durante drag
      }}
      // Para compatibilidad con React synthetic events (opcional)
      onPointerDown={(e) => onPointerDown(e)}
    >
      <p className="m-4 absolute py-1 px-4 text-xs uppercase font-semibold bg-white rounded-full text-black">
        Ethic Questions
      </p>
      <img
        src={card.image}
        alt=""
        className="w-full h-40 object-cover rounded-t-3xl"
      />
      <div className="p-4 flex flex-col gap-4">
        <h3 className="font-bold text-center text-lg">{card.question}</h3>
        <p className="text-gray-600 text-sm">{card.description}</p>
        <p className="text-sm font-semibold text-center">Swipe your answer!</p>

        <div className="flex justify-around px-6 mt-2">
          {/* Left / False */}
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center w-12 h-12 bg-orange-600 rounded-full text-white text-lg">
              &larr;
            </div>
            <span className="mt-2 text-xs italic text-gray-700">False</span>
          </div>

          {/* Right / True */}
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center w-12 h-12 bg-green-600 rounded-full text-white text-lg">
              &rarr;
            </div>
            <span className="mt-2 text-xs italic text-gray-700">True</span>
          </div>
        </div>
      </div>
    </div>
  );
}
