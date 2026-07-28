import React from "react";

/* "Dabba" theme — inspired by Mumbai's dabbawala tiffin-relay:
   stacked circular tins, warm market colours, hand-lettered feel. */
export const Theme = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');
    :root{
      --bg:#FBF6EC; --card:#FFFFFF; --ink:#2A2118; --ink-soft:#6B5F4F;
      --line:#EAE0CB; --marigold:#E7A33E; --marigold-dk:#C6822A;
      --chili:#C1442E; --leaf:#4C7A4C; --leaf-bg:#E8F0E4;
      --chili-bg:#F7E6E1; --indigo:#3A4368; --indigo-bg:#E7E9F2;
      --cream-2:#F4EDDD;
    }
    .dabba-root{font-family:'Manrope',sans-serif;color:var(--ink);background:var(--bg);}
    .dabba-display{font-family:'Fraunces',serif;}
    .dabba-scroll{max-width:1180px;margin:0 auto;padding:0 24px;}
    .dabba-card{background:var(--card);border:1px solid var(--line);border-radius:16px;}
    .dabba-ring{width:10px;height:10px;border-radius:50%;display:inline-block;}
    .dabba-btn{font-family:'Manrope',sans-serif;font-weight:700;letter-spacing:.01em;transition:transform .15s ease, box-shadow .15s ease;}
    .dabba-btn:active{transform:scale(.97);}
    .dabba-tab{transition:background .15s ease,color .15s ease;}
  `}</style>
);

/* Signature mark: three stacked tiffin tiers */
export const DabbaMark = ({ size = 34, ring = "var(--marigold)" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="16" y="2" width="8" height="4" rx="1.5" fill={ring} />
    <rect x="6" y="7" width="28" height="10" rx="4" fill={ring} opacity="0.35" />
    <rect x="6" y="17" width="28" height="10" rx="4" fill={ring} opacity="0.65" />
    <rect x="6" y="27" width="28" height="10" rx="4" fill={ring} />
  </svg>
);
