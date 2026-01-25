import { ImgHTMLAttributes } from 'react';
import logoPng from '../../images/logo-hor.png';

export default function AppLogoIconHor(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            {...props}
            src={logoPng}
            alt="Logo Sociedad Horizontal"
            /* Forzamos el tamaño con style para ignorar a los componentes padres.
               Puedes cambiar '80px' por el tamaño que desees (100px, 120px, etc.)
            */
            style={{
                height: '70px',
                width: 'auto',
                minHeight: '50px',
                minWidth: '50px',
                display: 'block',
            }}
            className={`object-contain ${props.className || ''}`}
        />
    );
}
