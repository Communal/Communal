import React from "react";

export const products = [
  {
    id: "facebook",
    platform: "Facebook",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#fff" />
        <circle cx="16" cy="16" r="14" fill="#1877F3" />
        <path
          d="M21.333 16H17.333V26.667H13.333V16H10.667V12.667H13.333V10.667C13.333 8.453 14.786 6.667 17.333 6.667H21.333V10.667H18.667C18.299 10.667 18 10.966 18 11.333V12.667H21.333V16Z"
          fill="white"
        />
      </svg>
    ),
    description:
      "FB Account verified by email ( email not included). Male or female profile 2FA included. the profile information is partially filled",
    stock: 2000,
    price: 1000,
  },
  {
    id: "instagram",
    platform: "Instagram",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#fff" />
        <circle cx="16" cy="16" r="14" fill="url(#ig-gradient)" />
        <defs>
          <radialGradient
            id="ig-gradient"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(16 16) scale(14)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#feda75" />
            <stop offset="0.5" stopColor="#fa7e1e" />
            <stop offset="1" stopColor="#d62976" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="6" fill="#fff" />
        <circle cx="16" cy="16" r="4" fill="#d62976" />
        <circle cx="22.5" cy="9.5" r="1.5" fill="#fff" />
      </svg>
    ),
    description:
      "Instagram Account with profile photo, bio, and 2FA enabled. Ready for use.",
    stock: 1500,
    price: 1200,
  },
  {
    id: "twitter",
    platform: "Twitter",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#fff" />
        <circle cx="16" cy="16" r="14" fill="#1DA1F2" />
        <path
          d="M24 12.557c-.793.352-1.644.59-2.538.697a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16 11c-2.485 0-4.5 2.015-4.5 4.5 0 .353.04.697.116 1.027C8.728 16.36 6.1 14.884 4.392 12.67c-.387.665-.61 1.44-.61 2.267 0 1.564.797 2.944 2.012 3.755-.74-.023-1.436-.227-2.045-.567v.057c0 2.187 1.556 4.012 3.624 4.426-.379.104-.779.16-1.192.16-.292 0-.573-.028-.849-.08.574 1.792 2.24 3.096 4.213 3.13A8.98 8.98 0 0 1 2 25.13a12.68 12.68 0 0 0 6.88 2.017c8.253 0 12.774-6.837 12.774-12.774 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 26 10.92a8.93 8.93 0 0 1-2.56.7z"
          fill="#fff"
        />
      </svg>
    ),
    description:
      "Twitter Account with verified email and profile. Ready for instant use.",
    stock: 800,
    price: 900,
  },
];
