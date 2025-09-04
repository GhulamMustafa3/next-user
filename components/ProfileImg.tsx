"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ProfileImageProps {
    src?: string;
    size?: number;
    onProfileClick?: () => void;
    onLogout?: () => void;
}

export default function ProfileImage({
    src,
    size = 35,
    onProfileClick,
    onLogout,
}: ProfileImageProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
                <Image
                    src={
                        src ||
                        "https://tse1.mm.bing.net/th/id/OIP.PkFenohHn8RbSMjB8E4SZwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                    }
                    alt="Profile"
                    width={size}
                    height={size}
                    className="rounded-full object-cover border-2 border-blue-600"
                />

            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-lg border border-gray-200 z-50 overflow-hidden"
                    >
                        <button
                            onClick={() => {
                                setOpen(false);
                                onProfileClick?.();
                            }}
                            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                            Profile Page
                        </button>

                        <div className="border-t border-gray-200" />

                        <button
                            onClick={() => {
                                setOpen(false);
                                onLogout?.();
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
