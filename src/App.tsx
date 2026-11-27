import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, PointerEvent } from "react";
import type { Group } from "three";
import "./App.css";

const EMAIL = "mohamedalithaju09@gmail.com";
const LINKEDIN =
  "https://www.linkedin.com/in/mohamed-ali-t-595591429";

/* =========================
   3D BURJ KHALIFA
========================= */

function BurjKhalifa() {
  const tower = useRef<Group>(null);

  useFrame((state) => {
    if (tower.current) {
      tower.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });

  const levels = Array.from({ length: 28 }, (_, i) => {
    const width = Math.max(0.1, 1.25 - i * 0.041);
    return {
      width,
      height: 0.17,
      y: i * 0.21 - 2.8,
    };
  });

  return (
    <group ref={tower}>
      {levels.map((level, index) => (
        <group key={index} position={[0, level.y, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry
              args={[level.width, level.height, level.width * 0.8]}
            />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#879da3" : "#526b73"}
              metalness={0.75}
              roughness={0.22}
            />
          </mesh>

          <mesh position={[0, 0, level.width * 0.405]}>
            <boxGeometry
              args={[level.width * 0.78, 0.08, 0.012]}
            />
            <meshStandardMaterial
              color="#e6c18c"
              emissive="#b7834b"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={`spire-${i}`} position={[0, 3.05 + i * 0.17, 0]}>
          <cylinderGeometry
            args={[
              Math.max(0.008, 0.055 - i * 0.005),
              Math.max(0.025, 0.09 - i * 0.007),
              0.2,
              8,
            ]}
          />
          <meshStandardMaterial
            color="#c5b9a3"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      ))}

      <mesh position={[0, -2.88, 0]}>
        <cylinderGeometry args={[0.9, 1.3, 0.2, 8]} />
        <meshStandardMaterial color="#343a39" />
      </mesh>
    </group>
  );
}

function BurjScene() {
  return (
    <Canvas
      camera={{ position: [5, 2.5, 8], fov: 34 }}
      shadows
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.9} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2.5}
        castShadow
      />

      <pointLight
        position={[-3, 2, 3]}
        color="#e6b77d"
        intensity={25}
      />

      <Environment preset="city" />

      <Float speed={0.8} rotationIntensity={0.025} floatIntensity={0.04}>
        <BurjKhalifa />
      </Float>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.95, 0]}
        receiveShadow
      >
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial
          color="#202728"
          roughness={0.65}
        />
      </mesh>

      <ContactShadows
        position={[0, -2.9, 0]}
        opacity={0.5}
        scale={8}
        blur={2.5}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.25}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}

/* =========================
   INTERACTIVE ID CARD
========================= */

function IDCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const moveCard = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - y) * 16,
      y: (x - 0.5) * 20,
    });
  };

  const resetCard = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="id-stage"
      onPointerMove={moveCard}
      onPointerLeave={resetCard}
    >
      <div className="lanyard">
        <div className="lanyard-strap">
          <span>KEC</span>
          <small>KONGU ENGINEERING COLLEGE</small>
          <span>KEC</span>
        </div>
      </div>

      <div className="lanyard-hook">
        <div className="hook-ring" />
        <div className="hook-clip" />
      </div>

      <div
        className="id-card"
        style={{
          transform: `
            perspective(1000px)
            rotateX(${tilt.x}deg)
            rotateY(${tilt.y}deg)
            rotateZ(-6deg)
          `,
        }}
      >
        <div className="id-shine" />

        <div className="id-brand">
          <div className="college-seal">K</div>

          <div className="college-name">
            <strong>KONGU</strong>
            <span>ENGINEERING COLLEGE</span>
          </div>
        </div>

        <div className="id-photo">
          <img
            src="idpro2.png"
            alt="Mohamed Ali"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <span className="photo-placeholder">YOUR PHOTO</span>
        </div>

        <h2>T. MOHAMED ALI</h2>

        <p>B.E. CIVIL ENGINEERING</p>

        <p className="id-number">26CER021</p>

        <div className="id-barcode" />

        <div className="id-bottom">
          STUDENT IDENTITY CARD
        </div>
      </div>

      <div className="id-light" />

      <span className="id-instruction">
        MOVE YOUR CURSOR TO INTERACT
      </span>
    </div>
  );
}

