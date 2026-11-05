"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMe } from "@/entities/user";
import { authApi, clearSession, getSession, homeForRole, type Role } from "@/shared/api";

type Props = {
  side: "user" | "maker";
};

const roleBySide: Record<Props["side"], Role> = { user: "WORKER", maker: "STAFF" };

export function HeaderUser({ side }: Props) {
  const router = useRouter();
  const { data: me } = useMe();

  // Each side's screens are for one role; send anyone else to their own home.
  useEffect(() => {
    if (me && me.role !== roleBySide[side]) router.replace(homeForRole(me.role));
  }, [me, side, router]);

  async function logout() {
    const refreshToken = getSession()?.refreshToken;
    clearSession();
    // The session is gone locally either way; the server call only revokes the refresh token.
    if (refreshToken) await authApi.logout(refreshToken).catch(() => undefined);
    router.push("/login");
  }

  return (
    <>
      <span className="text-body-md whitespace-nowrap text-secondary-700">
        {me ? [me.company?.name, me.name].filter(Boolean).join(" · ") : " "}
      </span>
      <button
        type="button"
        onClick={logout}
        className="cursor-pointer rounded border border-secondary-300 px-2 py-1 text-label-md whitespace-nowrap text-secondary-700 hover:border-secondary-500 hover:text-black"
      >
        로그아웃
      </button>
    </>
  );
}
