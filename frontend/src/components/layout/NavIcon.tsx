export type NavIconName = 'home' | 'timer' | 'growth' | 'mypage' | 'report' | 'library';

const PATHS: Record<NavIconName, string> = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5',
  timer: 'M12 8v5l3 2M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9 2h6',
  growth: 'M12 21V9m0 0c0-3 2-5 5-5 0 3-2 5-5 5Zm0 2c0-3-2-5-5-5 0 3 2 5 5 5Z',
  mypage: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  report: 'M5 3h14v18H5zM9 8h6M9 12h6M9 16h4',
  library: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z',
};

/** 사이드바 네비 라인 아이콘 (currentColor) */
export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      className="nav-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
