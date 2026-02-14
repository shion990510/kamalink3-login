import '../styles/InstagramSection.css'

export default function InstagramSection() {
  return (
    <section className="instagram-section">
      <div className="instagram-container">
        <div className="instagram-header">
          <h2>📸 Instagram</h2>
          <p>コトオコシ鎌倉の最新情報をチェック</p>
        </div>

        <div className="instagram-content">
          <div className="instagram-card">
            <div className="instagram-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0ZM12 24C12 17.373 17.373 12 24 12C30.627 12 36 17.373 36 24C36 30.627 30.627 36 24 36C17.373 36 12 30.627 12 24ZM30.5 12C30.5 13.1046 31.3954 14 32.5 14C33.6046 14 34.5 13.1046 34.5 12C34.5 10.8954 33.6046 10 32.5 10C31.3954 10 30.5 10.8954 30.5 12Z"
                  fill="url(#paint0_linear)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="0"
                    y1="48"
                    x2="48"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FD5949" />
                    <stop offset="0.5" stopColor="#D6249F" />
                    <stop offset="1" stopColor="#285AEB" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3>コトオコシ鎌倉</h3>
            <p className="instagram-description">
              古都の歴史と文化を守るプロジェクト
            </p>
            <a
              href="https://www.instagram.com/kotookoshikamakura/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-button"
            >
              Instagramで見る
            </a>
          </div>

          <iframe
            title="Instagram Embed"
            src="https://www.instagram.com/kotookoshikamakura/embed"
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            className="instagram-embed"
            style={{ border: 'none', overflow: 'hidden' }}
          ></iframe>
        </div>
      </div>
    </section>
  )
}
