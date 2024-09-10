class FooterComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
      :root {
          --color-background: #0a0a0a;
          --color-button: #ff770b;
          --color-gray-button: #1c1c1c;
          --color-gray: #6c6c6c;
          --height-header: 64px;
          --color-gray-font: #808080;
          --color-white-font: #ffffff;
          --color-filter-gray: #3333338d;
          --color-footer: ;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          color: rgba(255, 255, 255);
        }
        footer {
          background-color: rgba(57, 57, 57, 0.38);
          width: 100%;
          height: 290px;
          margin-top: 200px;
          padding: 30px 0 0 30px;
          border-radius: 10px 10px 0 0;
        }
      footer .footer-links a {
          text-decoration: none;
          color: white;
        }
        
        footer .footer-icons,
        footer .footer-links {
          justify-content: center;
          display: flex;
        }
        
        footer .footer-icons li,
        footer .footer-links li {
          display: inline-block;
          margin: 30px;
        }
        
        footer .footer-icons i,
        footer .footer-links a {
          font-size: 30px;
          color: white;
        }
        
        .copy-right {
          color: white;
          margin-top: 30px;
        }</style>
      <footer class="site-footer">
      <div class="footer-icons">
          <ul>
              <li><a href="https://www.facebook.com/" target="_blank"><img src="assets/images/facebook-icon.png"
                          alt="facebook-icon"></a></li>
              <li><a href="https://www.instagram.com/" target="_blank"><img src="assets/images/instagram-icon.png"
                          alt="instagram-icon"></a></li>
              <li><a href="https://www.youtube.com/" target="_blank"><img src="assets/images/youtube-icon.png"
                          alt="youtube-icon"></a></li>
          </ul>
      </div>
      <div class="footer-links">
          <ul>
              <li><a href="">Бидний тухай</a></li>
              <li><a href="">Холбоо барих</a></li>
              <li><a href="">Заавар</a></li>
              <li><a href="">Үйлчилгээний нөхцөл</a></li>
          </ul>
      </div>
      <div class="copy-right">
          <p>
              Copyright &copy; 2024 All right reserved by:
              <strong>kino site</strong>
          </p>
      </div>
  </footer>
      `;

    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("footer-component", FooterComponent);
