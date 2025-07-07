export default function GreenfleetCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center space-y-3">
      {/* simple tree icon */}
      <svg
        viewBox="0 0 24 24"
        className="w-10 h-10 mx-auto text-green-600"
        fill="currentColor"
      >
        <path d="M12 2a6 6 0 00-6 6c0 3.15 3.3 6.28 5.18 7.93a1 1 0 001.64 0C14.7 14.28 18 11.15 18 8a6 6 0 00-6-6zm0 18a8.94 8.94 0 01-6.4-2.6A1 1 0 016 16h12a1 1 0 01.8 1.64A8.94 8.94 0 0112 20z" />
      </svg>

      <h3 className="font-semibold">Greenfleet Offset (Novated)</h3>
      <p className="text-sm text-gray-600">
        Placeholder – coming soon<br/>for all novated drivers.
      </p>

      <button
        disabled
        className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
      >
        Coming&nbsp;Soon
      </button>
    </div>
  );
}