/* =========================
   MAIN WEBSITE
========================= */

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(0);
  const [sent, setSent] = useState(false);

  const roles = [
    "Civil Engineering Student",
    "Civil Engineering Enthusiast",
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveRole((current) => (current === 0 ? 1 : 0));
    }, 2500);

    return () => window.clearInterval(timer);
  }, []);

  const projects = [
    {
      number: "01",
      category: "CIVIL ENGINEERING · IoT",
      title: "Smart Drainage Monitoring System",
      description:
        "A smart monitoring concept designed to identify rising drainage water levels and detect potential overflow conditions. The prototype explores sensor-based monitoring and alert communication.",
      tags: ["Arduino", "Water Sensor", "IoT"],
    },
    {
      number: "02",
      category: "PRACTICAL LEARNING · EEE",
      title: "EEE Hands-on Training",
      description:
        "A practical learning experience focused on exploring electrical and electronics fundamentals through hands-on activities, demonstrations and technical exposure.",
      tags: ["EEE", "Practical Learning", "Training"],
    },
    {
      number: "03",
      category: "DIGITAL · CREATIVE",
      title: "Web Development and Design",
      description:
        "Creating responsive web experiences with an interest in clean layouts, thoughtful visual design and user-friendly interfaces.",
      tags: ["HTML", "CSS", "Web Design"],
    },
  ];

  const skills = [
    ["01", "HTML5", "WEB"],
    ["02", "CSS3", "WEB"],
    ["03", "AutoCAD", "EXPLORING"],
    ["04", "SketchUp", "EXPLORING"],
    ["05", "Python Basics", "PROGRAMMING"],
    ["06", "C Programming", "PROGRAMMING"],
    ["07", "Arduino", "PROTOTYPING"],
    ["08", "Bootstrap", "WEB"],
  ];

  const closeMenu = () => setMenuOpen(false);

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");

    const subject = encodeURIComponent(
      `Portfolio message from ${name}`
    );

    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    setSent(true);
    form.reset();
  };

  return (
    <main>
      {/* NAVBAR */}

      <header className="navbar">
        <a href="#home" className="brand">
          M<span>.</span>A
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>

          <a
            href="#contact"
            className="nav-connect"
            onClick={closeMenu}
          >
            Let's Connect <span>↗</span>
          </a>
        </nav>
      </header>

      {/* HOME */}

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> ENGINEERING · DESIGN · CREATIVITY
          </p>

          <h1>
            Ideas into
            <br />
            <em>Impact.</em>
          </h1>

          <p className="hero-subtitle">
            Mohamed Ali <span>—</span> Aspiring Civil Engineer and Vibe coder
          </p>

          <p className="hero-description">
            Exploring the intersection of civil engineering,
            technology and design. Learning today to contribute
            to smarter infrastructure and meaningful spaces tomorrow.
          </p>

          <div className="hero-actions">
            <a href="#about" className="gold-button">
              Explore Portfolio <span>↗</span>
            </a>

            <a href="#projects" className="quiet-link">
              View my work
            </a>
          </div>

          <div className="hero-socials">
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN ↗
            </a>

            <a href={`mailto:${EMAIL}`}>
              EMAIL ↗
            </a>
          </div>
        </div>

        <div className="hero-card-area">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <IDCard />

          <span className="hero-side-note">
            KONGU ENGINEERING COLLEGE · 2026
          </span>
        </div>

        <div className="hero-bottom">
          
          <span className="scroll-line" />
          <span>01 / 05</span>
        </div>
      </section>

      {/* ABOUT */}

      <section className="about-section section" id="about">
        <div className="section-kicker">
          <span>01</span>
          ABOUT ME
          <i />
        </div>

        <div className="about-layout">
          <div className="about-copy">
            <p className="eyebrow">A LITTLE ABOUT MY JOURNEY</p>

            <h2>
              Curious mind.
              <br />
              <em>Builder's spirit.</em>
            </h2>

            <div className="role-line">
              <span>I AM A</span>
              <strong key={activeRole}>
                {roles[activeRole]}
              </strong>
            </div>

            <p>
              I am a first-year B.E. Civil Engineering student
              at Kongu Engineering College, interested in how
              structures, materials and technology shape the
              world around us.
            </p>

            <p>
              I enjoy exploring engineering tools, learning
              through practical experiences and turning ideas
              into small projects. I am developing my foundation
              with a growing interest in structural engineering
              and sustainable infrastructure.
            </p>

            <a href="#contact" className="text-link">
              LET'S CONNECT <span>↗</span>
            </a>
          </div>

          <div className="burj-panel">
            <div className="burj-heading">
              <span>ARCHITECTURE / 001</span>
              <span>DUBAI</span>
            </div>

            <div className="burj-canvas">
              <BurjScene />
            </div>

            <div className="burj-caption">
              <strong>Burj Khalifa</strong>
              <span>Dubai · United Arab Emirates</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}

      <section className="projects-section section" id="projects">
        <div className="section-kicker">
          <span>02</span>
          SELECTED WORK
          <i />
        </div>

        <div className="section-heading-row">
          <div>
            <p className="eyebrow">IDEAS TAKING SHAPE</p>

            <h2>
              Projects &
              <br />
              <em>Experiences.</em>
            </h2>
          </div>

          <p className="section-intro">
            A growing collection of projects, practical learning
            and creative exploration.
          </p>
        </div>

        <div className="project-list">
          {projects.map((project) => (
            <article className="project-item" key={project.number}>
              <span className="project-no">
                {project.number}
              </span>

              <div className="project-main">
                <span className="project-type">
                  {project.category}
                </span>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <span className="project-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      {/* SKILLS */}

      <section className="skills-section section" id="skills">
        <div className="section-kicker">
          <span>03</span>
          MY TOOLKIT
          <i />
        </div>

        <div className="section-heading-row">
          <div>
            <p className="eyebrow">ALWAYS LEARNING</p>

            <h2>
              Skills in
              <br />
              <em>Progress.</em>
            </h2>
          </div>

          <p className="section-intro">
            Building a foundation across engineering,
            digital tools and programming.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map(([number, name, category]) => (
            <div className="skill-tile" key={number}>
              <span>{number}</span>
              <h3>{name}</h3>
              <small>{category}</small>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}

      <section className="contact-section section" id="contact">
        <div className="section-kicker">
          <span>04</span>
          GET IN TOUCH
          <i />
        </div>

        <div className="contact-layout">
          <div className="contact-copy">
            <p className="eyebrow">
              HAVE A PROJECT OR AN OPPORTUNITY?
            </p>

            <h2>
              Let's create
              <br />
              <em>something</em>
              <br />
              meaningful.
            </h2>

            <p>
              Interested in connecting, learning and exploring
              opportunities in engineering and technology.
              Feel free to reach out.
            </p>

            <a
              className="contact-detail"
              href={`mailto:${EMAIL}`}
            >
              ✉ <span>{EMAIL}</span> ↗
            </a>

            <a
              className="contact-detail"
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
            >
              in <span>LinkedIn Profile</span> ↗
            </a>
          </div>

          <form
            className="message-card"
            onSubmit={submitMessage}
          >
            <div className="form-top">
              <span>YOUR MESSAGE</span>
              <span>✳</span>
            </div>

            <label htmlFor="name">YOUR NAME</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
            />

            <label htmlFor="email">EMAIL ADDRESS</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />

            <label htmlFor="message">MESSAGE</label>

            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Write your message here..."
              required
            />

            <button type="submit" className="send-button">
              Send Message <span>↗</span>
            </button>

            {sent && (
              <p className="form-success">
                Your email app will open with your message.
              </p>
            )}
          </form>
        </div>

        {/* FOOTER */}

        <footer className="footer">
          <a href="#home" className="brand">
            M<span>.</span>A
          </a>

          <span>
            DESIGNED WITH CURIOSITY · © 2026 MOHAMED ALI
          </span>

          <a href="#home">BACK TO TOP ↑</a>
        </footer>
      </section>
    </main>
  );
}

export default App;


