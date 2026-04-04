import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import PrivateRoute from "../privateRoutes/PrivateRoutes";
import { Dashboard } from "../pages/Dashboard";
import Layout from "../layout/Layout";
import { Deposit } from "../pages/Deposit";
import { Cash } from "../pages/Cash";
import { BankTransfer } from "../pages/BankTransfer";
import { Withdraw } from "../pages/Withdraw";
import { WithdrawBankTransfer } from "../pages/WithdrawBankTransfer";
import { WithdrawCash } from "../pages/WithdrawCash";
import { WithdrawUSDT } from "../pages/Withdraw-USDT";
import { TransferBetweenAccount } from "../pages/TransferBetweenAccount";
import TransactionHistory from "../pages/TransactionHistory";
import { Account } from "../pages/Account";
import { OpenLiveAccount } from "../pages/OpenLiveAccount";
import { Settings } from "../pages/Settings";
import { DocumentSetting } from "../pages/DocumentSetting";
import { ChangePassword } from "../pages/ChangePassword";
import { Tools } from "../pages/Tools";
import { MT5toWallet } from "../pages/MT5toWallet";
import { WalletToMT5 } from "../pages/WalletToMT5";
import { UpdateBankAccount } from "../pages/UpdateBankAccount";
import Support from "../pages/Support";
import SupportDetails from "../pages/SupportDetails";
import ForgotPassword from "../components/Register/ForgotPassword";
import AuthPage from "../components/Register/AuthPage";
import Analytics from "../pages/AnalyticToolss";
import EconomyCalendar from "../pages/EconomyCalendar";
// parther pashboard
import PartherDashboardLayout from "../layout/ParentDashboardLayout";
import PartherDashboard from "../pages/PartherDashboard";
import ClientReport from "../pages/parthership/client/Reports";
import ClientAccounts from "../pages/parthership/client/ClientAccounts";
import ClientRewardHistory from "../pages/parthership/client/RewardHistory";
import ClientTransaction from "../pages/parthership/client/ClientTransaction";
import {
  RebateClients,
  RebateGroups,
  RebateHistory,
} from "../pages/parthership/Rebates";
import { Contact } from "../pages/parthership/Support";
import EmailVerificationOTP from "../components/Register/EmailVerificationOTP";
import Offers from "../pages/Promotions/Offers";
// import ClaimBonus from "../pages/Promotions/ClaimBonus";
import TradingHistory from "../pages/TradingHistory";
import UsdtBep from "../pages/CryptoDeposit/UsdtBep";
import UsdtEth from "../pages/CryptoDeposit/UsdtEth";
import UsdtTrc from "../pages/CryptoDeposit/UsdtTrc";
import UsdtMatic from "../pages/CryptoDeposit/UsdtMatic";
import { SidebarProvider } from "../context/SidebarContext";
import ResetPassword from "../components/Register/ResetPassword";
import PageNotFound from "../components/404/PageNotFound";
import IBCommission from "../pages/IBWidthraw";
import { SelectAccountType } from "../pages/SelectAccountType";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // This specifies the default route for "/"
        element: (
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds",
        element: (
          <PrivateRoute>
            <Layout>
              <Deposit />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/deposit",
        element: (
          <PrivateRoute>
            <Layout>
              <Deposit />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/deposit/cash",
        element: (
          <PrivateRoute>
            <Layout>
              <Cash />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/deposit/bank-transfer",
        element: (
          <PrivateRoute>
            <Layout>
              <BankTransfer />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/deposit/usdt/bep",
        element: (
          <PrivateRoute>
            <Layout>
              <UsdtBep />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/deposit/usdt/trc",
        element: (
          <PrivateRoute>
            <Layout>
              <UsdtTrc />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/deposit/usdt/eth",
        element: (
          <PrivateRoute>
            <Layout>
              <UsdtEth />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/deposit/usdt/matic",
        element: (
          <PrivateRoute>
            <Layout>
              <UsdtMatic />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/withdraw",
        element: (
          <PrivateRoute>
            <Layout>
              <Withdraw />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/withdraw/Withdraw-bank-transfer",
        element: (
          <PrivateRoute>
            <Layout>
              <WithdrawBankTransfer />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/withdraw/Withdraw-cash",
        element: (
          <PrivateRoute>
            <Layout>
              <WithdrawCash />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/withdraw/:method",
        element: (
          <PrivateRoute>
            <Layout>
              <WithdrawUSDT />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/add-bank-account",
        element: (
          <PrivateRoute>
            <Layout>
              <UpdateBankAccount />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/transfer-between-account",
        element: (
          <PrivateRoute>
            <Layout>
              <TransferBetweenAccount />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/mt5-to-wallet",
        element: (
          <PrivateRoute>
            <Layout>
              <MT5toWallet />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/funds/wallet-to-mt5",
        element: (
          <PrivateRoute>
            <Layout>
              <WalletToMT5 />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/transaction-history",
        element: (
          <PrivateRoute>
            <Layout>
              <TransactionHistory />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/Trading-History/",
        element: (
          <PrivateRoute>
            <Layout>
              <TradingHistory />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <PrivateRoute>
            <Layout>
              <Account />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/treadingtools",
        element: (
          <PrivateRoute>
            <Layout>
              <Analytics />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/offers",
        element: (
          <PrivateRoute>
            <Layout>
              <Offers />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/treadingtools/market",
        element: (
          <PrivateRoute>
            <Layout>
              <Analytics />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/treadingtools/economy",
        element: (
          <PrivateRoute>
            <Layout>
              <EconomyCalendar />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/support",
        element: (
          <PrivateRoute>
            <Layout>
              <Support />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/support/support-detail/:id",
        element: (
          <PrivateRoute>
            <Layout>
              <SupportDetails />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/account/select-account-type",
        element: (
            <PrivateRoute>
              <Layout>
                <SelectAccountType/>
              </Layout>
            </PrivateRoute>
          ),
        },
      {
        path: "/account/open-live-account",
        element: (
          <PrivateRoute>
            <Layout>
              <OpenLiveAccount />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <PrivateRoute>
            <Layout>
              <Settings />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/settings/documents",
        element: (
          <PrivateRoute>
            <Layout>
              <DocumentSetting />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/settings/password",
        element: (
          <PrivateRoute>
            <Layout>
              <ChangePassword />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "/tools",
        element: (
          <PrivateRoute>
            <Layout>
              <Tools />
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <PageNotFound />,
      }
    ],
  },
  {
    path: "/register/:partnerCode?",
    element: <AuthPage isLogin={false} />,
  },
  {
    path: "/login",
    element: <AuthPage isLogin={true} />,
  },
  {
    path: "/emailVerify",
    element: <EmailVerificationOTP />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/update-password",
    element: <ResetPassword />
  },
  {
    path: "/partner", // Main route
    element: (
      <PrivateRoute>
        <SidebarProvider>
          <PartherDashboardLayout />
        </SidebarProvider>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <PartherDashboard />,
      },
      // report section
      {
        path: "report",
        element: <ClientReport />,
      },
      {
        path: "report/client",
        element: <ClientAccounts />,
      },
      {
        path: "report/rewards",
        element: <ClientRewardHistory />,
      },
      {
        path: "report/transctions",
        element: <ClientTransaction />,
      },
      // partner rebates
      {
        path: "rebates",
        element: <RebateClients />,
      },
      {
        path: "rebates/clients",
        element: <RebateClients />,
      },
      {
        path: "rebates/groups",
        element: <RebateGroups />,
      },
      {
        path: "rebates/history",
        element: <RebateHistory />,
      },
      {
        path: "support",
        element: <Contact />,
      },
       {
        path: "ibcomission",
        element: <IBCommission />,
      },
    ],
  },
],
  {
    future: {
      v7_relativeSplatPath: true, // Enables relative paths in nested routes
      v7_fetcherPersist: true,   // Retains fetcher state during navigation
      v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
      v7_partialHydration: true, // Supports partial hydration for server-side rendering
      v7_skipActionErrorRevalidation: true, // Prevents revalidation when action errors occur
    },
  }
);

export default routes;