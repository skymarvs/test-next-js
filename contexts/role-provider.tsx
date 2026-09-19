"use client";

import { UserMetadata } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

type UserMetadataProviderType = UserMetadataContextType & {
  children: React.ReactNode;
};

interface UserMetadataContextType {
  user: UserMetadata | undefined;
}

const UserMetadataProviderContext = createContext<UserMetadataContextType>({
  user: undefined,
});

export default function UserMetadataProvider({
  children,
  user,
}: UserMetadataProviderType) {
  return (
    <>
      <UserMetadataProviderContext.Provider value={{ user }}>
        {children}
      </UserMetadataProviderContext.Provider>
    </>
  );
}

export const useUserMetadata = () =>
  useContext(UserMetadataProviderContext).user;
