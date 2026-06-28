import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Public pages
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import HelpPage from "./pages/HelpPage";
import PricingPage from "./pages/PricingPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ChangelogPage from "./pages/ChangelogPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import AboutPage from "./pages/AboutPage";

// Protected pages
import PromptStudioPage from "./pages/PromptStudioPage";
import ProjectsPage from "./pages/ProjectsPage";
import PreviewPage from "./pages/PreviewPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ExportCenterPage from "./pages/ExportCenterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Studio — protected */}
        <Route
          index
          element={
            <ProtectedRoute>
              <PromptStudioPage />
            </ProtectedRoute>
          }
        />

        {/* Projects — protected */}
        <Route
          path="projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        {/* Preview canvas — protected */}
        <Route
          path="preview"
          element={
            <ProtectedRoute>
              <PreviewPage />
            </ProtectedRoute>
          }
        />

        {/* Profile — protected */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Settings — protected */}
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Analytics — protected */}
        <Route
          path="analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Notifications — protected */}
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Export Center — protected */}
        <Route
          path="export"
          element={
            <ProtectedRoute>
              <ExportCenterPage />
            </ProtectedRoute>
          }
        />

        {/* Explore templates — public */}
        <Route path="explore" element={<ExplorePage />} />

        {/* Help center — public */}
        <Route path="help" element={<HelpPage />} />

        {/* Landing / marketing page — public */}
        <Route path="landing" element={<LandingPage />} />

        {/* Additional Public pages */}
        <Route path="pricing" element={<PricingPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="changelog" element={<ChangelogPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="about" element={<AboutPage />} />

        {/* Auth routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

