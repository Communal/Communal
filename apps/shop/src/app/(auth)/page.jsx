import Link from "next/link";
import Accordion from "../../components/Accordion";
import Image from "next/image";
import {
  BookIcon,
  ChevronRightIcon,
  ChevronsRight,
  LibraryBig,
} from "lucide-react";

const categories1 = [
  {
    id: "689a6ee1022f2a1bba30bc23",
    name: "Facebook",
    src: "/icons/facebook@3x 1.png",
  },
  {
    id: "689a6ee2022f2a1bba30bc27",
    name: "Instagram",
    src: "/icons/instagram@512px 1.png",
  },
  {
    id: "689a6ee2022f2a1bba30bc2a",
    name: "Twitter",
    src: "/icons/twitter@512px 1.png",
  },
  {
    id: "689a6ee2022f2a1bba30bc2d",
    name: "LinkedIn",
    src: "/icons/linkedin@3x 1.png",
  },
  {
    id: "689a6ee2022f2a1bba30bc30",

    name: "Tiktok",
    src: "/icons/tik_tok@512px 1.png",
  },
  {
    id: "689a6ee2022f2a1bba30bc33",

    name: "Google Voice",
    src: "/icons/google-voice8556 1.png",
  },
  {
    id: "689a6ee2022f2a1bba30bc36",

    name: "Pia VPN",
    src: "/icons/images 1.png",
  },
  {
    id: "689a6ee2022f2a1bba30bc39",
    name: "Express Vpn",
    src: "/icons/download 1.png",
  },
  {
    id: "689a6ee2022f2a1bba30bc3c",
    name: "Netflix Logs",
    src: "/icons/netflix-mobile-application-logo-free-png 1.png",
  },
];

const categories2 = [
  {
    id: "689a6f27a0f7bfb9f65b268f",
    name: "Facebook",
    src: "/icons/facebook@3x 1.png",
  },
  {
    id: "689a6f28a0f7bfb9f65b2692",
    name: "Instagram",
    src: "/icons/instagram@512px 1.png",
  },
  {
    id: "689a6f28a0f7bfb9f65b2695",
    name: "Twitter",
    src: "/icons/twitter@512px 1.png",
  },
  {
    id: "689a6f29a0f7bfb9f65b2698",
    name: "LinkedIn",
    src: "/icons/linkedin@3x 1.png",
  },
  {
    id: "689a6f29a0f7bfb9f65b269b",

    name: "Tiktok",
    src: "/icons/tik_tok@512px 1.png",
  },
  {
    id: "689a6f2aa0f7bfb9f65b269e",

    name: "Google Voice",
    src: "/icons/google-voice8556 1.png",
  },
  {
    id: "689a6f2aa0f7bfb9f65b26a1",

    name: "Pia VPN",
    src: "/icons/images 1.png",
  },
  {
    id: "689a6f2aa0f7bfb9f65b26a4",
    name: "Express Vpn",
    src: "/icons/download 1.png",
  },
  {
    id: "689a6f2ba0f7bfb9f65b26a7",
    name: "Netflix Logs",
    src: "/icons/netflix-mobile-application-logo-free-png 1.png",
  },
];

export default function Home() {
  const categories =
    process.env.NODE_ENV === "development" ? categories1 : categories2;
  return (
    <main className="flex-1 flex flex-col items-center px-2 py-6">
      <div className="w-full max-w-2xl rounded-xl overflow-hidden bg-background-2 shadow-md mb-8">
        <div className="flex items-center gap-2 px-4 py-2 mb-1">
          <LibraryBig className="size-6" />
          <span className="text-lg font-semibold text-foreground">
            Select Category
          </span>
        </div>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.id}`}
            className="flex items-center justify-between gap-2 bg-foreground text-background transition p-3 border border-neutral-200 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Image
                width={100}
                height={100}
                src={c.src}
                alt={c.name}
                className="size-8 border border-neutral-400 rounded-full"
              />
              <span>{c.name}</span>
            </div>
            <ChevronRightIcon className="size-5 text-background" />
          </Link>
        ))}
      </div>
    </main>
  );
}
