"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const AuthInitializer = () => {
  const fetchUser = useAuth((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return null;
};
