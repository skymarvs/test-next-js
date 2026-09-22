"use client";

import { JwtPayload, UserMetadata } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

type UserMetadataProviderType = UserMetadataContextType & {
  children: React.ReactNode;
};

interface UserMetadataContextType {
  payload: JwtPayload | undefined;
}

const UserMetadataProviderContext = createContext<UserMetadataContextType>({
  payload: undefined
});

export default function UserMetadataProvider({
  children,
  payload
}: UserMetadataProviderType) {
  return (
    <>
      <UserMetadataProviderContext.Provider value={{ payload }}>
        {children}
      </UserMetadataProviderContext.Provider>
    </>
  );
}

export const useAuthPayload = () => useContext(UserMetadataProviderContext).payload;
