import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ChevronLeft, Eye, Save, ToggleLeft, ToggleRight } from "lucide-react";
import api from "../services/api";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EEE", "IT", "AIDS", "AIML"];
const SECTIONS = ["A", "B", "C"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ACADEMIC_YEARS = ["2023-24", "2024-25", "2025-26", "2026-27"];
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const DAY_LABELS = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat" };
const DAY_FULL = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday" };

const DEFAULT_TIME_SLOTS = [
  "9:00 - 9:55",
  "9:55 - 10:50",
  "11:05 - 12:00",
  "12:00 - 12:55",
  "12:55 - 1:45",
  "1:45 - 2:40",
  "2:40 - 3:35",
  "3:35 - 4:30",
];

function CreateTimetable() {
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [includeSaturday, setIncludeSaturday] = useState(false);
  const [gridGenerated, setGridGenerated] = useState(false);

  const [timeSlots, setTimeSlots] = useState(DEFAULT_TIME_SLOTS);
  const [schedule, setSchedule] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState("monday"); // for mobile tab

  const activeDays = includeSaturday ? [...DAYS, "saturday"] : DAYS;

  const handleGenerateGrid = () => {
    if (!department || !semester || !section || !academicYear) {
      setError("Please fill all fields before generating the grid.");
      return;
    }
    setError("");
    const emptySchedule = {};
    [...DAYS, "saturday"].forEach((day) => {
      emptySchedule[day] = Array(timeSlots.length).fill("-");
    });
    setSchedule(emptySchedule);
    setGridGenerated(true);
  };

  const handleCellChange = (day, idx, value) => {
    setSchedule((prev) => {
      const updated = { ...prev };
      updated[day] = [...updated[day]];
      updated[day][idx] = value;
      return updated;
    });
  };

  const handleAddSlot = () => {
    setTimeSlots((prev) => [...prev, ""]);
    setSchedule((prev) => {
      const updated = {};
      Object.keys(prev).forEach((day) => { updated[day] = [...prev[day], "-"]; });
      return updated;
    });
  };

  const handleRemoveSlot = (idx) => {
    if (timeSlots.length <= 1) return;
    setTimeSlots((prev) => prev.filter((_, i) => i !== idx));
    setSchedule((prev) => {
      const updated = {};
      Object.keys(prev).forEach((day) => { updated[day] = prev[day].filter((_, i) => i !== idx); });
      return updated;
    });
  };

  const handleSlotLabelChange = (idx, value) => {
    setTimeSlots((prev) => { const u = [...prev]; u[idx] = value; return u; });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/timetables", {
        department, semester: Number(semester), section, academicYear,
        includeSaturday, timeSlots, schedule,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create timetable.");
    } finally {
      setLoading(false);
    }
  };

  // Shared cell renderer
  const renderCell = (day, idx) => {
    const value = schedule[day]?.[idx] ?? "-";
    const isEditing = editingCell?.day === day && editingCell?.idx === idx;
    const isFree = value === "-" || value === "";

    if (preview) {
      return (
        <div className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${
          isFree ? "text-slate-300" : "border border-emerald-100 bg-emerald-50 text-emerald-800"
        }`}>
          {value || "-"}
        </div>
      );
    }
    if (isEditing) {
      return (
        <input
          autoFocus
          type="text"
          value={value === "-" ? "" : value}
          onChange={(e) => handleCellChange(day, idx, e.target.value || "-")}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => { if (e.key === "Enter") setEditingCell(null); }}
          className="w-full rounded-lg border border-emerald-400 bg-emerald-50 px-2 py-2 text-center text-xs font-semibold text-emerald-900 outline-none ring-2 ring-emerald-100"
        />
      );
    }
    return (
      <button
        type="button"
        onClick={() => setEditingCell({ day, idx })}
        className={`group w-full rounded-lg border px-2 py-2 text-center text-xs font-semibold transition ${
          isFree
            ? "border-dashed border-slate-200 text-slate-300 hover:border-emerald-300 hover:text-emerald-500"
            : "border-emerald-100 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100"
        }`}
      >
        {isFree ? <span className="opacity-0 group-hover:opacity-100">+</span> : value}
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            <ChevronLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">Create Timetable</h1>
            <p className="hidden text-sm text-slate-500 sm:block">Fill the details and build your class schedule</p>
          </div>
        </div>

        {gridGenerated && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 sm:px-4"
            >
              <Eye size={15} />
              <span className="hidden sm:inline">{preview ? "Edit" : "Preview"}</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 sm:px-4"
            >
              <Save size={15} />
              <span className="hidden sm:inline">{loading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Step 1: Header form */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Step 1 — Timetable Details
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Department", value: department, set: setDepartment, options: DEPARTMENTS },
            { label: "Semester", value: semester, set: setSemester, options: SEMESTERS.map(s => ({ label: `Sem ${s}`, value: s })) },
            { label: "Section", value: section, set: setSection, options: SECTIONS.map(s => ({ label: `Section ${s}`, value: s })) },
            { label: "Academic Year", value: academicYear, set: setAcademicYear, options: ACADEMIC_YEARS },
          ].map(({ label, value, set, options }) => (
            <div key={label}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                disabled={gridGenerated}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
              >
                <option value="">Select</option>
                {options.map((o) =>
                  typeof o === "object"
                    ? <option key={o.value} value={o.value}>{o.label}</option>
                    : <option key={o} value={o}>{o}</option>
                )}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIncludeSaturday((p) => !p);
              if (gridGenerated) {
                setSchedule((prev) => ({
                  ...prev,
                  saturday: prev.saturday || Array(timeSlots.length).fill("-"),
                }));
              }
            }}
            className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-emerald-700"
          >
            {includeSaturday
              ? <ToggleRight size={22} className="text-emerald-500" />
              : <ToggleLeft size={22} className="text-slate-400" />}
            Include Saturday
          </button>

          {!gridGenerated ? (
            <button
              type="button"
              onClick={handleGenerateGrid}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Generate Grid →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setGridGenerated(false); setSchedule({}); }}
              className="text-sm text-slate-400 underline transition hover:text-slate-600"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Step 2: Grid editor */}
      {gridGenerated && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Step 2 — Fill Schedule
              {!preview && <span className="ml-2 hidden text-xs normal-case text-slate-400 sm:inline">Click any cell to edit · Type "-" for free period</span>}
            </h2>
            {!preview && <p className="mt-0.5 text-xs text-slate-400 sm:hidden">Tap any cell to edit · "-" = free period</p>}
          </div>

          {/* ── DESKTOP: horizontal table ── */}
          <div className="hidden overflow-x-auto p-4 md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-20 rounded-xl bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Day</th>
                  {timeSlots.map((slot, idx) => (
                    <th key={idx} className="min-w-[110px] px-1 py-2">
                      {preview ? (
                        <div className="rounded-lg bg-slate-50 px-2 py-2 text-center text-xs font-semibold text-slate-600">
                          {slot || `Slot ${idx + 1}`}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={slot}
                            onChange={(e) => handleSlotLabelChange(idx, e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400"
                            placeholder="Time"
                          />
                          {timeSlots.length > 1 && (
                            <button type="button" onClick={() => handleRemoveSlot(idx)} className="shrink-0 text-slate-300 transition hover:text-red-400">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                  {!preview && (
                    <th className="px-2 py-2">
                      <button type="button" onClick={handleAddSlot} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-emerald-300 text-emerald-500 transition hover:bg-emerald-50" title="Add time slot">
                        <Plus size={14} />
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeDays.map((day, dayIdx) => (
                  <tr key={day} className={dayIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-3 py-2">
                      <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${day === "saturday" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {DAY_LABELS[day]}
                      </span>
                    </td>
                    {timeSlots.map((_, idx) => (
                      <td key={idx} className="px-1 py-1.5">{renderCell(day, idx)}</td>
                    ))}
                    {!preview && <td />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE: day tabs + vertical slot list ── */}
          <div className="md:hidden">
            {/* Day tabs */}
            <div className="flex overflow-x-auto border-b border-slate-100 px-3 pt-3">
              {activeDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`shrink-0 rounded-t-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
                    activeDay === day
                      ? day === "saturday"
                        ? "border-b-2 border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-b-2 border-emerald-500 text-emerald-700"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>

            {/* Slots for active day */}
            <div className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {DAY_FULL[activeDay]}
              </p>
              <div className="space-y-2">
                {timeSlots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    {/* Time label */}
                    <div className="w-28 shrink-0">
                      {preview ? (
                        <span className="text-xs font-semibold text-slate-500">{slot || `Slot ${idx + 1}`}</span>
                      ) : (
                        <input
                          type="text"
                          value={slot}
                          onChange={(e) => handleSlotLabelChange(idx, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400"
                          placeholder={`Slot ${idx + 1}`}
                        />
                      )}
                    </div>
                    {/* Subject cell */}
                    <div className="flex-1">{renderCell(activeDay, idx)}</div>
                    {/* Remove slot */}
                    {!preview && timeSlots.length > 1 && (
                      <button type="button" onClick={() => handleRemoveSlot(idx)} className="shrink-0 text-slate-300 transition hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}

                {!preview && (
                  <button
                    type="button"
                    onClick={handleAddSlot}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 py-2.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
                  >
                    <Plus size={14} /> Add Time Slot
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-4 sm:px-6">
            <p className="text-xs text-slate-400">
              {department} · Sem {semester} · {section} · {academicYear}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 sm:px-4"
              >
                <Eye size={14} />
                <span className="hidden sm:inline">{preview ? "Back to Edit" : "Preview"}</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 sm:px-5"
              >
                <Save size={14} />
                {loading ? "Saving..." : "Save Timetable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateTimetable;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, ChevronLeft, Eye, Save, ToggleLeft, ToggleRight } from "lucide-react";
// import api from "../services/api";

// const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EEE", "IT", "AIDS", "AIML"];
// const SECTIONS = ["A", "B", "C"];
// const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const ACADEMIC_YEARS = ["2023-24", "2024-25", "2025-26", "2026-27"];
// const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
// const DAY_LABELS = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat" };

// const DEFAULT_TIME_SLOTS = [
//   "9:00 - 9:55",
//   "9:55 - 10:50",
//   "11:05 - 12:00",
//   "12:00 - 12:55",
//   "12:55 - 1:45",
//   "1:45 - 2:40",
//   "2:40 - 3:35",
//   "3:35 - 4:30",
// ];

// function CreateTimetable() {
//   const navigate = useNavigate();

//   // Step 1: header info
//   const [department, setDepartment] = useState("");
//   const [semester, setSemester] = useState("");
//   const [section, setSection] = useState("");
//   const [academicYear, setAcademicYear] = useState("");
//   const [includeSaturday, setIncludeSaturday] = useState(false);
//   const [gridGenerated, setGridGenerated] = useState(false);

//   // Step 2: grid
//   const [timeSlots, setTimeSlots] = useState(DEFAULT_TIME_SLOTS);
//   const [schedule, setSchedule] = useState({});
//   const [editingCell, setEditingCell] = useState(null); // { day, slotIdx }
//   const [preview, setPreview] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const activeDays = includeSaturday ? [...DAYS, "saturday"] : DAYS;

//   // Generate empty schedule grid
//   const handleGenerateGrid = () => {
//     if (!department || !semester || !section || !academicYear) {
//       setError("Please fill all fields before generating the grid.");
//       return;
//     }
//     setError("");
//     const emptySchedule = {};
//     [...DAYS, "saturday"].forEach((day) => {
//       emptySchedule[day] = Array(timeSlots.length).fill("-");
//     });
//     setSchedule(emptySchedule);
//     setGridGenerated(true);
//   };

//   const handleCellChange = (day, idx, value) => {
//     setSchedule((prev) => {
//       const updated = { ...prev };
//       updated[day] = [...updated[day]];
//       updated[day][idx] = value;
//       return updated;
//     });
//   };

//   const handleAddSlot = () => {
//     setTimeSlots((prev) => [...prev, ""]);
//     setSchedule((prev) => {
//       const updated = {};
//       Object.keys(prev).forEach((day) => {
//         updated[day] = [...prev[day], "-"];
//       });
//       return updated;
//     });
//   };

//   const handleRemoveSlot = (idx) => {
//     if (timeSlots.length <= 1) return;
//     setTimeSlots((prev) => prev.filter((_, i) => i !== idx));
//     setSchedule((prev) => {
//       const updated = {};
//       Object.keys(prev).forEach((day) => {
//         updated[day] = prev[day].filter((_, i) => i !== idx);
//       });
//       return updated;
//     });
//   };

//   const handleSlotLabelChange = (idx, value) => {
//     setTimeSlots((prev) => {
//       const updated = [...prev];
//       updated[idx] = value;
//       return updated;
//     });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const payload = {
//         department,
//         semester: Number(semester),
//         section,
//         academicYear,
//         includeSaturday,
//         timeSlots,
//         schedule,
//       };
//       await api.post("/timetables", payload);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create timetable.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-6xl">
//       {/* Page header */}
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() => navigate("/dashboard")}
//             className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
//           >
//             <ChevronLeft size={15} />
//             Back
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-slate-900">Create Timetable</h1>
//             <p className="text-sm text-slate-500">Fill the details and build your class schedule</p>
//           </div>
//         </div>

//         {gridGenerated && (
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={() => setPreview((p) => !p)}
//               className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
//             >
//               <Eye size={15} />
//               {preview ? "Edit" : "Preview"}
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
//             >
//               <Save size={15} />
//               {loading ? "Saving..." : "Save Timetable"}
//             </button>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Step 1: Header form */}
//       <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
//           Step 1 — Timetable Details
//         </h2>
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//           {/* Department */}
//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
//               Department
//             </label>
//             <select
//               value={department}
//               onChange={(e) => setDepartment(e.target.value)}
//               disabled={gridGenerated}
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
//             >
//               <option value="">Select</option>
//               {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
//             </select>
//           </div>

//           {/* Semester */}
//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
//               Semester
//             </label>
//             <select
//               value={semester}
//               onChange={(e) => setSemester(e.target.value)}
//               disabled={gridGenerated}
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
//             >
//               <option value="">Select</option>
//               {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
//             </select>
//           </div>

//           {/* Section */}
//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
//               Section
//             </label>
//             <select
//               value={section}
//               onChange={(e) => setSection(e.target.value)}
//               disabled={gridGenerated}
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
//             >
//               <option value="">Select</option>
//               {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//             </select>
//           </div>

//           {/* Academic Year */}
//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
//               Academic Year
//             </label>
//             <select
//               value={academicYear}
//               onChange={(e) => setAcademicYear(e.target.value)}
//               disabled={gridGenerated}
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
//             >
//               <option value="">Select</option>
//               {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
//             </select>
//           </div>
//         </div>

//         <div className="mt-4 flex items-center justify-between">
//           {/* Saturday toggle */}
//           <button
//             type="button"
//             onClick={() => {
//               setIncludeSaturday((p) => !p);
//               if (gridGenerated) {
//                 setSchedule((prev) => ({
//                   ...prev,
//                   saturday: prev.saturday || Array(timeSlots.length).fill("-"),
//                 }));
//               }
//             }}
//             className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-emerald-700"
//           >
//             {includeSaturday
//               ? <ToggleRight size={22} className="text-emerald-500" />
//               : <ToggleLeft size={22} className="text-slate-400" />}
//             Include Saturday
//           </button>

//           {!gridGenerated && (
//             <button
//               type="button"
//               onClick={handleGenerateGrid}
//               className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
//             >
//               Generate Grid →
//             </button>
//           )}

//           {gridGenerated && (
//             <button
//               type="button"
//               onClick={() => { setGridGenerated(false); setSchedule({}); }}
//               className="text-sm text-slate-400 underline transition hover:text-slate-600"
//             >
//               Reset & Edit Details
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Step 2: Grid editor */}
//       {gridGenerated && (
//         <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-100 px-6 py-4">
//             <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
//               Step 2 — Fill Schedule
//               {!preview && <span className="ml-2 text-xs normal-case text-slate-400">Click any cell to edit · Type "-" for free period</span>}
//             </h2>
//           </div>

//           <div className="overflow-x-auto p-4">
//             <table className="w-full border-collapse text-sm">
//               <thead>
//                 <tr>
//                   <th className="w-20 rounded-xl bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                     Day
//                   </th>
//                   {timeSlots.map((slot, idx) => (
//                     <th key={idx} className="min-w-[110px] px-1 py-2">
//                       {preview ? (
//                         <div className="rounded-lg bg-slate-50 px-2 py-2 text-center text-xs font-semibold text-slate-600">
//                           {slot || `Slot ${idx + 1}`}
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-1">
//                           <input
//                             type="text"
//                             value={slot}
//                             onChange={(e) => handleSlotLabelChange(idx, e.target.value)}
//                             className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400"
//                             placeholder="Time"
//                           />
//                           {timeSlots.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveSlot(idx)}
//                               className="shrink-0 text-slate-300 transition hover:text-red-400"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           )}
//                         </div>
//                       )}
//                     </th>
//                   ))}
//                   {!preview && (
//                     <th className="px-2 py-2">
//                       <button
//                         type="button"
//                         onClick={handleAddSlot}
//                         className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-emerald-300 text-emerald-500 transition hover:bg-emerald-50"
//                         title="Add time slot"
//                       >
//                         <Plus size={14} />
//                       </button>
//                     </th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {activeDays.map((day, dayIdx) => (
//                   <tr
//                     key={day}
//                     className={dayIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
//                   >
//                     <td className="px-3 py-2">
//                       <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
//                         day === "saturday"
//                           ? "bg-emerald-100 text-emerald-700"
//                           : "bg-slate-100 text-slate-600"
//                       }`}>
//                         {DAY_LABELS[day]}
//                       </span>
//                     </td>
//                     {timeSlots.map((_, idx) => {
//                       const value = schedule[day]?.[idx] ?? "-";
//                       const isEditing = editingCell?.day === day && editingCell?.idx === idx;
//                       const isFree = value === "-" || value === "";
//                       return (
//                         <td key={idx} className="px-1 py-1.5">
//                           {preview ? (
//                             <div className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${
//                               isFree
//                                 ? "text-slate-300"
//                                 : "bg-emerald-50 text-emerald-800 border border-emerald-100"
//                             }`}>
//                               {value || "-"}
//                             </div>
//                           ) : isEditing ? (
//                             <input
//                               autoFocus
//                               type="text"
//                               value={value === "-" ? "" : value}
//                               onChange={(e) => handleCellChange(day, idx, e.target.value || "-")}
//                               onBlur={() => setEditingCell(null)}
//                               onKeyDown={(e) => { if (e.key === "Enter") setEditingCell(null); }}
//                               className="w-full rounded-lg border border-emerald-400 bg-emerald-50 px-2 py-2 text-center text-xs font-semibold text-emerald-900 outline-none ring-2 ring-emerald-100"
//                             />
//                           ) : (
//                             <button
//                               type="button"
//                               onClick={() => setEditingCell({ day, idx })}
//                               className={`group w-full rounded-lg border px-2 py-2 text-center text-xs font-semibold transition ${
//                                 isFree
//                                   ? "border-dashed border-slate-200 text-slate-300 hover:border-emerald-300 hover:text-emerald-500"
//                                   : "border-emerald-100 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100"
//                               }`}
//                             >
//                               {isFree ? <span className="opacity-0 group-hover:opacity-100">+</span> : value}
//                             </button>
//                           )}
//                         </td>
//                       );
//                     })}
//                     {!preview && <td />}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Bottom action bar */}
//           <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
//             <p className="text-xs text-slate-400">
//               {department} · Sem {semester} · Section {section} · {academicYear}
//             </p>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPreview((p) => !p)}
//                 className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
//               >
//                 <Eye size={14} />
//                 {preview ? "Back to Edit" : "Preview"}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
//               >
//                 <Save size={14} />
//                 {loading ? "Saving..." : "Save Timetable"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CreateTimetable;