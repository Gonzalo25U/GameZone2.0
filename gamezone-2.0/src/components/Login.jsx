import React, { useState } from "react";
import "../styles/login.css";

const Login = ({ onClose, setUsuarioActivo, setMostrarLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    username: "" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = (formData.email || "").trim().toLowerCase();
    const password = (formData.password || "").trim();

    if (isRegister) {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      const existe = usuarios.find(u => (u.email || "").toLowerCase() === email);
      if (existe) {
        alert("Ya existe un usuario con ese correo.");
        return;
      }
      const nuevo = { 
        nombre: formData.username || email, 
        email, 
        password, 
        rol: "user" 
      };
      usuarios.push(nuevo);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alert("Registro exitoso. Ya puedes iniciar sesión.");
      setIsRegister(false);
      return;
    }

    // Login: buscar en 'usuarios' (normalizado)
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    console.log("Intentando login con:", { email, password });
    console.log("usuarios disponibles:", usuarios);
    
    const storedUser = usuarios.find(u => 
      (u.email || "").toLowerCase() === email && 
      (u.password || "") === password
    );

    if (storedUser) {
      if (typeof setUsuarioActivo === "function") {
        setUsuarioActivo(storedUser);
      }
      localStorage.setItem("usuarioActivo", JSON.stringify(storedUser));
      
      if (typeof setMostrarLogin === "function") {
        setMostrarLogin(false);
      } else if (typeof onClose === "function") {
        onClose();
      }
      
      alert(`¡Bienvenido de nuevo, ${storedUser.nombre || storedUser.email}!`);
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button 
          className="close-btn" 
          onClick={() => {
            if (typeof setMostrarLogin === "function") {
              setMostrarLogin(false);
            } else if (typeof onClose === "function") {
              onClose();
            }
          }}
        >
          ✖
        </button>

        <h2 className="login-title">🎮 Bienvenido a GameZone</h2>
        <p className="login-subtitle">
          {isRegister
            ? "Crea tu cuenta para disfrutar de la mejor experiencia gamer."
            : "Inicia sesión para acceder a ofertas exclusivas y tus pedidos."}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <span className="toggle-link" onClick={() => setIsRegister(false)}>
                Inicia sesión aquí
              </span>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{" "}
              <span className="toggle-link" onClick={() => setIsRegister(true)}>
                Regístrate aquí
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;