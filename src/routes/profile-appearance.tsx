import { useTheme } from "@/theme-provider";
import { ProfilePageShell } from "@/components/profile-page-shell";
import { Button } from "@/components/ui/button";

function ProfileAppearance() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ProfilePageShell
      title="Appearance"
      description="Choose how PocketOwl looks for you."
    >
      <div className="space-y-3">
        <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
          <p className="text-sm text-white/75">Current theme</p>
          <p className="text-lg font-semibold text-white/95">{isDark ? "Dark" : "Light"}</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setTheme("dark")}
            className={`${isDark ? "bg-[#9eb89f] text-black" : "bg-[#101610] text-white"} hover:bg-[#8fb08f]`}
          >
            Dark
          </Button>
          <Button
            type="button"
            onClick={() => setTheme("light")}
            className={`${!isDark ? "bg-[#9eb89f] text-black" : "bg-[#101610] text-white"} hover:bg-[#8fb08f]`}
          >
            Light
          </Button>
        </div>
      </div>
    </ProfilePageShell>
  );
}

export default ProfileAppearance;
