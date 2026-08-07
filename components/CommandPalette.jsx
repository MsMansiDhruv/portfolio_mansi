"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Command, Search, X, ArrowRight, FileText, Folder, Tag, Home, Settings, Cpu, Layers } from "lucide-react";
import { cn } from "@/lib/cn";

const commands = [
  {
    id: "home",
    label: "Home",
    description: "Back to homepage",
    href: "/",
    icon: Home,
  },
  {
    id: "projects",
    label: "Projects",
    description: "View all projects",
    href: "/projects",
    icon: Folder,
  },
  {
    id: "blog",
    label: "Writing",
    description: "Articles on data engineering",
    href: "/blog",
    icon: FileText,
  },
  {
    id: "credentials",
    label: "About",
    description: "Experience, certifications, recognition",
    href: "/credentials",
    icon: Tag,
  },
  {
    id: "contact",
    label: "Contact",
    description: "Open the contact page",
    href: "/contact",
    icon: Home,
  },
  {
    id: "ai-lab",
    label: "AI Engineering Lab",
    description: "Architecture, SQL, pipeline, and interview modes",
    href: "/tools/ai-lab",
    icon: Cpu,
  },
  {
    id: "architecture-explorer",
    label: "Architecture Explorer (placeholder)",
    description: "Placeholder for architecture exploration",
    href: "/tools",
    icon: Layers,
  },
  {
    id: "tools",
    label: "Tools",
    description: "Community tools",
    href: "/tools",
    icon: Settings,
  },
  {
    id: "bill-generator",
    label: "Bill Generator",
    description: "Generate invoices",
    href: "/tools/bill",
    icon: FileText,
  },
  {
    id: "json-analyzer",
    label: "JSON Analyser",
    description: "Analyze JSON data",
    href: "/tools/json",
    icon: FileText,
  },
  {
    id: "qr-generator",
    label: "QR Code Generator",
    description: "Create QR codes",
    href: "/tools/qr",
    icon: FileText,
  },
  {
    id: "resume",
    label: "Resume",
    description: "Download resume",
    href: "/resume.pdf",
    icon: FileText,
    external: true,
  },
];

export default function CommandPalette({ isOpen, onOpen, onClose }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = useMemo(() => {
    if (!search) return commands;

    const query = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.id.toLowerCase().includes(query)
    );
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          setSearch("");
          setSelectedIndex(0);
          onOpen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onOpen]);

  const handleSelect = useCallback(
    (command) => {
      if (command.external) {
        window.open(command.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(command.href);
      }
      onClose();
    },
    [router, onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <Search size={20} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search pages, tools, and more..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              autoFocus
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none text-base"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          <div className="max-h-[420px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No results found for "{search}"
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 transition-colors text-left",
                        isSelected
                          ? "bg-teal-600 text-white dark:bg-teal-600"
                          : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100"
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn(
                          "flex-shrink-0",
                          isSelected ? "text-white" : "text-slate-400 dark:text-slate-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{cmd.label}</div>
                        <div className={cn("text-xs truncate", isSelected ? "text-white/70" : "text-slate-500 dark:text-slate-400")}>{cmd.description}</div>
                      </div>
                      <ArrowRight
                        size={16}
                        className={cn("flex-shrink-0 transition-opacity", isSelected ? "opacity-100" : "opacity-0")}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700">↑↓</kbd>
              <span>Navigate</span>
              <kbd className="ml-4 px-2 py-1 rounded bg-slate-200 dark:bg-slate-700">Enter</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
