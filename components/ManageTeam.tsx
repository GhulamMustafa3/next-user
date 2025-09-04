"use client";

import { Plus, Trash2, Users } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Listbox } from "@headlessui/react";

type User = {
    id: string;
    name: string;
    role: string;
    email: string;
    age?: number;
    image_url?: string;
    team?: string[];
};

type Props = {
    currentUser: User;
    users: User[];
    targetUserId?: string;
    setTargetUserId?: (id: string) => void;
    newTeamMemberId: string;
    setNewTeamMemberId: (id: string) => void;
    handleAddMember: (userId: string) => void;
    handleRemoveMember: (userId: string, memberId: string) => void;
};

export default function ManageTeam({
    currentUser,
    users,
    targetUserId,
    setTargetUserId,
    newTeamMemberId,
    setNewTeamMemberId,
    handleAddMember,
    handleRemoveMember,
}: Props) {

    if (!["manager", "admin"].includes(currentUser.role)) return null;

    const managedUser =
        currentUser.role === "admin"
            ? users.find((u) => u.id === targetUserId)
            : currentUser;

    if (!managedUser) return null;

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
    };

    const listItemVariants: Variants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05, duration: 0.3 },
        }),
    };

    const availableUsers = users.filter(
        (u) => u.id !== managedUser.id && !(managedUser.team?.includes(u.id))
    );

    return (
        <motion.div
            className="bg-white p-6 rounded-2xl shadow-md"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Manage Team</h2>
            </div>

            {currentUser.role === "admin" && setTargetUserId && (
                <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Select user to manage:</p>
                    <Listbox value={targetUserId} onChange={setTargetUserId}>
                        {({ open }) => (
                            <div className="relative">
                               
                                <Listbox.Button className="w-full p-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm flex items-center gap-2">
                                    {managedUser ? (
                                        <>
                                            {managedUser.image_url ? (
                                                <img
                                                    src={managedUser.image_url}
                                                    alt={managedUser.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                                                    {managedUser.name.charAt(0)}
                                                </div>
                                            )}
                                            <span>{managedUser.name}</span>
                                        </>
                                    ) : (
                                        "Select user"
                                    )}
                                </Listbox.Button>

                                
                                {open && (
                                    <Listbox.Options className="mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {users.map((u) => (
                                            <Listbox.Option
                                                key={u.id}
                                                value={u.id}
                                                className={({ active, selected }) =>
                                                    `cursor-pointer select-none p-2 text-sm flex items-center gap-2 ${active ? "bg-blue-100 text-blue-700" : "text-gray-800"
                                                    } ${selected ? "font-medium" : "font-normal"}`
                                                }
                                            >
                                                {u.image_url ? (
                                                    <img
                                                        src={u.image_url}
                                                        alt={u.name}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                )}
                                                <span>{u.name} </span>
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                )}
                            </div>
                        )}
                    </Listbox>
                </div>
            )}


            <div className="flex items-center gap-3 mb-6">
                <Listbox value={newTeamMemberId} onChange={setNewTeamMemberId}>
                    {({ open }) => (
                        <div className="relative flex-1">
                            <Listbox.Button className="w-full p-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm flex justify-between items-center">
                                {newTeamMemberId
                                    ? users.find((u) => u.id === newTeamMemberId)?.name
                                    : "Select a user to add"}
                            </Listbox.Button>

                            <AnimatePresence>
                                {open && (
                                    <Listbox.Options
                                        static
                                        as={motion.ul}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto py-1"
                                    >
                                        {availableUsers.length > 0 ? (
                                            availableUsers.map((u, i) => (
                                                <Listbox.Option
                                                    key={u.id}
                                                    value={u.id}
                                                    className={({ active, selected }) =>
                                                        `cursor-pointer select-none px-3 py-2 text-sm flex items-center gap-2 ${active ? "bg-blue-100 text-blue-700" : "text-gray-800"
                                                        } ${selected ? "font-medium" : "font-normal"}`
                                                    }
                                                >

                                                    {u.image_url ? (
                                                        <img
                                                            src={u.image_url}
                                                            alt={u.name}
                                                            className="w-6 h-6 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                    )}

                                                    <span>{u.name} </span>
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-400 text-sm italic">
                                                No users available to add
                                            </div>
                                        )}
                                    </Listbox.Options>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </Listbox>

                <button
                    onClick={() => handleAddMember(managedUser.id)}
                    disabled={!newTeamMemberId}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">Add</span>
                </button>
            </div>


            <div>
                <p className="font-medium text-gray-700 mb-3">Current Team Members</p>
                {managedUser.team && managedUser.team.length > 0 ? (
                    <ul className="space-y-2">
                        {managedUser.team.map((uid, i) => {
                            const member = users.find((u) => u.id === uid);
                            if (!member) return null;

                            return (
                                <motion.li
                                    key={uid}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    variants={listItemVariants}
                                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border rounded-lg px-4 py-2 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        {member.image_url ? (
                                            <img
                                                src={member.image_url}
                                                alt={member.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{member.name}</p>
                                            <p className="text-xs text-gray-500">{member.role}</p>
                                        </div>
                                    </div>

                                    {member.id !== managedUser.id && member.role !== "manager" && (
                                        <button
                                            onClick={() => handleRemoveMember(managedUser.id, uid)}
                                            className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition"
                                            title="Remove member"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </motion.li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">No team members added yet.</p>
                )}
            </div>
        </motion.div>
    );
}
