import { useState } from "react";

import { FaWhatsapp, FaFacebookF, FaLink, FaCheck } from "react-icons/fa";

import { t } from "../i18n";

import "../requests.css";

function formatDay(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Link that opens the Blood Requests page focused on this one request
function requestLink(request) {
  return `${window.location.origin}/blood-requests?request=${request.id}`;
}

// Ready-to-paste message (Bangla) with the request details and link
function buildMessage(request) {
  const lines = [
    request.urgent ? "🩸 জরুরি রক্ত দরকার!" : "🩸 রক্ত দরকার",
    "",
    `রোগী: ${request.patient_name}`,
    `রক্তের গ্রুপ: ${request.blood_group} (${request.units} ব্যাগ)`,
    `হাসপাতাল: ${request.hospital}, ${request.district}`,
    `কবে লাগবে: ${formatDay(request.needed_date)}`,
    `যোগাযোগ: ${request.contact_name} - ${request.contact_phone}`,
    "",
    "বিস্তারিত দেখুন:",
    requestLink(request),
  ];

  return lines.join("\n");
}

function ShareRequest({ request }) {
  const [copied, setCopied] = useState(false);

  const message = buildMessage(request);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    requestLink(request)
  )}&quote=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; fall back to a prompt so the user can copy by hand
      window.prompt(t("share_copy_prompt"), message);
    }
  };

  return (
    <div className="req-share">
      <span className="req-share-label">{t("share_label")}</span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="req-share-btn req-share-wa"
      >
        <FaWhatsapp /> WhatsApp
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="req-share-btn req-share-fb"
      >
        <FaFacebookF /> Facebook
      </a>

      <button
        type="button"
        className="req-share-btn req-share-copy"
        onClick={handleCopy}
      >
        {copied ? <FaCheck /> : <FaLink />}{" "}
        {copied ? t("copied") : t("share_copy")}
      </button>
    </div>
  );
}

export default ShareRequest;