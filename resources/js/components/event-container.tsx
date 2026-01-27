import React from "react";
import logoPng from '../../images/logo-hor.png';

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "100%",
    maxWidth: "40em",
    color: "#111",
    boxSizing: "border-box",
    margin: "0 auto",
  },
  image: {
    width: "100%",
    height: "15em",
    backgroundSize: "cover",
  },
  content: {
    padding: "16px",
  },
  meta: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "12px",
  },
  tag: {
    color: "rgb(240, 42, 52)",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  date: {
    color: "#555",
  },
  title: {
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: 1.3,
    margin: "0 0 8px 0",
  },
  description: {
    fontSize: "14px",
    color: "#333",
    lineHeight: 1.5,
    margin: 0,
  },
};

const EsportsCard: React.FC<{ imageSrc?: string }> = ({ imageSrc }) => {
  const imageStyle: React.CSSProperties = {
    ...styles.image,
    backgroundImage: `url(${imageSrc ?? logoPng})`,
  };

  return (
    <article style={styles.card}>
      {/* Imagen / placeholder */}
      <div style={imageStyle} />

      {/* Contenido */}
      <div style={styles.content}>
        <div style={styles.meta}>
          <span style={styles.tag}>TIPO DE EVENTO</span>
          <span style={styles.date}>29/01/2026</span>
        </div>

        <h2 style={styles.title}>
          Hackaton: Primera ISI CHALLENGE de 2026 
        </h2>

        <p style={styles.description}>
          Primera Hackaton ISI: Participa en parejas o en solitario para resolver este nuevo desafío.
        </p>
      </div>
    </article>
  );
};

export default EsportsCard;
