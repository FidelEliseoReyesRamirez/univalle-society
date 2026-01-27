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
            <h1>Company</h1>
            <ul>
              <li>About</li>
              <li>Mission</li>
              <li>Services</li>
              <li>Social</li>
              <li>Get in touch</li>
            </ul>
          </div>

          <div className="col">
            <h1>Products</h1>
            <ul>
              <li>About</li>
              <li>Mission</li>
              <li>Services</li>
              <li>Social</li>
              <li>Get in touch</li>
            </ul>
          </div>

          <div className="col">
            <h1>Accounts</h1>
            <ul>
              <li>About</li>
              <li>Mission</li>
              <li>Services</li>
              <li>Social</li>
              <li>Get in touch</li>
            </ul>
          </div>

          <div className="col">
            <h1>Resources</h1>
            <ul>
              <li>Webmail</li>
              <li>Redeem code</li>
              <li>WHOIS lookup</li>
              <li>Site map</li>
              <li>Web templates</li>
              <li>Email templates</li>
            </ul>
          </div>

          <div className="col">
            <h1>Support</h1>
            <ul>
              <li>Contact us</li>
              <li>Web chat</li>
              <li>Open ticket</li>
            </ul>
          </div>

          <div className="col social">
            <h1>Social</h1>
            <ul>
              <li>
                <img src={fb} alt="social" />
              </li>
              <li>
                <img src={ig} alt="social" />
              </li>
              <li>
                <img src={tt} alt="social" />
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
