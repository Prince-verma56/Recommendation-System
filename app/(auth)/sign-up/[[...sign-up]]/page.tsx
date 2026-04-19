import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "400px",
        background: "radial-gradient(ellipse, rgba(0,113,227,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{ marginBottom: "32px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #0071e3, #2997ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "17px",
          fontWeight: 700,
          color: "var(--text-primary)",
          margin: "0 auto 12px",
          boxShadow: "0 0 24px rgba(0,113,227,0.4)",
        }}>
          P
        </div>
        <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
          PersonaUI
        </div>
        <div style={{ fontSize: "13px", color: "rgba(var(--fg-rgb),0.4)", marginTop: "4px" }}>
          Create your adaptive workspace
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <SignUp />
      </div>
    </div>
  );
}

