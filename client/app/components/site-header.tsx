import { Link, NavLink, useNavigation } from "react-router";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-emerald-800 text-white" : "text-emerald-100 hover:bg-emerald-800/60 hover:text-white"
  }`;

export default function SiteHeader() {
  const navigation = useNavigation();

  return (
    <header className="relative bg-emerald-900 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/avocado-logo-transparent.png" alt="" className="h-9 w-auto" />
          <span className="text-lg font-semibold tracking-tight">Avocado Doctors Portal</span>
        </Link>
        <nav aria-label="Main" className="flex gap-1">
          <NavLink to="/" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/patients" className={navLinkClass}>
            Patients
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <img src="/doctor-avatar.svg" alt="" className="size-9 rounded-full ring-2 ring-emerald-400" />
          <div className="leading-tight">
            <p className="text-sm font-medium">Dr. John Doe</p>
            <p className="text-xs text-emerald-200">Family medicine</p>
          </div>
        </div>
      </div>
      {navigation.state !== "idle" ? (
        <div
          role="progressbar"
          aria-label="Loading"
          className="absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-lime-300"
        />
      ) : null}
    </header>
  );
}
