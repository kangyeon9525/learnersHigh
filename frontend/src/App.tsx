import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { TimerPage } from './pages/TimerPage';
import { GrowthDashboardPage } from './pages/GrowthDashboardPage';
import { GrowthCalendarPage } from './pages/GrowthCalendarPage';
import { MyPage } from './pages/MyPage';
import { DailyReportPage } from './pages/DailyReportPage';
import { MonthlyReportPage } from './pages/MonthlyReportPage';
import { LibraryPage } from './pages/LibraryPage';
import { RankingPage } from './pages/RankingPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/growth" element={<GrowthDashboardPage />} />
        <Route path="/growth/calendar" element={<GrowthCalendarPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/report" element={<DailyReportPage />} />
        <Route path="/monthly-report" element={<MonthlyReportPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
