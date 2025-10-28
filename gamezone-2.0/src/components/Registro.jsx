import React, { useState } from "react";
import "../styles/login.css";

const Registro = () => {
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.find(u => u.email === formData.email)) {
      setError("El email ya está registrado.");
      return;
    }

    // Por defecto, los usuarios nuevos son 'usuario'
    const nuevoUsuario = { ...formData, rol: "usuario" };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    setExito("Registro exitoso! Ahora puedes iniciar sesión.");
    setError("");
    setFormData({ nombre: "", email: "", password: "" });
  };

  return (
    <div className="login-container">
      <h2>Registro</h2>
      {error && <p className="error-login">{error}</p>}
      {exito && <p className="exito-login">{exito}</p>}
      <form onSubmit={handleRegistro}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;
