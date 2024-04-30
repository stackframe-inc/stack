'use client';

import Link from "next/link";
import { useDesign, UserButton } from "@stackframe/stack";
import { useTheme } from "next-themes";
import ColorMode from "./color-mode";
import Select from "./select";
import { useCurrentUI } from "./provider";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { colors } = useDesign();
  const [currentUI, setCurrentUI] = useCurrentUI();
  return (
    <>
      <div 
        className={"fixed w-full z-50 p-4 h-12 flex items-center py-4 border-b justify-between"}
        style={{
          borderColor: colors.light.neutralColor,
          backgroundColor: colors.light.backgroundColor,
        }}
      >
        <Link href="/" className="font-semibold">
          Stack Demo
        </Link>

        <div className="flex items-center justify-end gap-5">
          <Select 
            options={[
              { value: 'default', label: 'Default UI' },
              { value: 'joy', label: 'Joy UI' }
            ]}
            value={currentUI}
            onChange={(e) => setCurrentUI(e.target.value as any)}
          />
          <ColorMode />
          <UserButton colorModeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        </div>
      </div>
      <div className="min-h-12"/> {/* Placeholder for fixed header */}
    </>
  );
}