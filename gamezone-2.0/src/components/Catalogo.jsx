import React, { useState, useEffect } from 'react';
import productosIniciales from '../data/productosIniciales';
import "../styles/catalogo.css";

const Catalogo = ({ agregarAlCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Función para cargar todos los productos
  const cargarProductos = () => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    const productosAdmin = productosGuardados.filter(p => p && p.id); // Filtramos productos válidos
    const todosLosProductos = [...productosIniciales, ...productosAdmin];
    setProductos(todosLosProductos);
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "productos") {
        cargarProductos();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(cargarProductos, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="catalogo" className="catalogo-section">
      <div className="catalogo-header">
        <h2>Nuestros Juegos</h2>
        <p>Descubre nuestra selección de títulos</p>
      </div>

      <div className="productos-grid">
        {productos.slice(0, 3).map(producto => (
          <div key={producto.id} className="producto-card">
            <img src={producto.imagen} alt={producto.nombre} />
            <div className="producto-info">
              <h3>{producto.nombre}</h3>
              <p className="precio">${producto.precio}</p>
              <p className="descripcion">{producto.descripcion}</p>
              <button 
                className="btn-agregar"
                onClick={() => agregarAlCarrito(producto)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="btn-ver-mas neon-button"
        onClick={() => setModalAbierto(true)}
      >
        Ver más juegos
      </button>

      {/* Modal de catálogo completo */}
      {modalAbierto && (
        <div className="catalogo-modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="catalogo-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setModalAbierto(false)}>
              ✕
            </button>
            <h2>Catálogo Completo</h2>
            <div className="modal-grid">
              {productos.map(producto => (
                <div key={producto.id} className="producto-card modal-card">
                  <img src={producto.imagen} alt={producto.nombre} />
                  <div className="producto-info">
                    <h3>{producto.nombre}</h3>
                    <p className="precio">${producto.precio}</p>
                    <p className="descripcion">{producto.descripcion}</p>
                    <button 
                      className="btn-agregar"
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalogo;