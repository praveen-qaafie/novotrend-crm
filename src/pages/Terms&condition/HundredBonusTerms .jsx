const HundredBonusTerms = () => {
  return (
    <>
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">100% Deposit Bonus Terms & Conditions</h1>
        <p className="mb-4">
          By participating in the 100% Deposit Bonus promotion offered by Novotrend, you agree to comply with the following terms and conditions:
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Offer available to both new and existing clients.</p>
          <p>The 100% bonus applies only to the first qualifying deposit.</p>
          <p>Minimum deposit required: $1001 up to a maximum of $5000.</p>
          <p>Only real (non-demo) trading accounts are eligible.</p>
        </div>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold mb-2">2. Bonus Credit</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Clients receive 100% of their deposit as bonus funds.</p>
          <p>The bonus is credited automatically upon successful deposit.</p>
          <p>Example: Deposit $2000 → Receive $2000 bonus → Trade with $4000 total.</p>
        </div>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold mb-2">3. Bonus Usage</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Bonus can be used as margin for trading.</p>
          <p>It cannot be withdrawn directly unless conditions are met.</p>
          <p>Bonus is non-transferable and tied to the specific account.</p>
        </div>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold mb-2">4. Trading Requirement</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>To withdraw the bonus, clients must trade standard lots equal to the bonus amount divided by 2.</p>
          <p>Formula: <strong>Required Lots = Bonus ÷ 2</strong></p>
          <p>Example: Bonus $2000 → Required Volume = 2000 ÷ 2 = 1000 standard lots</p>
          <p>Only trades on forex, metals, indices, crypto, or other approved instruments count.</p>
          <p>Requirement must be met within 90 calendar days.</p>
        </div>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold mb-2">5. Withdrawal Conditions</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Withdrawing before meeting the requirement will result in bonus cancellation.</p>
          <p>If the account is in loss after meeting the lot condition, only 50% of the remaining balance is withdrawable.</p>
          <p>Example: Deposit $2000 → Bonus $2000 → Loss $3000 → Remaining $1000 → Withdrawal = $1000 ÷ 2 = $500</p>
          <p>If funds are withdrawn early during a loss, the bonus is also cancelled.</p>
        </div>

        {/* Section 6 */}
        <h2 className="text-xl font-semibold mb-2">6. Bonus Expiry & Inactivity</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Bonuses expire after 90 days if requirements are unmet.</p>
          <p>If no trading activity occurs for 30 days, the bonus may be revoked.</p>
        </div>

        {/* Section 7 */}
        <h2 className="text-xl font-semibold mb-2">7. Fraud Prevention</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Bonus may be revoked in case of:</p>
          <div className="list-disc pl-6">
            <p>Suspicious trading patterns</p>
            <p>Exploitation of bonus loopholes</p>
            <p>Using multiple accounts to claim the bonus repeatedly</p>
          </div>
        </div>

        {/* Section 8 */}
        <h2 className="text-xl font-semibold mb-2">8. Right to Modify</h2>
        <div className="list-disc pl-6 mb-4 text-gray-700">
          <p>Novotrend may amend or terminate the bonus at any time without prior notice.</p>
          <p>All updates will be posted on the official platform or sent via email.</p>
        </div>

        {/* Section 9 */}
        <h2 className="text-xl font-semibold mb-2">9. Risk Notice</h2>
        <div className="list-disc pl-6 mb-6 text-gray-700">
          <p>Financial trading involves risks. Bonuses do not guarantee returns or protect against losses.</p>
          <p>Only trade with funds you can afford to lose.</p>
        </div>

        <p className="text-gray-800 font-medium text-center">
          By accepting the 100% Deposit Bonus, you confirm that you have read, understood, and agreed to all the terms and conditions above.
        </p>
    </>
  );
};

export default HundredBonusTerms;
