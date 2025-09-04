"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export type User = {
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
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
};

export default function UserSelector({
  currentUser,
  users,
  selectedUserId,
  setSelectedUserId,
}: Props) {
  const selectedUser =
    users.find((u) => u.id === selectedUserId) || currentUser;

  const teamUsers = (currentUser.team || [])
    .map((uid) => users.find((u) => u.id === uid))
    .filter(Boolean) as User[];

  const options = [currentUser, ...teamUsers];

  return (
    <div className="w-64">
      <label className="text-xl font-semibold text-blue-700 block mb-2">
        Select User
      </label>
      <Listbox value={selectedUserId ?? currentUser.id} onChange={setSelectedUserId}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <span className="flex items-center">
              {selectedUser?.image_url ? (
                <img
                  src={selectedUser.image_url}
                  alt={selectedUser.name}
                  className="h-6 w-6 rounded-full object-cover mr-2"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-xs">
                  {selectedUser?.name.charAt(0)}
                </div>
              )}
              <span>{selectedUser?.name}</span>
              {selectedUser?.id === currentUser.id && (
                <span className="ml-1 text-xs text-gray-500">(You)</span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              {options.map((user) => (
                <Listbox.Option
                  key={user.id}
                  value={user.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center">
                        {user.image_url ? (
                          <img
                            src={user.image_url}
                            alt={user.name}
                            className="h-6 w-6 rounded-full object-cover mr-2"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-xs">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span className={`${selected ? "font-semibold" : "font-normal"}`}>
                          {user.name}
                        </span>
                        {user.id === currentUser.id && (
                          <span className="ml-1 text-xs text-gray-500">(You)</span>
                        )}
                      </div>

                      {selected ? (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
