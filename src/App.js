import { useEffect, useState } from "react";

const API_URL = "https://umb-web-taller-u0o5.onrender.com/index.php";

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar tareas al inicio
  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await fetch(API_URL);
      const data = await res.json();
      setTareas(data);
    } catch (e) {
      console.error(e);
      setError("Error al cargar tareas");
    } finally {
      setCargando(false);
    }
  };

  // CREATE
  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;

    try {
      setError(null);
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: nuevaTarea }),
      });

      setNuevaTarea("");
      await cargarTareas(); // recargar lista
    } catch (e) {
      console.error(e);
      setError("Error al crear la tarea");
    }
  };

  // UPDATE: marcar / desmarcar como completada
  const toggleCompletada = async (tarea) => {
    try {
      setError(null);

      await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tarea.id,
          titulo: tarea.titulo,
          // si estaba true pasa a false, si estaba false pasa a true
          completada: !tarea.completada,
        }),
      });

      await cargarTareas();
    } catch (e) {
      console.error(e);
      setError("Error al actualizar la tarea");
    }
  };

  // DELETE: eliminar tarea
  const eliminarTarea = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar esta tarea?"
    );
    if (!confirmar) return;

    try {
      setError(null);

      await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      await cargarTareas();
    } catch (e) {
      console.error(e);
      setError("Error al eliminar la tarea");
    }
  };

  return (
    <div
      style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Lista de tareas</h1>

      <form onSubmit={manejarSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Escribe una tarea..."
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          style={{ width: "70%", padding: "0.5rem" }}
        />
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}
        >
          Añadir
        </button>
      </form>

      {cargando && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tareas.map((t) => (
          <li
            key={t.id}
            style={{
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                flex: 1,
                textDecoration: t.completada ? "line-through" : "none",
              }}
            >
              {t.titulo}{" "}
              {t.completada ? (
                <strong>(✔ completada)</strong>
              ) : (
                <span>(pendiente)</span>
              )}
            </span>

            <button onClick={() => toggleCompletada(t)}>
              {t.completada ? "Marcar pendiente" : "Marcar completada"}
            </button>

            <button onClick={() => eliminarTarea(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
