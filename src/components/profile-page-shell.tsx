import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { PageTransition } from "@/components/PageTransition";

interface ProfilePageShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ProfilePageShell({ title, description, children }: ProfilePageShellProps) {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="tab-page">
        <div className="tab-stack">
          <div className="surface-card rounded-3xl p-5">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0b1018] px-3 py-1.5 text-sm text-white/85 transition hover:border-[#9eb89f] hover:text-white"
            >
              <LuArrowLeft className="h-4 w-4" />
              Back to Profile
            </button>
            <h1 className="text-2xl font-semibold text-white/95">{title}</h1>
            {description ? <p className="mt-1 text-sm text-white/65">{description}</p> : null}
          </div>
          <div className="surface-card rounded-3xl p-5">{children}</div>
        </div>
      </div>
    </PageTransition>
  );
}
