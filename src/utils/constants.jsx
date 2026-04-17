export const AUTH_API = {
  LOGIN: "login/login.php",
  REGISTER: "register/register.php",
  LOG_OUT: "login/logout.php",
  FORGOT_PASSWORD: "forgotpassword/forgotpassword.php",
  CHANGE_MT5_PASSWORD: "accounts/change_mt5_password.php",
  SEND_OTP_TWOFAC_AUTH: "send_otp_2fa.php",
  SEND_OTP_TWOFAC_UNLINK: "send_otp_2fa_unlink.php",
  RESET_PASSWORD: "forgotpassword/reset_password.php",
  GET_COUNTRY: "register/get_country.php",
  SEND_OTP_REG: "register/send_otp_reg.php",
  SEND_OTP: "otp/send_otp.php",
};

export const USER_API = {
  GET_DASHBOARD: "mainpages/get_dashboard.php",
  USER_BALANCE_DATA: "users/get_user_bal_data.php",
  GET_USER_DATA: "users/get_users.php",
  MT5_ACCOUNT_LIST: "accounts/mt5_accounts_list.php",
  REGISTER_IB: "register/register_ib.php",
  UPDATE_MT5_NICKNAME: "accounts/update_mt5_nickname.php",
  GET_ADMIN_BANK_DETAILS: "bank/get_admin_bank_details.php",
  DEPOSIT_FUNDS_ADD_WALLET_BAL_CASH:
    "deposit/deposit_funds_add_wallet_bal_cash.php",
  CHANGE_LOGINPASSWORD: "users/change_loginpassword.php",
  EKYC: "users/ekyc.php",
  GET_KYC: "users/get_ekyc.php",
  CHECK_MT5_ACC_BALANCE: "accounts/check_mt5_acc_balance.php",
  MT5_TO_WALLET: "mt5towallet/mt5_to_wallet_api.php",
  LINK_AUTH_VERIFY: "link_auth_verify.php",
  UNLINK_AUTH_VERIFY: "unlink_auth_verify.php",
  LIST_GROUP: "accounts/list_group.php",
  SEND_OTP_EMAIL: "users/send_otp_email.php",
  GET_SUPPORT_TICKET: "support_ticket/get_support_ticket.php",
  CREATE_SUPPORT_TICKET: "support_ticket/create_support_ticket.php",
  ADD_REMARK_CREATE_SUPPORT_TICKET:
    "support_ticket/add_remark_create_support_ticket.php",
  OPEN_SUPPORT_TICKET_LIST: "support_ticket/open_support_ticket_list.php",
  OPEN_SUPPORT_TICKET_DETAILS:
    "support_ticket/details_open_support_ticket_list.php",
  GET_ALL_ORDER_REPORT_HISTORY:
    "transaction_history/all_get_order_report_history.php",
  MT5_TO_MT5_TRANSFER: "transfer_between/mt5_to_mt5_tranfer_api.php",
  GET_BANK_DETAILS: "bank/get_bank.php",
  ADD_USER_BANK: "bank/user_bank_add.php",
  WALLET_TO_MT5: "wallettomt5/wallet_to_mt5_api.php",
  WITHDRAW_FUND_BY_CRYPTO: "withdraw/withdrwa_fund_withdraw_crypto_api.php",
  WITHDRAW_FUNDS_ADD_WALLET_BAL: "withdraw/withdraw_funds_add_wallet_bal.php",
  WITHDRAW_FUND_ADD_WALLET_BAL_CASH:
    "withdraw/withdraws_funds_add_wallet_bal_cash.php",
  GENERATE_WALLECT_BINANCE: "deposit/generate_wallet_binance.php",
  GENERATE_WALLECT_ETHEREUM: "deposit/generate_wallet_ethereum.php",
  GENERATE_WALLECT_POLYGON: "deposit/generate_wallet_polygon.php",
  GENERATE_WALLECT_TRON: "deposit/generate_wallet_tron.php",
  WALLET_TRANS_TRC: "wallet_trans_trc.php",
  WALLET_TRANS_BEP: "wallet_trans_bep.php",
  GET_DISCOUNT: "get_discounts.php",
  REGISTER_OTP_VERIFY: "register/register_otp_verify.php",
  ADD_DEPOSIT_BONUS: "deposit/add_deposit_bonus.php",
  GET_ACTIVE_USER_BONUS: "users/get_active_user_bonus.php",
  CANCEL_ACTIVE_BONUS: "extra/cancel_active_bonus.php",
  DEPOSIT_FUNDS_ADD_WALLET_BAL: "deposit/deposit_funds_add_wallet_bal.php",
  OPEN_LIVE_ACCOUNT_ADD: "accounts/open_live_account_add.php",
  UPDATE_USER: "users/update_user.php",
  UPDATE_ONLY_EMAIL: "update_only_email.php", // NOT USING
  UPDATE_ONLY_MOBILE_NO: "users/update_only_mobileno.php",
  GET_CLIENT_ACCOUNTS: "partner_dashboard/get_client_accounts.php",
  GET_ALL_WALLET_HISTORY: "transaction_history/get_all_wallet_history.php",
  GET_ALL_DEPOSIT_HISTORY: "transaction_history/get_all_deposit_history.php",
  GET_ALL_WITHDRAW_HISTORY: "transaction_history/get_all_withdraw_history.php",
  GET_ALL_TRANSFER_HISTORY: "transaction_history/get_all_transfer_history.php",
};

export const PARTNER_DASHBOARD = {
  GET_PARTNER_DASHBOARD: "partner_dashboard/get_partner_dashboard.php",
  GET_REPORT_CLIENTS: "partner_dashboard/get_report_clients.php",
  GET_REPORT_REWARD_HISTORY: "partner_dashboard/get_report_reward_history.php",
  GET_REBATES_CLIENT: "partner_dashboard/get_rebates_client.php",
  GET_IB_COMMISSION: "partner_dashboard/get_ib_comm.php",
  WITHDRAWS_IB_FUNDS_ADD_WALLET: "withdraw/withdraws_ib_funds_add_wallet.php",
  GET_REPORT_CLIENT_TRANSACTION:
    "partner_dashboard/get_report_client_transaction.php",
  GET_IB_ALL_COMMISSION: "partner_dashboard/get_ib_all_comm_history.php",
  GET_REBATES_HISTORY: "partner_dashboard/get_rebates_history.php",
  GET_USER_PARTNER_NOTIFICATION:
    "partner_dashboard/get_user_partner_notification.php",
};

export const USER_NOTIFICATION = {
  READ_NOTIFICATION: "users/read_user_notification.php",
  GET_NOTIFICATION: "users/get_user_notification.php",
};

// /users/get_admin_bank_details.php
