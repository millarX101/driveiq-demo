import React, { useState } from 'react';
import { X, Calculator, ExternalLink, Info } from 'lucide-react';

const LeaseCalculatorEmbed = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Lease Calculator</h3>
              <p className="text-sm text-gray-600">Calculate your novated lease savings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.mxdealeradvantage.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ExternalLink size={16} />
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading calculator...</p>
            </div>
          </div>
        )}

        {/* Calculator Iframe */}
        <div className="flex-1 relative">
          <iframe
            src="https://www.mxdealeradvantage.com.au"
            className="w-full h-full border-0 rounded-b-xl"
            onLoad={handleIframeLoad}
            title="MX Dealer Advantage Lease Calculator"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        {/* Info Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Info size={16} className="text-blue-600" />
            <span>
              This calculator provides estimates only. Final lease terms subject to approval and may vary.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseCalculatorEmbed;
