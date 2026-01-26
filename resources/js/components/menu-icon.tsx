import { ImgHTMLAttributes } from 'react';
import logoPng from '../../icons/menu-icon.svg';

export default function MenuIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            {...props}
            src={logoPng}
            alt="Menu Icon"
            /* Forzamos el tamaño con style para ignorar a los componentes padres.
               Puedes cambiar '80px' por el tamaño que desees (100px, 120px, etc.)
            */
            style={{
                height: '40px',
                width: 'auto',
                minHeight: '40px',
                minWidth: '40px',
                display: 'block',
            }}
            className={`object-contain ${props.className || ''}`}
        />
    );
}
