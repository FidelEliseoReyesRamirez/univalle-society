import { ImgHTMLAttributes } from 'react';
import logoPng from '../../images/logo.png';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            {...props}
            src={logoPng}
            alt="Logo Sociedad"
            /* Forzamos el tamaño con style para ignorar a los componentes padres.
               Puedes cambiar '80px' por el tamaño que desees (100px, 120px, etc.)
            */
            style={{
                height: '200px',
                width: 'auto',
                minHeight: '200px',
                minWidth: '200px',
                display: 'block',
                marginBottom: '15px',
            }}
            className={`object-contain ${props.className || ''}`}
        />
    );
}
