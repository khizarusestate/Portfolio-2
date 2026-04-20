import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, GitBranch, Briefcase, Send, AlertCircle, CheckCircle } from "lucide-react";

const CONTACT_DATA = {
  contactForm: {
    fields: [
      {
        name: "name",
        type: "text",
        label: "Name",
        placeholder: "Your Name",
        required: true,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "you@gmail.com",
        required: true,
      },
      {
        name: "message",
        type: "textarea",
        label: "Project details",
        placeholder:
          "Share what you want to build, your timeline, and any links or references.",
        required: true,
      },
    ],
    api: {
      endpoint: "https://portfolio2-server.vercel.app/api/contact",
      method: "POST",
    },
  },
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/khizarusestate",
      icon: GitBranch,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/khizar-hayat-5a604938b",
      icon: Briefcase,
    },
    {
      name: "Email",
      url: "#mail-me",
      icon: Mail,
    },
  ],
  contactInfo: {
    email: "mail me",
    phone: "+923256776142",
    location: {
      label: "Gujranwala, Punjab, Pakistan",
      mapUrl: "https://maps.google.com/?q=Gujranwala+Punjab+Pakistan",
    },
  },
  uiText: {
    title: "Get In Touch",
    description:
      "Ready to discuss your next project? I'm here to collaborate on innovative solutions and bring your vision to life.",
    connectTitle: "Connect With Me",
    ctaTitle: "Let's Build Something",
    ctaDescription:
      "I usually work best on focused, high-impact projects where I can own both the UX and the engineering – from the first layout all the way to deployment.",
    submitButton: {
      idle: "Send Message",
      loading: "Sending...",
    },
    messages: {
      success: "Thanks! Your message has been sent successfully.",
      error: "Unable to send your message. Please try again.",
      invalidEmail: "Please enter a valid email address.",
      serverError: "Server error. Please try again in a moment.",
      networkError:
        "Connection error. Please check your internet connection and try again.",
    },
  },
};

// ─── Form Component ────────────────────────────────────────────────────────
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState({});
  const formRef = useRef(null);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = CONTACT_DATA.uiText.messages.invalidEmail;
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (validation !== true) {
      setErrorMessage(Object.values(validation)[0]);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(CONTACT_DATA.contactForm.api.endpoint, {
        method: CONTACT_DATA.contactForm.api.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTouchedFields({});

      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        setErrorMessage(CONTACT_DATA.uiText.messages.networkError);
      } else {
        setErrorMessage(CONTACT_DATA.uiText.messages.serverError);
      }
      setStatus("error");
    }
  };

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {CONTACT_DATA.contactForm.fields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
          viewport={{ once: true }}
        >
          <label className="block text-[11px] md:text-[12px] font-semibold tracking-[1px] text-white/60 uppercase mb-2 md:mb-3">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              required={field.required}
              className="w-full h-24 md:h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 font-['Exo_2'] text-[13px] md:text-[14px] resize-none"
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              required={field.required}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 font-['Exo_2'] text-[13px] md:text-[14px]"
            />
          )}

          {/* Error message */}
          <AnimatePresence>
            {touchedFields[field.name] && formData[field.name] === "" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[10px] md:text-[11px] text-red-400/80 mt-1 flex items-center gap-1"
              >
                <AlertCircle size={12} />
                This field is required
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Status Messages */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 md:p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2"
          >
            <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
            <p className="text-[12px] md:text-[13px] text-green-400 font-medium">
              {CONTACT_DATA.uiText.messages.success}
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 md:p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-[12px] md:text-[13px] text-red-400 font-medium">
              {errorMessage || CONTACT_DATA.uiText.messages.error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 border border-white/20 hover:border-white/40 rounded-lg px-6 py-3 md:py-4 text-white font-['Anton'] text-[12px] md:text-[14px] tracking-[1.5px] md:tracking-[2px] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span
          animate={{
            opacity: status === "loading" ? 0.6 : 1,
          }}
        >
          {status === "loading"
            ? CONTACT_DATA.uiText.messages.loading
            : CONTACT_DATA.uiText.submitButton.idle}
        </motion.span>
        {status === "loading" ? null : <Send size={14} />}
      </motion.button>
    </motion.form>
  );
}

