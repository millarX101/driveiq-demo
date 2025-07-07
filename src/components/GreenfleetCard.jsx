export default function GreenfleetCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center space-y-3">
      {/* simple tree icon */}
      <svg
        viewBox="0 0 24 24"
        className="w-10 h-10 mx-auto text-green-600"
        fill="currentColor"
      >
        <path d="M11 21v-3.07A6 6 0 015 12h2a4 4 0 004 4v-2a2 2 0 00-2-2H7a6 6 0 016-6V3l4 4-4 4V8a4 4 0 00-4 4h2a2 2 0 012 2v2a6 6 0 016-6h2a8 8 0 01-8 8v3z" />
      </svg>

      <h3 className="font-semibold">Greenfleet Offset (Novated)</h3>
      <p className="text-sm text-gray-600">
        Coming soon — opt-in native-forest offsets
        for every novated lease.
      </p>

      <button
        disabled
        className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed">
        Coming Soon
      </button>
    </div>
  );
}
