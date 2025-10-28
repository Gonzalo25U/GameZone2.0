import React, { useState, useEffect } from "react";
import categoriasIniciales from "../data/categoriasIniciales";
import "../styles/adminPanel.css";
import ModalAlert from "./ModalAlert";
import ModalInfo from "./ModalInfo";
import MensajesPanel from './MensajesPanel';

const AdminPanel = ({ abierto, cerrar }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "usuario",
  });
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    imagen: "",
    descripcion: "",
    categoriaId: "",
    descuento: "",
  });
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [modalEliminarProducto, setModalEliminarProducto] = useState(null);
  const [modalEliminarUsuario, setModalEliminarUsuario] = useState(null);
  const [modalInfo, setModalInfo] = useState({ visible: false, mensaje: "", titulo: "" });
  const [mensajes, setMensajes] = useState([]);
  const [modalEliminarMensaje, setModalEliminarMensaje] = useState(null);
  const [tabActiva, setTabActiva] = useState('productos');

  useEffect(() => {
    try {
      const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
      const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
      const ventasGuardadas = JSON.parse(localStorage.getItem("ventas")) || [];
      const mensajesGuardados = JSON.parse(localStorage.getItem("mensajes")) || [];

      // filtrar entradas inválidas y normalizar
      const productosValidos = (productosGuardados || []).filter((p) => p && typeof p === "object" && p.id && (p.nombre || p.nombre === ""));
      const usuariosValidos = (usuariosGuardados || []).filter((u) => u && typeof u === "object" && (u.email || u.id));

      if ((productosGuardados || []).some((p) => p == null)) {
        console.warn("AdminPanel: se encontraron productos null/undefined en localStorage, se han filtrado.");
      }
      if ((usuariosGuardados || []).some((u) => u == null)) {
        console.warn("AdminPanel: se encontraron usuarios null/undefined en localStorage, se han filtrado.");
      }

      setProductos(productosValidos);
      setUsuarios(usuariosValidos);
      setVentas(ventasGuardadas || []);
      setMensajes(mensajesGuardados);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setProductos([]);
      setUsuarios([]);
      setVentas([]);
      setMensajes([]);
    }
  }, []);

  const mostrarError = (titulo, mensaje) => {
    setModalInfo({
      visible: true,
      titulo,
      mensaje
    });
  };

  // ---------- Usuarios CRUD ----------
  const agregarUsuario = () => {
    if (!nuevoUsuario.nombre?.trim()) {
      mostrarError("Campo requerido", "El nombre es obligatorio");
      return;
    }
    if (!nuevoUsuario.email?.trim()) {
      mostrarError("Campo requerido", "El email es obligatorio");
      return;
    }
    if (!nuevoUsuario.password?.trim()) {
      mostrarError("Campo requerido", "La contraseña es obligatoria");
      return;
    }
    if (nuevoUsuario.password.length < 6) {
      mostrarError("Contraseña inválida", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nuevoUsuario.email.trim())) {
      mostrarError("Email inválido", "Ingrese un email válido");
      return;
    }

    const email = nuevoUsuario.email.trim().toLowerCase();
    if (usuarios.find((u) => (u.email || "").toLowerCase() === email)) {
      alert("El email ya está registrado.");
      return;
    }
    const usuarioValidado = {
      ...nuevoUsuario,
      id: Date.now().toString(),
      nombre: nuevoUsuario.nombre.trim(),
      email,
      password: nuevoUsuario.password.trim(),
    };
    const nuevos = [...usuarios, usuarioValidado];
    setUsuarios(nuevos);
    localStorage.setItem("usuarios", JSON.stringify(nuevos));
    setNuevoUsuario({ nombre: "", email: "", password: "", rol: "usuario" });
  };

  const editarUsuario = (usuario) => {
    if (!usuario || !usuario.id) {
      alert("Usuario inválido.");
      return;
    }
    if (!usuario?.nombre?.trim() || !usuario?.email?.trim()) {
      alert("Complete nombre y email.");
      return;
    }
    const usuarioValidado = {
      ...usuario,
      nombre: usuario.nombre.trim(),
      email: usuario.email.trim().toLowerCase(),
    };
    const actualizados = usuarios.map((u) => (u.id === usuarioValidado.id ? usuarioValidado : u));
    setUsuarios(actualizados);
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setEditandoUsuario(null);
  };

  const eliminarUsuario = (id) => {
    if (!id) return;
    const filtrados = usuarios.filter((u) => u.id !== id);
    setUsuarios(filtrados);
    localStorage.setItem("usuarios", JSON.stringify(filtrados));
    const activo = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    if (activo?.id === id) localStorage.removeItem("usuarioActivo");
    setModalEliminarUsuario(null);
  };

  // ---------- Productos CRUD ----------
  const agregarProducto = () => {
    if (!nuevoProducto.nombre?.trim()) {
      mostrarError("Campo requerido", "El nombre del producto es obligatorio");
      return;
    }
    if (!nuevoProducto.precio || nuevoProducto.precio <= 0) {
      mostrarError("Campo requerido", "Ingrese un precio válido");
      return;
    }
    if (!nuevoProducto.stock || nuevoProducto.stock < 0) {
      mostrarError("Campo requerido", "Ingrese una cantidad válida de stock");
      return;
    }
    if (!nuevoProducto.categoriaId) {
      mostrarError("Campo requerido", "Seleccione una categoría");
      return;
    }
    const productoValidado = {
      ...nuevoProducto,
      id: Date.now().toString(),
      nombre: nuevoProducto.nombre.trim(),
      precio: parseFloat(nuevoProducto.precio) || 0,
      stock: parseInt(nuevoProducto.stock, 10) || 0,
      imagen: nuevoProducto.imagen?.trim() || "",
      descripcion: nuevoProducto.descripcion?.trim() || "",
      categoriaId: Number(nuevoProducto.categoriaId),
      descuento: parseInt(nuevoProducto.descuento, 10) || 0,
    };
    const nuevos = [...productos, productoValidado];
    setProductos(nuevos);
    localStorage.setItem("productos", JSON.stringify(nuevos));
    setNuevoProducto({
      nombre: "",
      precio: "",
      stock: "",
      imagen: "",
      descripcion: "",
      categoriaId: "",
      descuento: 0,
    });
  };

  const editarProducto = (producto) => {
    if (!producto || !producto.id) {
      alert("Producto inválido.");
      return;
    }
    if (!producto?.nombre?.trim() || producto?.precio == null || producto?.stock == null || !producto?.categoriaId) {
      alert("Complete nombre, precio, stock y categoría.");
      return;
    }
    const productoValidado = {
      ...producto,
      nombre: producto.nombre.trim(),
      precio: parseFloat(producto.precio) || 0,
      stock: parseInt(producto.stock, 10) || 0,
      imagen: producto.imagen?.trim() || "",
      descripcion: producto.descripcion?.trim() || "",
      categoriaId: Number(producto.categoriaId),
      descuento: parseInt(producto.descuento, 10) || 0,
    };
    const actualizados = productos.map((p) => (p.id === productoValidado.id ? productoValidado : p));
    setProductos(actualizados);
    localStorage.setItem("productos", JSON.stringify(actualizados));
    setEditandoProducto(null);
  };

  const eliminarProducto = (id) => {
    if (!id) return;
    const filtrados = productos.filter((p) => p.id !== id);
    setProductos(filtrados);
    localStorage.setItem("productos", JSON.stringify(filtrados));
    setModalEliminarProducto(null);
  };

  //render formulario producto
  const renderFormularioProducto = (isEditing = false) => {
    const defaultProduct = { nombre: "", precio: "", stock: "", imagen: "", descripcion: "", categoriaId: "", descuento: 0 };
    const current = isEditing ? (editandoProducto || defaultProduct) : nuevoProducto;
    const setCurrent = isEditing ? setEditandoProducto : setNuevoProducto;

    return (
      <div className="form-grupo">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={current?.nombre || ""}
          onChange={(e) => setCurrent({ ...current, nombre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={current?.precio || ""}
          onChange={(e) => setCurrent({ ...current, precio: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={current?.stock || ""}
          onChange={(e) => setCurrent({ ...current, stock: e.target.value })}
        />
        <select
          value={current?.categoriaId || ""}
          onChange={(e) => setCurrent({ ...current, categoriaId: Number(e.target.value) })}
        >
          <option value="">Seleccionar categoría</option>
          {categoriasIniciales.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Descuento (%)"
          min="0"
          max="100"
          value={current?.descuento || 0}
          onChange={(e) => setCurrent({ ...current, descuento: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={current?.imagen || ""}
          onChange={(e) => setCurrent({ ...current, imagen: e.target.value })}
        />
        <textarea  
          placeholder="Descripción"
          value={current?.descripcion || ""}
          onChange={(e) => setCurrent({ ...current, descripcion: e.target.value })}
        />
        {isEditing ? (
          <div className="edit-buttons">
            <button onClick={() => editarProducto(editandoProducto)}>Guardar</button>
            <button onClick={() => setEditandoProducto(null)}>Cancelar</button>
          </div>
        ) : (
          <button onClick={agregarProducto}>Agregar Producto</button>
        )}
      </div>
    );
  };

  const totalVentas = ventas.reduce((acc, v) => acc + (parseFloat(v.monto) || 0), 0);
  const cantidadVentas = ventas.length;

  const eliminarMensaje = (index) => {
    const nuevosMensajes = mensajes.filter((_, i) => i !== index);
    setMensajes(nuevosMensajes);
    localStorage.setItem("mensajes", JSON.stringify(nuevosMensajes));
    setModalEliminarMensaje(null);
  };

  return (
    <div className={`sidebar-admin ${abierto ? "abierto" : ""}`}>
      <button
          className="cerrar-admin"
          onClick={() => {
            console.log("🧩 Click en cerrar admin");
            if (typeof cerrar === "function") {
              cerrar();
            } else {
              console.warn("Prop cerrar no es función:", cerrar);
            }
          }}
        >
          ✕
      </button>
      <h3>Panel de Administración</h3>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${tabActiva === 'productos' ? 'active' : ''}`}
          onClick={() => setTabActiva('productos')}
        >
          <i className="fas fa-gamepad"></i> Productos
        </button>
        <button 
          className={`tab-btn ${tabActiva === 'usuarios' ? 'active' : ''}`}
          onClick={() => setTabActiva('usuarios')}
        >
          <i className="fas fa-users"></i> Usuarios
        </button>
        <button 
          className={`tab-btn ${tabActiva === 'mensajes' ? 'active' : ''}`}
          onClick={() => setTabActiva('mensajes')}
        >
          <i className="fas fa-envelope"></i> Mensajes
          {mensajes?.length > 0 && (
            <span className="mensajes-count">{mensajes.length}</span>
          )}
        </button>
      </div>

      <div className="tab-content">
        {tabActiva === 'productos' && (
          <section className="admin-section">
            <h4>Gestión de Productos</h4>
            {renderFormularioProducto(false)}

            <div className="lista-items">
              {(productos || []).filter((p) => p && typeof p === "object").map((producto) => (
                <div key={producto.id} className="item-admin">
                  {editandoProducto?.id === producto.id ? (
                    renderFormularioProducto(true)
                  ) : (
                    <>
                      <div className="item-info">
                        {producto?.imagen && (
                          <img src={producto.imagen} alt={producto?.nombre || "Producto"} onError={(e) => (e.target.style.display = "none")} />
                        )}
                        <div>
                          <h5>{producto?.nombre || "Sin nombre"}</h5>
                          <p>
                            ${producto?.precio ?? 0} - Stock: {producto?.stock ?? 0}
                          </p>
                          <span className="categoria-badge">
                            {categoriasIniciales.find((c) => c.id === producto?.categoriaId)?.nombre || "Sin categoría"}
                          </span>
                          {producto?.descuento > 0 && <span className="descuento-badge">-{producto.descuento}%</span>}
                        </div>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => setEditandoProducto({ ...producto })}>Editar</button>
                        <button onClick={() => setModalEliminarProducto(producto)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {tabActiva === 'usuarios' && (
          <section className="admin-section">
            <h4>Gestión de Usuarios</h4>

            <div className="form-grupo">
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={nuevoUsuario.email}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={nuevoUsuario.password}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
              />
              <select value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <button onClick={agregarUsuario}>Agregar Usuario</button>
            </div>

            <div className="lista-items">
              {(usuarios || []).filter((u) => u && typeof u === "object").map((usuario) => (
                <div key={usuario.id || usuario.email} className="item-admin">
                  {editandoUsuario?.id === usuario.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editandoUsuario?.nombre || ""}
                        onChange={(e) => setEditandoUsuario({ ...editandoUsuario, nombre: e.target.value })}
                      />
                      <input
                        type="email"
                        value={editandoUsuario?.email || ""}
                        onChange={(e) => setEditandoUsuario({ ...editandoUsuario, email: e.target.value })}
                      />
                      <select value={editandoUsuario?.rol || "usuario"} onChange={(e) => setEditandoUsuario({ ...editandoUsuario, rol: e.target.value })}>
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                      <div className="edit-buttons">
                        <button onClick={() => editarUsuario(editandoUsuario)}>Guardar</button>
                        <button onClick={() => setEditandoUsuario(null)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-info">
                        <span>{usuario?.nombre || "Sin nombre"}</span>
                        <span>{usuario?.email || "-"}</span>
                        <span className="badge">{usuario?.rol || "usuario"}</span>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => setEditandoUsuario({ ...usuario })}>Editar</button>
                        <button onClick={() => setModalEliminarUsuario(usuario)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {tabActiva === 'mensajes' && <MensajesPanel />}
      </div>

      {/* Modal Eliminar Producto */}
      {modalEliminarProducto && (
        <ModalAlert
          titulo="Eliminar Producto"
          mensaje={`¿Estás seguro de eliminar el producto "${modalEliminarProducto.nombre}"?`}
          onConfirm={() => eliminarProducto(modalEliminarProducto.id)}
          onCancel={() => setModalEliminarProducto(null)}
        />
      )}

      {/* Modal Eliminar Usuario */}
      {modalEliminarUsuario && (
        <ModalAlert
          titulo="Eliminar Usuario"
          mensaje={`¿Estás seguro de eliminar al usuario "${modalEliminarUsuario.nombre}"?`}
          onConfirm={() => eliminarUsuario(modalEliminarUsuario.id)}
          onCancel={() => setModalEliminarUsuario(null)}
        />
      )}

      {/* Modal para eliminar mensaje */}
      {modalEliminarMensaje && (
        <ModalAlert
          titulo="Eliminar Mensaje"
          mensaje={`¿Estás seguro de eliminar el mensaje de ${modalEliminarMensaje.nombre}?`}
          onConfirm={() => eliminarMensaje(modalEliminarMensaje.index)}
          onCancel={() => setModalEliminarMensaje(null)}
        />
      )}

      {/* Modal de información */}
      {modalInfo.visible && (
        <ModalInfo
          titulo={modalInfo.titulo}
          mensaje={modalInfo.mensaje}
          onClose={() => setModalInfo({ visible: false, mensaje: "", titulo: "" })}
        />
      )}
    </div>
  );
};

export default AdminPanel;