// ─── Info Card Component ────────────────────────────────────────────────────
function InfoCard({ icon: Icon, label, value, href, isLink = false }) {
  return (
    <motion.a
      href={href}
      target={isLink ? "_blank" : "_self"}
      rel={isLink ? "noopener noreferrer" : ""}
      className={`p-4 md:p-5 rounded-lg border border-white/10 bg-white/5 group cursor-pointer transition-all duration-300 hover:border-white/30 hover:bg-white/10 ${
        !isLink ? "pointer-events-none" : ""
      }`}
      whileHover={isLink ? { y: -4, borderColor: "rgba(255,255,255,0.3)" } : {}}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] md:text-[11px] text-white/40 uppercase tracking-[0.5px] md:tracking-[1px] mb-1">
            {label}
          </p>
          <p className="text-[12px] md:text-[13px] font-medium text-white group-hover:text-white/80 transition-colors truncate">
            {value}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

// ─── Main Contact Section ──────────────────────────────────────────────────
export default function Contact() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#060606] overflow-hidden text-[rgb(234,234,234)] py-16 md:py-32 px-6 md:px-[8%]"
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
      `}</style>

      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px)
          `,
        }}
      />

      {/* Top-Left Accent */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.08), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Top-Right Accent */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.05), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-12 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center gap-3 mb-4 md:mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="w-6 md:w-8 h-px bg-gradient-to-r from-white/40 to-transparent" />
            <span className="text-[8px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-white/30 uppercase font-['Exo_2'] font-semibold">
              04 — Contact
            </span>
          </motion.div>

          <motion.h1
            className="font-['Anton'] text-[40px] md:text-[72px] leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-3 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              {CONTACT_DATA.uiText.title}
            </span>
          </motion.h1>

          <motion.p
            className="text-white/50 text-[11px] md:text-[14px] max-w-2xl leading-relaxed font-['Exo_2']"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {CONTACT_DATA.uiText.description}
          </motion.p>

          <div
            className="h-px mt-4 md:mt-6"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.05))",
            }}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>

          {/* Right: Info & Social */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
          >
            {/* Connect Section */}
            <div>
              <motion.h3
                className="font-['Anton'] text-[20px] md:text-[24px] tracking-[-0.5px] mb-4 md:mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {CONTACT_DATA.uiText.connectTitle}
              </motion.h3>

              <div className="space-y-3">
                {CONTACT_DATA.socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 md:p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + index * 0.1,
                      }}
                      viewport={{ once: true }}
                      whileHover={{ x: 4 }}
                    >
                      <Icon size={20} className="text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-[12px] text-white/40 uppercase tracking-[0.5px] md:tracking-[1px]">
                          {link.name}
                        </p>
                        <p className="text-[11px] md:text-[13px] text-white group-hover:text-white/90 transition-colors truncate">
                          {link.name === "Email"
                            ? CONTACT_DATA.contactInfo.email
                            : link.name}
                        </p>
                      </div>
                      <span className="text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0">
                        →
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Contact Info Cards */}
            <div>
              <motion.h3
                className="font-['Anton'] text-[20px] md:text-[24px] tracking-[-0.5px] mb-4 md:mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                viewport={{ once: true }}
              >
                Quick Contact
              </motion.h3>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <InfoCard
                    icon={Mail}
                    label="Email"
                    value={CONTACT_DATA.contactInfo.email}
                    href={`mailto:${CONTACT_DATA.contactInfo.email}`}
                    isLink={true}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  viewport={{ once: true }}
                >
                  <InfoCard
                    icon={Phone}
                    label="Phone"
                    value={CONTACT_DATA.contactInfo.phone}
                    href={`tel:${CONTACT_DATA.contactInfo.phone}`}
                    isLink={true}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <InfoCard
                    icon={MapPin}
                    label="Location"
                    value={CONTACT_DATA.contactInfo.location.label}
                    href={CONTACT_DATA.contactInfo.location.mapUrl}
                    isLink={true}
                  />
                </motion.div>
              </div>
            </div>

            {/* CTA Box */}
            <motion.div
              className="p-5 md:p-6 rounded-lg border border-white/10 bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              viewport={{ once: true }}
            >
              <h4 className="font-['Anton'] text-[14px] md:text-[16px] mb-2">
                {CONTACT_DATA.uiText.ctaTitle}
              </h4>
              <p className="text-[10px] md:text-[13px] text-white/60 leading-relaxed">
                {CONTACT_DATA.uiText.ctaDescription}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Divider */}
        <motion.div
          className="h-px mt-16 md:mt-24"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        />
      </div>
    </section>
  );
}
