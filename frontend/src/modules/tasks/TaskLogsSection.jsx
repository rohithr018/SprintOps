export default function TaskLogsSection({ logs = [], loading = false }) {
	if (loading)
		return <div className="py-4 text-sm text-slate-500">Loading logs…</div>;

	if (!logs.length)
		return (
			<div className="py-4 text-sm text-slate-500">
				No logs yet. Use “Add log” to track progress.
			</div>
		);

	return (
		<div className="space-y-3">
			{logs.map((l) => (
				<article
					key={l._id}
					className="rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm"
				>
					<div className="flex justify-between items-center text-[11px] text-slate-500">
						<span>{new Date(l.date || l.createdAt).toLocaleString()}</span>
						<span className="px-2 py-[2px] rounded-full bg-slate-200/70 text-slate-700">
							{l.timeSpentMinutes}m
						</span>
					</div>

					<p className="mt-1 text-slate-800 text-sm">{l.summary}</p>

					{(l.skillsUsed || []).length > 0 && (
						<p className="mt-1 text-[11px] text-slate-500">
							Skills: {l.skillsUsed.join(", ")}
						</p>
					)}
				</article>
			))}
		</div>
	);
}
