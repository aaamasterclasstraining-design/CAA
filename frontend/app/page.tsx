const medications = [
  { name: 'Piperacillin/Tazobactam', dose: '4.5 g IV q8h', timing: '08:00 • 16:00 • 00:00' },
  { name: 'Enoxaparin', dose: '40 mg SC daily', timing: '21:00' },
  { name: 'Acetaminophen', dose: '650 mg PO q6h PRN', timing: 'PRN pain > 4/10' },
];

const timeline = [
  { time: '07:15', event: 'Vitals stable after morning review.' },
  { time: '09:40', event: 'Wound dressing changed; minimal drainage.' },
  { time: '12:10', event: 'Physical therapy session completed.' },
  { time: '14:25', event: 'Care plan reviewed with family.' },
];

export default function Page() {
  return (
    <div className="max-w-5xl space-y-6">
      <header className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Patient Treatment Card</p>
            <h1 className="mt-2 text-2xl font-bold text-neutral-900">Amelia Rivera</h1>
            <p className="mt-1 text-sm text-neutral-600">MRN 229104 • 64 years • Room 412-B</p>
          </div>
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-right">
            <p className="text-xs font-medium text-emerald-700">Current Status</p>
            <p className="text-sm font-semibold text-emerald-800">Improving / Stable</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Metric label="Heart Rate" value="78 bpm" />
          <Metric label="Blood Pressure" value="122/78" />
          <Metric label="SpO₂" value="97%" />
          <Metric label="Temp" value="37.1°C" />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Diagnosis & Plan</h2>
            <p className="mt-2 text-sm text-neutral-700">
              Post-operative recovery after laparoscopic colectomy complicated by mild infection risk. Continue IV antibiotics,
              pulmonary exercises, and progressive ambulation with close pain management.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Active Medications</h3>
            <ul className="mt-3 space-y-3">
              {medications.map((medication) => (
                <li key={medication.name} className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-sm font-medium text-neutral-900">{medication.name}</p>
                  <p className="text-sm text-neutral-700">{medication.dose}</p>
                  <p className="text-xs text-neutral-500">{medication.timing}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Care Checklist</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <ChecklistItem label="Antibiotic dose verified" complete />
              <ChecklistItem label="Wound inspection" complete />
              <ChecklistItem label="Incentive spirometry x10" complete />
              <ChecklistItem label="Evening glucose check" />
              <ChecklistItem label="Discharge education draft" />
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Today’s Timeline</h3>
            <ul className="mt-3 space-y-2">
              {timeline.map((item) => (
                <li key={item.time} className="rounded-lg bg-neutral-50 px-3 py-2">
                  <p className="text-xs font-semibold text-neutral-500">{item.time}</p>
                  <p className="text-sm text-neutral-700">{item.event}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function ChecklistItem({ label, complete = false }: { label: string; complete?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
          complete
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-neutral-300 bg-white text-neutral-400'
        }`}
      >
        {complete ? '✓' : '•'}
      </span>
      {label}
    </li>
  );
}
