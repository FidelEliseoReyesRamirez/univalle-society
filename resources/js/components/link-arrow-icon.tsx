import { ImgHTMLAttributes } from 'react';
import Icon from '../../icons/link-arrow-icon.svg';

export default function LinkArrowIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            {...props}
            src={Icon}
            alt="Link Arrow Icon"
            /* Forzamos el tamaño con style para ignorar a los componentes padres.
               Puedes cambiar '80px' por el tamaño que desees (100px, 120px, etc.)
            */
            style={{
                height: '25px',
                width: 'auto',
                minHeight: '20px',
                minWidth: '20px',
                color: 'rgb(240, 42, 52)',
            }}
            className={`object-contain ${props.className || ''}`}
        />
    );
}