import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Catalogo from "./components/Catalogo";
import Noticias from "./components/Noticias";
import Nosotros from "./components/Nosotros";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Carrito from "./components/Carrito";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import "./styles/modal.css";

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [modalTab, setModalTab] = useState("login");
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [adminAbierto, setAdminAbierto] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (usuario) setUsuarioActivo(usuario);

    const carritoLS = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoLS);

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const adminEmail = "admin@admin.com";

    if (!usuarios.find(u => (u.email || "").toLowerCase() === adminEmail)) {
      usuarios.push({
        nombre: "Admin",
        email: adminEmail,
        password: "123456",
        rol: "admin",
      });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
  }, []);

  // 🔥 NUEVA FUNCIÓN para agregar al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(p => p.id === producto.id);
      let nuevoCarrito;

      if (productoExistente) {
        nuevoCarrito = prevCarrito.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        nuevoCarrito = [...prevCarrito, { ...producto, cantidad: 1 }];
      }

      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      return nuevoCarrito;
    });
  };

  return (
    <div className="App">
      <Navbar
        carrito={carrito}
        setUsuarioActivo={setUsuarioActivo}
        usuarioActivo={usuarioActivo}
        setMostrarLogin={setMostrarLogin}
        abrirCarrito={() => setCarritoAbierto(true)}
        setAdminAbierto={setAdminAbierto}
      />

      {usuarioActivo?.rol === "admin" && (
        <>
          <AdminPanel abierto={adminAbierto} cerrar={() => setAdminAbierto(false)} />
          <div
            className={`sidebar-overlay ${adminAbierto ? "visible" : ""}`}
            onClick={() => setAdminAbierto(false)}
          />
        </>
      )}
      <Carrito
        carrito={carrito}
        setCarrito={setCarrito}
        abierto={carritoAbierto}
        cerrar={() => setCarritoAbierto(false)}
        usuarioActivo={usuarioActivo}
        abrirLogin={() => setMostrarLogin(true)}
      />

      {mostrarLogin && !usuarioActivo && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <button className="cerrar-modal" onClick={() => setMostrarLogin(false)}>
              ×
            </button>

            <div className="modal-tabs">
              <button
                className={`tab-btn ${modalTab === "login" ? "active" : ""}`}
                onClick={() => setModalTab("login")}
              >
                Iniciar sesión
              </button>
              <button
                className={`tab-btn ${modalTab === "registro" ? "active" : ""}`}
                onClick={() => setModalTab("registro")}
              >
                Registrarse
              </button>
            </div>

            <div className="modal-content">
              {modalTab === "login" ? (
                <Login setUsuarioActivo={setUsuarioActivo} setMostrarLogin={setMostrarLogin} />
              ) : (
                <Registro />
              )}
            </div>
          </div>
        </div>
      )}

      <Catalogo agregarAlCarrito={agregarAlCarrito} />

      <Noticias />
      <Nosotros />
      <Footer />
    </div>
  );
}


export default App;
