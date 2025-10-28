import React, { useState } from "react";
import ModalAlert from "./ModalAlert";
import "../styles/carrito.css";

const Carrito = ({ carrito, setCarrito, abierto, cerrar, usuarioActivo, abrirLogin }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCompraVisible, setModalCompraVisible] = useState(false);

  const eliminarItem = (id) => {
    const filtrado = carrito.filter((p) => p.id !== id);
    setCarrito(filtrado);
    localStorage.setItem("carrito", JSON.stringify(filtrado));
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    const actualizado = carrito.map((p) => p.id === id ? { ...p, cantidad } : p);
    setCarrito(actualizado);
    localStorage.setItem("carrito", JSON.stringify(actualizado));
  };

  const vaciarCarrito = () => {
    if (carrito.length === 0) return;
    setCarrito([]);
    localStorage.removeItem("carrito");
    setModalVisible(false);
  };

  const comprar = () => {
    if (!usuarioActivo) {
      if (typeof abrirLogin === "function") abrirLogin();
      else alert("Debes iniciar sesión para comprar.");
      return;
    }

    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    setModalCompraVisible(true);
  };

  const confirmarCompra = () => {
    const compra = {
      fecha: new Date().toISOString(),
      items: carrito,
      total: carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
      usuario: usuarioActivo,
    };

    const historial = JSON.parse(localStorage.getItem("historialCompras") || "[]");
    historial.push(compra);
    localStorage.setItem("historialCompras", JSON.stringify(historial));

    setCarrito([]);
    localStorage.removeItem("carrito");
    setModalCompraVisible(false);
    if (typeof cerrar === "function") cerrar();
  };

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0).toFixed(2);

  return (
    <div className={`sidebar-carrito ${abierto ? "abierto" : ""}`}>
      <button className="cerrar" onClick={cerrar}>X</button>
      <h4>Tu Carrito</h4>

      {/* Botón para vaciar carrito */}
      <button
        className="vaciar-carrito"
        onClick={() => setModalVisible(true)}
        disabled={carrito.length === 0}
        style={{
          background: carrito.length === 0 ? "rgba(255,255,255,0.08)" : "transparent",
          border: "1px solid rgba(157,78,221,0.25)",
          color: "var(--light)",
          padding: "0.5rem 0.75rem",
          borderRadius: 8,
          cursor: carrito.length === 0 ? "not-allowed" : "pointer",
          marginBottom: "0.75rem"
        }}
      >
        Vaciar carrito
      </button>

      {/* Modal de confirmación para vaciar carrito */}
      {modalVisible && (
        <ModalAlert
          titulo="Confirmar acción"
          mensaje="¿Estás seguro de que quieres vaciar el carrito?"
          onConfirm={vaciarCarrito}
          onCancel={() => setModalVisible(false)}
        />
      )}

      {/* Modal de confirmación para comprar */}
      {modalCompraVisible && (
        <ModalAlert
          titulo="Confirmar compra"
          mensaje={`¿Deseas confirmar tu compra por $${total}?`}
          onConfirm={confirmarCompra}
          onCancel={() => setModalCompraVisible(false)}
        />
      )}

      {carrito.length === 0 ? <p>El carrito está vacío.</p> :
        carrito.map(item => (
          <div key={item.id} className="item-carrito">
            <p>{item.nombre}</p>
            <div className="cantidad-control">
              <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
              <span>{item.cantidad}</span>
              <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
            </div>
            <p>${(item.precio * item.cantidad).toFixed(2)}</p>
            <button className="btn btn-danger btn-sm" onClick={() => eliminarItem(item.id)}>Eliminar</button>
          </div>
        ))
      }

      <h5>Total: ${total}</h5>

      {/* Botón Comprar con nuevo estilo */}
      <button
        className="comprar-btn"
        onClick={comprar}
        disabled={!usuarioActivo || carrito.length === 0}
      >
        {usuarioActivo ? "Comprar ahora" : "Iniciar sesión para comprar"}
      </button>
    </div>
  );
};

export default Carrito;