import ".././../css/footer.css";
import fb from '@/../icons/facebook-icon.svg';
import ig from '@/../icons/insta-icon.svg';
import tt from '@/../icons/tiktok-icon.svg';

const Footer = () => {
  return (
    <>


      {/* FOOTER */}
      <footer className="footer">
        <div className="contain">

          <div className="col">
            <h1>UNIVALLE</h1>
            <ul>
              <li><a href="https://www.univalle.edu/" target="_blank">Página Principal</a></li>
              <li><a href="https://www.univalle.edu/?page_id=454" target="_blank">Sede La Paz</a></li>
              <li><a href="https://enlace.univalle.edu/san/webform/PAutenticar.aspx " target="_blank">SIU</a></li>
              <li><a href="https://www.univalle.edu/?page_id=440" target="_blank">Sobre Univalle</a></li>
              <li><a href="https://www.google.com/maps/place/Universidad+Privada+del+Valle+Sede+La+Paz/data=!4m2!3m1!1s0x0:0xacceb97486edb698?sa=X&ved=1t:2428&ictx=111&cshid=1769698180341152" target="_blank">Ubicación Google Maps</a></li>
            </ul>
          </div>

          <div className="col">
            <h1>CONTACTO</h1>
            <ul>
              <li><a href="https://chat.whatsapp.com/FkjOK8j9Afl1fcabVlCPGI" target="_blank">Whatsapp</a></li>
              <li><a href="https://www.facebook.com/share/1DFRYJekGt/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://www.tiktok.com/@sici.univalle.la" target="_blank" rel="noopener noreferrer">TikTok</a></li>
              <li><a href="mailto:siciunivalle@outlook.com" target="_blank">Correo</a></li>
            </ul>
          </div>

          <div className="col">
            <h1>RECURSOS</h1>
            <ul>
              <li><a href="#" target="_blank">Eventos</a></li>
              <li><a href="#" target="_blank">Noticias</a></li>
              <li><a href="#" target="_blank">Proyectos</a></li>
              <li><a href="#" target="_blank">Investigación</a></li>
              <li><a href="#" target="_blank">Acerca de</a></li>
            </ul>
          </div>


          <div className="col social">
            <h1>SOCIAL</h1>
            <ul>
              <li>
                <a href="https://www.facebook.com/share/1DFRYJekGt/" target="_blank" rel="noopener noreferrer"><img src={fb} alt="facebook" /></a>
              </li>
              <li>
                <a href="#" target="_blank"><img src={ig} alt="instagram" /></a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@sici.univalle.la" target="_blank"><img src={tt} alt="tiktok" /></a>
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
