import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 space-y-8">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">Settings ⚙️</h2>
          <p className="text-sm text-gray-500">
            Customize your chat experience
          </p>
        </div>

        {/* THEME GRID */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Choose Theme</h3>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-2 rounded-lg border transition text-xs
                  ${theme === t
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-gray-200 hover:border-gray-400"
                  }`}
              >
                {/* COLOR PREVIEW BOX */}
                <div
                  className="h-10 w-full rounded-md overflow-hidden"
                  data-theme={t}
                >
                  <div className="grid grid-cols-4 gap-[2px] p-1 h-full">
                    <div className="bg-primary rounded"></div>
                    <div className="bg-secondary rounded"></div>
                    <div className="bg-accent rounded"></div>
                    <div className="bg-neutral rounded"></div>
                  </div>
                </div>

                {/* NAME */}
                <p className="mt-1 text-center capitalize">{t}</p>
              </button>
            ))}
          </div>
        </div>

        {/* PREVIEW */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Preview</h3>

          <div className="border rounded-lg p-4 bg-gray-50">

            <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">

              {PREVIEW_MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-xs
                      ${msg.isSent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value="This is a preview"
                  readOnly
                  className="flex-1 border rounded-md px-3 py-2 text-sm"
                />
                <button className="bg-blue-500 text-white px-4 rounded-md">
                  Send
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;