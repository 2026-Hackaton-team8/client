"use client";

import { useMe } from "@/entities/user";

export function OnboardingUser() {
  const { data: me } = useMe();
  return (
    <span className="text-body-md text-secondary-700">
      {me ? `${me.name} · ${me.email ?? me.loginId}` : " "}
    </span>
  );
}
