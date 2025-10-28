import React, { useState, useEffect } from "react";
import "../styles/admin.css";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    genero: "",
    descripcion: "",
    imagen: "",
  });

  // Cargar productos desde localStorage
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(guardados);
  }, []);

  // Guardar productos en localStorage
  const guardarProductos = (nuevos) => {
    setProductos(nuevos);
    localStorage.setItem("productos", JSON.stringify(nuevos));
  };

  // CRUD
  const agregarProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;
    const nuevo = { ...nuevoProducto, id: Date.now() };
    const nuevosProductos = [...productos, nuevo];
    guardarProductos(nuevosProductos);
    setNuevoProducto({ nombre: "", precio: "", genero: "", descripcion: "", imagen: "" });
  };

  const eliminarProducto = (id) => {
    const filtrados = productos.filter((p) => p.id !== id);
    guardarProductos(filtrados);
  };

  const editarProducto = (id, campo, valor) => {
    const editados = productos.map((p) =>
      p.id === id ? { ...p, [campo]: valor } : p
    );
    guardarProductos(editados);
  };

  return (
    <div className="admin-container">
      <h2>Panel de Administración - Productos</h2>

      <div className="nuevo-producto">
        <h4>Agregar Producto</h4>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
        />
        <input
          type="text"
          placeholder="Género"
          value={nuevoProducto.genero}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, genero: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL Imagen"
          value={nuevoProducto.imagen}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })}
        />
        <button className="btn btn-success mt-2" onClick={agregarProducto}>Agregar</button>
      </div>

      <hr />

      <div className="lista-productos">
        <h4>Productos existentes</h4>
        {productos.map((p) => (
          <div key={p.id} className="producto-admin">
            <input value={p.nombre} onChange={(e) => editarProducto(p.id, "nombre", e.target.value)} />
            <input type="number" value={p.precio} onChange={(e) => editarProducto(p.id, "precio", e.target.value)} />
            <input value={p.genero} onChange={(e) => editarProducto(p.id, "genero", e.target.value)} />
            <input value={p.descripcion} onChange={(e) => editarProducto(p.id, "descripcion", e.target.value)} />
            <input value={p.imagen} onChange={(e) => editarProducto(p.id, "imagen", e.target.value)} />
            <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductos;
