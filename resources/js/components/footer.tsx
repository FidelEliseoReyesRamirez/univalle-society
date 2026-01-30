import fb from '@/../icons/facebook-icon.svg';
import ig from '@/../icons/insta-icon.svg';
import tt from '@/../icons/tiktok-icon.svg';
import { Link } from '@inertiajs/react';
import '.././../css/footer.css';

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="contain">
                    {/* COLUMNA UNIVALLE (Externos) */}
                    <div className="col">
                        <h1>UNIVALLE</h1>
                        <ul>
                            <li>
                                <a
                                    href="https://www.univalle.edu/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Página Principal
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.univalle.edu/?page_id=454"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Sede La Paz
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://enlace.univalle.edu/san/webform/PAutenticar.aspx "
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    SIU
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.univalle.edu/?page_id=440"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Sobre Univalle
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.google.com/maps/place/Universidad+Privada+del+Valle+Sede+La+Paz/data=!4m2!3m1!1s0x0:0xacceb97486edb698?sa=X&ved=1t:2428&ictx=111&cshid=1769698180341152"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Ubicación Google Maps
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMNA CONTACTO (Externos) */}
                    <div className="col">
                        <h1>CONTACTO</h1>
                        <ul>
                            <li>
                                <a
                                    href="https://chat.whatsapp.com/FkjOK8j9Afl1fcabVlCPGI"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Whatsapp
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.facebook.com/share/1DFRYJekGt/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.tiktok.com/@sici.univalle.la"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    TikTok
                                </a>
                            </li>
                            <li>
                                <a href="mailto:siciunivalle@outlook.com">
                                    Correo
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMNA RECURSOS (Internos - Sin nueva hoja) */}
                    <div className="col">
                        <h1>RECURSOS</h1>
                        <ul>
                            <li>
                                <Link href="/eventos-all">Eventos</Link>
                            </li>
                            <li>
                                <Link href="/noticias-all">Noticias</Link>
                            </li>
                            <li>
                                <Link href="/proyectos-all">Proyectos</Link>
                            </li>
                            <li>
                                <Link href="/#Nosotros">Acerca de</Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMNA SOCIAL */}
                    <div className="col social">
                        <h1>SOCIAL</h1>
                        <ul>
                            <li>
                                <a
                                    href="https://www.facebook.com/share/1DFRYJekGt/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={fb} alt="facebook" />
                                </a>
                            </li>
                            <li>
                                <a href="#" target="_blank" rel="noreferrer">
                                    <img src={ig} alt="instagram" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.tiktok.com/@sici.univalle.la"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img src={tt} alt="tiktok" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="clearfix"></div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
