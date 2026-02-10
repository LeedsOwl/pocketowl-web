import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { LuBadgePlus, LuWallet, LuPlus, LuSearch, LuUser } from "react-icons/lu";
import { api } from "../../convex/_generated/api";
import AddExpense from "@/components/add-expense";
import AddFinancialData from "@/components/add-financial-data";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type IndexedSection = {
  id: string;
  path: string;
  keywords: string[];
};

const indexedSections: IndexedSection[] = [
  { id: "balance", path: "/", keywords: ["balance", "income", "expenses"] },
  { id: "spending-chart", path: "/", keywords: ["chart", "spending", "graph"] },
  {
    id: "transactions",
    path: "/",
    keywords: ["transactions", "recent transactions", "history"],
  },
  { id: "group-split", path: "/groups", keywords: ["group split", "split"] },
  {
    id: "recent-groups",
    path: "/groups",
    keywords: ["groups", "recent groups", "group list"],
  },
  {
    id: "insights-chart",
    path: "/insights",
    keywords: ["insights", "pie", "analytics", "categories"],
  },
  {
    id: "profile-view",
    path: "/profile",
    keywords: ["profile", "settings", "account"],
  },
];

function TopNav() {
  const [searchInput, setSearchInput] = useState("");
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddFinancialData, setShowAddFinancialData] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useQuery(api.users.getUserInfo, {});

  const avatarInitial = useMemo(() => {
    const firstCharacter = userInfo?.name?.trim().charAt(0);
    return firstCharacter ? firstCharacter.toUpperCase() : null;
  }, [userInfo?.name]);

  const resolveSection = (query: string) => {
    const normalized = query.trim().toLowerCase().replace(/^#/, "");
    if (!normalized) return null;

    const exact = indexedSections.find(
      (section) =>
        section.id === normalized ||
        section.keywords.some((keyword) => keyword === normalized)
    );
    if (exact) return exact;

    const partial = indexedSections.find(
      (section) =>
        section.id.includes(normalized) ||
        section.keywords.some((keyword) => keyword.includes(normalized))
    );
    if (partial) return partial;

    return {
      id: normalized.replace(/\s+/g, "-"),
      path: location.pathname,
      keywords: [],
    };
  };

  const scrollToHash = (hashId: string) => {
    const target = document.getElementById(hashId);
    if (!target) return false;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const resolvedSection = resolveSection(searchInput);
    if (!resolvedSection) return;

    const targetHash = `#${resolvedSection.id}`;
    if (
      location.pathname === resolvedSection.path &&
      location.hash === targetHash
    ) {
      scrollToHash(resolvedSection.id);
    } else {
      navigate(`${resolvedSection.path}${targetHash}`);
    }

    setSearchInput("");
  };

  useEffect(() => {
    const hashId = decodeURIComponent(location.hash.replace("#", ""));
    if (!hashId) return;

    let attempts = 0;
    const maxAttempts = 10;

    const tryScroll = () => {
      if (scrollToHash(hashId)) return;
      if (attempts >= maxAttempts) return;
      attempts += 1;
      window.setTimeout(tryScroll, 120);
    };

    tryScroll();
  }, [location.hash, location.pathname]);

  const handleOpenExpense = () => {
    setShowAddOptions(false);
    setShowAddExpense(true);
  };

  const handleOpenFinancialData = () => {
    setShowAddOptions(false);
    setShowAddFinancialData(true);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-[1.75rem] bg-transparent p-2">
          <button
            type="button"
            aria-label="Open profile"
            onClick={() => navigate("/profile")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2b352f] bg-[#6f866f] text-lg font-semibold text-white"
          >
            {avatarInitial ? avatarInitial : <LuUser className="h-5 w-5" />}
          </button>

          <form onSubmit={handleSearch} className="relative min-w-0 flex-1">
            <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/65" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search"
              className="h-14 w-full rounded-full border border-[#2b352f] bg-[#06080d] pl-12 pr-4 text-base text-white outline-none placeholder:text-white/55 focus:border-[#6f866f]"
            />
          </form>

          <button
            type="button"
            aria-label="Add expense"
            onClick={() => setShowAddOptions(true)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#2b352f] bg-[#06080d] text-white transition hover:border-[#6f866f]"
          >
            <LuPlus className="h-6 w-6" />
          </button>
        </div>
      </header>
      <div aria-hidden className="h-20" />

      <Drawer open={showAddOptions} onOpenChange={setShowAddOptions}>
        <DrawerContent className="border-[#2b352f] bg-[#0b0f16] text-white">
          <DrawerHeader>
            <DrawerTitle className="text-white">What do you want to add?</DrawerTitle>
            <DrawerDescription className="text-white/65">
              Personal items only here. Group expenses must be added inside a group page.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-3 px-4 pb-6">
            <Button
              type="button"
              onClick={handleOpenExpense}
              className="h-12 justify-start gap-2 rounded-xl bg-[#101610] text-white hover:bg-[#182118]"
            >
              <LuBadgePlus className="h-5 w-5 text-[#6f866f]" />
              Add Personal Expense
            </Button>
            <Button
              type="button"
              onClick={handleOpenFinancialData}
              className="h-12 justify-start gap-2 rounded-xl bg-[#101610] text-white hover:bg-[#182118]"
            >
              <LuWallet className="h-5 w-5 text-[#6f866f]" />
              Edit Income & Balance
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      <AddExpense open={showAddExpense} setOpen={setShowAddExpense} />
      <AddFinancialData
        open={showAddFinancialData}
        setOpen={setShowAddFinancialData}
      />
    </>
  );
}

export default TopNav;
