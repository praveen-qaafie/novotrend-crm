import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-3 text-sm text-gray-700">
      <div className="max-w-6xl w-full pr-0.5 lg:pr-8">
        <div className="md:col-span-2 text-start">
          <p className="mb-4 text-justify">
            <span className="text-md font-semibold">
              Regional restrictions:
            </span>{" "}
            Novotrend.Ltd does not provide services to residents of the United
            States, Canada, Sudan, Syria and North Korea and the European
            Economic Area. User personal data is protected. An SSL certificate
            is also installed on the site, so information is transmitted using a
            secure protocol. The activities of Novotrend.Ltd are conducted
            outside the Russian Federation. Novotrend.co is owned and operated
            by Novotrend Ltd registration number 23835 IBC 2017, Suite 305,
            Griffith Corporate Center P, O. Box 1510, Beachmont Kingstown St.
            Vincent and the grenadines
          </p>
          <p className="mb-4">
            <span>Email: </span>
            <a
              href="mailto:support@novotrend.co"
              className="text-blue-600 hover:text-blue-700 border-b border-dashed"
              target="_blank"
              rel="noopener noreferrer"
            >
              support@novotrend.co
            </a>
          </p>
          <div className="border-t-2 pt-4 flex flex-col gap-4">
            {/* Heading */}
            <h3 className="text-md font-semibold">Legal Documents</h3>
            {/* Documents Grid and Footer */}
            <div className="flex flex-row justify-between items-end gap-4">
              {/* Document Links */}
              <div>
                <ul className="flex flex-wrap gap-x-8 gap-y-2">
                  <li>
                    <Link
                      to="/pdf/PrivacyPolicy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 border-b border-dashed text-sm"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pdf/RiskDisclosure.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 border-b border-dashed text-sm"
                    >
                      Risk Disclosure
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pdf/Service Regulations.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 border-b border-dashed text-sm"
                    >
                      Service Regulations
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pdf/Client Agreement.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 border-b border-dashed text-sm"
                    >
                      Client Agreement
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Footer */}
              <div className="text-center text-gray-500 md:text-right">
                © 2025. Novotrend
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
