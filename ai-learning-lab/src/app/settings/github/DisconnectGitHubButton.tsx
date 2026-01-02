"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Unlink, X, AlertTriangle } from "lucide-react";

export function DisconnectGitHubButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const response = await fetch("/api/github/repos", {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to disconnect:", error);
    } finally {
      setIsDisconnecting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium lowercase transition-all duration-200"
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        }}
      >
        <Unlink className="h-4 w-4" />
        disconnect
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-2xl"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1 transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-dark)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Icon */}
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
              >
                <AlertTriangle className="h-6 w-6" style={{ color: "#ef4444" }} />
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold lowercase" style={{ color: "var(--text-white)" }}>
                disconnect github?
              </h2>

              {/* Description */}
              <p className="mt-2 text-sm lowercase" style={{ color: "var(--text-gray)" }}>
                this will remove your github connection. you can reconnect at any time, but
                your repository selections will be lost.
              </p>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-outline flex-1"
                >
                  cancel
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium lowercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                  }}
                  onMouseOver={(e) => {
                    if (!isDisconnecting) {
                      e.currentTarget.style.backgroundColor = "#dc2626";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                  }}
                >
                  {isDisconnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      disconnecting...
                    </>
                  ) : (
                    "disconnect"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
