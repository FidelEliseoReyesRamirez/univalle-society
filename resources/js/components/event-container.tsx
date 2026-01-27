import React from 'react';
import logoPng from '../../images/logo-hor.png';

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        width: '100%',
        maxWidth: '40em',
        color: '#111',
        boxSizing: 'border-box',
        margin: '0 auto',
    },
    image: {
        width: '100%',
        height: '15em',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    content: { padding: '16px' },
    meta: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: '12px',
    },
    tag: {
        color: 'rgb(240, 42, 52)',
        fontWeight: 800,
        letterSpacing: '0.5px',
        fontSize: '14px',
    },
    date: { color: '#555', fontSize: '14px', fontWeight: 700 },
    title: {
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: 1.3,
        margin: '0 0 8px 0',
    },
    description: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#333',
        lineHeight: 1.6,
        margin: 0,
    },
};

const EventContainer: React.FC<{ eventData: any }> = ({ eventData }) => {
    const imageStyle: React.CSSProperties = {
        ...styles.image,
        backgroundImage: `url(${eventData.imagen_ruta ?? logoPng})`,
    };

    const fechaFormateada = eventData.fecha_evento
        ? new Date(eventData.fecha_evento).toLocaleDateString('es-ES')
        : 'Próximamente';

    return (
        <article style={styles.card}>
            <div style={imageStyle} />
            <div style={styles.content}>
                <div style={styles.meta}>
                    <span style={styles.tag}>
                        {eventData.category?.nombre ?? 'GENERAL'}
                    </span>
                    <span style={styles.date}>{fechaFormateada}</span>
                </div>
                <h2 style={styles.title}>{eventData.titulo}</h2>
                <p style={styles.description}>{eventData.extracto}</p>
            </div>
        </article>
    );
};

export default EventContainer;
