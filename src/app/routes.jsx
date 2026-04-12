// Layouts
import DashboardLayout from "@/shared/layouts/DashboardLayout";

// Guards
import AuthGuard from "@/shared/components/guards/AuthGuard";
import GuestGuard from "@/shared/components/guards/GuestGuard";

// Pages — Auth
import LoginPage from "@/features/auth/pages/LoginPage";

// Pages — Dashboard
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

// Pages — Penalties
import MyPenaltiesPage from "@/features/penalties/pages/MyPenaltiesPage";

// Pages — Tasks
import MyTasksPage from "@/features/tasks/pages/MyTasksPage";
import TaskDetailPage from "@/features/tasks/pages/TaskDetailPage";

// Pages — Attendance
import AttendancePage from "@/features/attendance/pages/AttendancePage";
import MyAttendancePage from "@/features/attendance/pages/MyAttendancePage";

// Router
import { Routes as RoutesWrapper, Route, Navigate } from "react-router-dom";

const Routes = () => {
  return (
    <RoutesWrapper>
      {/* Guest only routes */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/penalties/my" element={<MyPenaltiesPage />} />

          {/* Tasks */}
          <Route path="/tasks" element={<MyTasksPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />

          {/* Attendance */}
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/attendance/my" element={<MyAttendancePage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RoutesWrapper>
  );
};

export default Routes;
