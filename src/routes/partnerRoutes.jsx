import { lazy, Suspense } from "react";
import PrivateRoute from "../privateRoutes/PrivateRoutes";
import { SidebarProvider } from "../context/SidebarContext";

const PartherDashboardLayout = lazy(
  () => import("../layout/ParentDashboardLayout"),
);
const PartherDashboard = lazy(() => import("../pages/PartherDashboard"));
const ClientReport = lazy(() => import("../pages/parthership/client/Reports"));
const ClientAccounts = lazy(
  () => import("../pages/parthership/client/ClientAccounts"),
);
const ClientRewardHistory = lazy(
  () => import("../pages/parthership/client/RewardHistory"),
);
const ClientTransaction = lazy(
  () => import("../pages/parthership/client/ClientTransaction"),
);
const IBCommission = lazy(() => import("../pages/IBWidthraw"));
const RebateClients = lazy(() =>
  import("../pages/parthership/Rebates").then((m) => ({
    default: m.RebateClients,
  })),
);
const RebateGroups = lazy(() =>
  import("../pages/parthership/Rebates").then((m) => ({
    default: m.RebateGroups,
  })),
);
const RebateHistory = lazy(() =>
  import("../pages/parthership/Rebates").then((m) => ({
    default: m.RebateHistory,
  })),
);
const Contact = lazy(() =>
  import("../pages/parthership/Support").then((m) => ({ default: m.Contact })),
);

const partnerRoutes = {
  path: "/partner",
  element: (
    <PrivateRoute>
      <SidebarProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen text-gray-500">
              Getting the partner dashboard...
            </div>
          }
        >
          <PartherDashboardLayout />
        </Suspense>
      </SidebarProvider>
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <PartherDashboard /> },
    { path: "report", element: <ClientReport /> },
    { path: "report/client", element: <ClientAccounts /> },
    { path: "report/rewards", element: <ClientRewardHistory /> },
    { path: "report/transctions", element: <ClientTransaction /> },
    { path: "rebates", element: <RebateClients /> },
    { path: "rebates/clients", element: <RebateClients /> },
    { path: "rebates/groups", element: <RebateGroups /> },
    { path: "rebates/history", element: <RebateHistory /> },
    { path: "support", element: <Contact /> },
    { path: "ibcomission", element: <IBCommission /> },
  ],
};

export default partnerRoutes;