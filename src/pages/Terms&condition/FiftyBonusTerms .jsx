const FiftyBonusTerms = () => {
  return (
    <div className="">
      <div className="">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">50% Deposit Bonus</h1>

        <p className="mb-4">
          By participating in the 50% Deposit Bonus promotion offered by Novotrend, you agree to comply with the following terms and conditions:
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>This promotion is available to new and existing clients.</p>
          <p>The 50% deposit bonus is available only on the first deposit made on the Novotrend platform.</p>
          <p>A minimum deposit of $1001 to $5000 is required to qualify for the bonus.</p>
          <p>Only real trading accounts are eligible.</p>
        </div>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold mb-2">2. Bonus Structure</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Eligible clients will receive 50% of their first deposit amount as bonus funds.</p>
          <p>The bonus is credited instantly upon a successful first deposit.</p>
          <p>Example: Deposit $2000 → Receive $1000 bonus → Trade with $3000 total.</p>
        </div>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold mb-2">3. Use of Bonus</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>The bonus is added to your available margin and can be used for trading purposes.</p>
          <p>The bonus cannot be withdrawn until the trading conditions are met.</p>
          <p>Bonus funds are non-transferable and apply only to the account where they were issued.</p>
        </div>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold mb-2">4. Trading Requirements</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>To withdraw the bonus, clients must trade a number of standard lots equal to half of the bonus amount.</p>
          <p>Formula: <strong>Required Lots = Bonus ÷ 2</strong></p>
          <p>Example: Bonus: $1000 → Required Trading Volume: 1000 ÷ 2 = 500 standard lots</p>
          <p>Only standard lots on forex, metals, indices, crypto, or other instruments count toward the trading volume.</p>
          <p>Clients must meet the trading requirement within 90 calendar days of receiving the bonus.</p>
        </div>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold mb-2">5. Withdrawal Conditions</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>If a client requests a withdrawal before meeting the lot requirement, the bonus will be canceled.</p>
          <p>If the trading requirement is completed but the account is in loss, the remaining balance will be divided by two for withdrawal eligibility.</p>
          <p>Example: Deposit $2000 → Bonus $1000 → Trade $3000 → Loss $1500 → Withdrawal Balance = $1500 ÷ 2 = $750</p>
          <p>If the client is in loss and withdraws funds before completing the bonus requirement, the bonus will be automatically cancelled.</p>
        </div>

        {/* Section 6 */}
        <h2 className="text-xl font-semibold mb-2">6. Bonus Expiry and Inactivity</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>If no trades are made for 30 consecutive days, the bonus may be automatically removed due to account inactivity.</p>
          <p>Bonuses not converted to real balance within 90 days may also be revoked.</p>
        </div>

        {/* Section 7 */}
        <h2 className="text-xl font-semibold mb-2">7. Abuse & Fraud Prevention</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Novotrend reserves the right to cancel the bonus in cases of:</p>
          <ul className="list-disc pl-6">
            <p>Suspicious trading activity</p>
            <p>Abuse of bonus terms</p>
            <p>Multiple account usage to claim the bonus repeatedly</p>
          </ul>
        </div>

        {/* Section 8 */}
        <h2 className="text-xl font-semibold mb-2">8. Modifications</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Novotrend reserves the right to change or cancel the bonus program at any time without prior notice.</p>
          <p>Any changes will be communicated via the official platform or email notifications.</p>
        </div>

        {/* Section 9 */}
        <h2 className="text-xl font-semibold mb-2">9. Risk Disclaimer</h2>
        <div className="list-disc pl-6 mb-6 text-gray-700">
          <p>Trading in financial markets involves significant risk. The bonus does not guarantee profits or protect against losses.</p>
          <p>Clients should only trade with money they can afford to lose.</p>
        </div>

        <p className="text-gray-800 font-medium text-center">
          By accepting the 50% Deposit Bonus, you confirm that you have read, understood, and agreed to all the terms and conditions stated above.
        </p>
      </div>
    </div>
  );
};

export default FiftyBonusTerms;
