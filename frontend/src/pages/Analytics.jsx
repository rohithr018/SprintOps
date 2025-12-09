import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import analyticsService from "../services/analytics.service";
import sprintService from "../services/sprint.service";

import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	RadarChart,
	Radar,
	PolarAngleAxis,
	PolarGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	LineChart,
	Line,
} from "recharts";

import { showError, showSuccess } from "../utils/toast";

import {
	FiBarChart2,
	FiChevronDown,
	FiPieChart,
	FiFileText,
	FiDownload,
} from "react-icons/fi";

import exportAnalyticsPdfFromElement from "../utils/exportAnalyticsPdf";

function shortLabel(value) {
	return value; //will do it later
}

// Empty chart placeholders
function EmptyPie() {
	return (
		<div className="relative w-full h-full flex items-center justify-center text-xs text-slate-400">
			<PieChart />
			<span className="absolute">No data yet</span>
		</div>
	);
}

function EmptyBar() {
	return (
		<div className="relative w-full h-full flex items-center justify-center text-xs text-slate-400">
			<BarChart data={[]}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis />
				<YAxis />
			</BarChart>
			<span className="absolute">No data yet</span>
		</div>
	);
}

function EmptyLine() {
	return (
		<div className="relative w-full h-full flex items-center justify-center text-xs text-slate-400">
			<LineChart data={[]}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis />
				<YAxis />
			</LineChart>
			<span className="absolute">No data yet</span>
		</div>
	);
}

function EmptyRadar() {
	return (
		<div className="relative w-full h-full flex items-center justify-center text-xs text-slate-400">
			<RadarChart data={[]}>
				<PolarGrid />
				<PolarAngleAxis dataKey="skill" />
			</RadarChart>
			<span className="absolute">No data yet</span>
		</div>
	);
}

// panel wrapper
function Panel({ title, icon, children }) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
			<div className="flex items-center gap-3 px-5 py-3 border-b bg-slate-50/70 backdrop-blur-sm rounded-t-xl">
				<div className="p-2 rounded-lg bg-white shadow text-slate-700">
					{icon}
				</div>
				<h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
			</div>

			<div className="px-5 py-4">{children}</div>
		</div>
	);
}

function ChartArea({ children }) {
	return (
		<div className="h-[260px] w-full flex items-center justify-center">
			{children}
		</div>
	);
}

export default function Analytics() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const sprintQuery = searchParams.get("sprint") || "";
	const firstRun = useRef(true);

	const [view, setView] = useState(sprintQuery ? "sprint" : "global");
	const [sprints, setSprints] = useState([]);
	const [selectedSprint, setSelectedSprint] = useState(sprintQuery || "");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [exporting, setExporting] = useState(false);

	const chartsRef = useRef(null);

	const COLORS = [
		"#3b82f6",
		"#22c55e",
		"#ef4444",
		"#f59e0b",
		"#8b5cf6",
		"#06b6d4",
		"#a78bfa",
	];

	const normalize = (res) => res?.data?.data || res?.data || res || null;

	// Load Sprints
	const loadSprints = async () => {
		try {
			const res = await sprintService.getSprints();
			const list = normalize(res) || [];
			const arr = Array.isArray(list) ? list : [];

			arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			setSprints(arr);

			if (sprintQuery) {
				setSelectedSprint(sprintQuery);
				setView("sprint");
			}

			if (view === "sprint" && !selectedSprint && arr.length > 0) {
				setSelectedSprint(arr[0]._id);
			}
		} catch (err) {
			console.error("Failed to load sprints", err);
			showError("Failed to load sprints");
		}
	};

	// Load Analytics
	const loadAnalytics = async () => {
		setLoading(true);
		try {
			let res;

			if (view === "global") {
				res = await analyticsService.getGlobalAnalytics();
			} else if (view === "sprint" && selectedSprint) {
				res = await analyticsService.getSprintAnalytics(selectedSprint);
			}

			const normalized = normalize(res);
			setData(normalized);

			if (firstRun.current) {
				firstRun.current = false;
				if (normalized) {
					showSuccess(
						view === "global"
							? "Loaded global analytics"
							: "Loaded sprint analytics"
					);
				}
			}
		} catch (err) {
			console.error("Failed to load analytics", err);
			setData(null);
			showError("Failed to load analytics");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadSprints();
	}, []);

	useEffect(() => {
		if (!firstRun.current) loadAnalytics();
	}, [view, selectedSprint]);

	useEffect(() => {
		if (firstRun.current) loadAnalytics();
	}, [sprints.length]);

	useEffect(() => {
		const params = new URLSearchParams();
		if (view === "sprint" && selectedSprint)
			params.set("sprint", selectedSprint);
		navigate({ search: params.toString() }, { replace: true });
	}, [view, selectedSprint, navigate]);

	// Sprint Cumulative data
	const sprintCumulative = useMemo(() => {
		if (!data || view !== "sprint") return null;

		const series = Array.isArray(data.storyPointsOverTime)
			? data.storyPointsOverTime
			: [];

		if (!series.length) return null;

		return series.map((value, index) => ({
			taskIndex: index + 1, // x-axis: 1,2,3,...
			cumulativePoints: value || 0, // y-axis
		}));
	}, [data, view]);

	// export handler
	const handleExport = async () => {
		if (!data || !chartsRef.current) return;

		setExporting(true);
		try {
			const sprint =
				view === "sprint"
					? sprints.find((s) => s._id === selectedSprint) || null
					: null;

			await exportAnalyticsPdfFromElement({
				element: chartsRef.current,
				view,
				sprint,
			});

			showSuccess("Analytics exported as PDF");
		} catch (err) {
			console.error(err);
			showError("Failed to export analytics");
		} finally {
			setExporting(false);
		}
	};

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-white via-white to-slate-100 
		px-4 md:px-6 lg:px-10 py-12 space-y-10"
		>
			{/* HEADER */}
			<div
				className="
			flex flex-col md:flex-row items-start md:items-center justify-between gap-6 
			backdrop-blur-xl bg-white/50 border border-white/60 shadow-xl 
			rounded-2xl p-6
		"
			>
				<div className="flex items-start gap-4">
					<div
						className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 
					text-white shadow-md"
					>
						<FiBarChart2 size={22} />
					</div>

					<div>
						<h2 className="text-2xl font-bold text-slate-900">
							Analytics Dashboard
						</h2>

						<p className="text-sm text-slate-600 mt-1">
							Global overview or sprint-level insights — exportable for reviews.
						</p>
					</div>
				</div>

				{/* CONTROLS */}
				<div className="flex flex-wrap items-center gap-3 justify-end">
					{/* Sprint Selector */}
					{view === "sprint" && (
						<div className="relative">
							<select
								value={selectedSprint}
								onChange={(e) => setSelectedSprint(e.target.value)}
								className="
								appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-slate-300 
								bg-white/70 shadow-sm text-sm text-slate-700 hover:border-slate-400 
								transition min-w-[170px] backdrop-blur-xl
							"
							>
								<option value="">Choose sprint</option>
								{sprints.map((s) => (
									<option key={s._id} value={s._id}>
										{s.name}
									</option>
								))}
							</select>

							<div
								className="
							pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 
							text-slate-400
						"
							>
								<FiChevronDown className="w-4 h-4" />
							</div>
						</div>
					)}

					{/* Global / Sprint Toggle */}
					<div
						className="
					inline-flex items-center bg-slate-100 rounded-full p-1 shadow-inner
				"
					>
						<button
							onClick={() => {
								setView("global");
								setSelectedSprint("");
							}}
							className={`
							px-5 py-2 rounded-full text-sm transition 
							${
								view === "global"
									? "bg-white shadow text-slate-900"
									: "text-slate-600 hover:text-slate-800"
							}
						`}
						>
							Global
						</button>

						<button
							onClick={() => {
								setView("sprint");
								if (!selectedSprint && sprints.length > 0)
									setSelectedSprint(sprints[0]._id);
							}}
							className={`
							px-5 py-2 rounded-full text-sm transition 
							${
								view === "sprint"
									? "bg-white shadow text-slate-900"
									: "text-slate-600 hover:text-slate-800"
							}
						`}
						>
							Sprint
						</button>
					</div>

					{/* Export Button */}
					<button
						type="button"
						onClick={handleExport}
						disabled={!data || exporting}
						className="
						inline-flex items-center gap-2 px-4 py-2 rounded-full 
						bg-slate-900 text-white shadow-md hover:bg-slate-800 
						text-sm transition disabled:opacity-50
					"
					>
						<FiDownload className="w-4 h-4" />
						{exporting ? "Exporting…" : "Export PDF"}
					</button>
				</div>
			</div>

			{/* LOADING STATE */}
			{loading && (
				<div className="flex justify-center py-14 text-slate-500 text-sm">
					Loading analytics…
				</div>
			)}

			{/* Charts */}
			{!loading && data && (
				<div
					ref={chartsRef}
					data-export-root="true"
					className="grid grid-cols-1 lg:grid-cols-2 gap-8"
				>
					{/* 1. TASK STATUS */}
					<Panel title="Task Status" icon={<FiFileText />}>
						<ChartArea>
							<ResponsiveContainer>
								{(data.taskStatusBreakdown || []).length > 0 ? (
									<PieChart>
										<Pie
											data={data.taskStatusBreakdown}
											dataKey="value"
											nameKey="_id"
											outerRadius={70}
											label={({ name }) => shortLabel(name)}
										>
											{data.taskStatusBreakdown.map((_, i) => (
												<Cell key={i} fill={COLORS[i % COLORS.length]} />
											))}
										</Pie>
										<Tooltip
											formatter={(v, n, p) => [
												v,
												shortLabel(p?.payload?._id ?? n),
											]}
										/>
									</PieChart>
								) : (
									<EmptyPie />
								)}
							</ResponsiveContainer>
						</ChartArea>
					</Panel>

					{/* PR STATUS */}
					<Panel title="PR Status" icon={<FiPieChart />}>
						<ChartArea>
							<ResponsiveContainer>
								{(data.prStatusBreakdown || []).length > 0 ? (
									<PieChart>
										<Pie
											data={data.prStatusBreakdown}
											dataKey="value"
											nameKey="_id"
											outerRadius={70}
											label={({ name }) => shortLabel(name)}
										>
											{data.prStatusBreakdown.map((_, i) => (
												<Cell key={i} fill={COLORS[i % COLORS.length]} />
											))}
										</Pie>
										<Tooltip
											formatter={(v, n, p) => [
												v,
												shortLabel(p?.payload?._id ?? n),
											]}
										/>
									</PieChart>
								) : (
									<EmptyPie />
								)}
							</ResponsiveContainer>
						</ChartArea>
					</Panel>

					{/* STORY POINTS */}
					{view === "global" ? (
						<Panel
							title="Average Story Points per Sprint"
							icon={<FiFileText />}
						>
							<ChartArea>
								<ResponsiveContainer>
									{(data.storyPointsOverTime || []).length > 0 ? (
										<BarChart data={data.storyPointsOverTime}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="sprintName" />
											<YAxis allowDecimals={false} />
											<Tooltip />
											<Bar dataKey="avgPoints" fill="#3b82f6" />
										</BarChart>
									) : (
										<EmptyBar />
									)}
								</ResponsiveContainer>
							</ChartArea>
						</Panel>
					) : (
						<Panel title="Cumulative Story Points" icon={<FiFileText />}>
							<ChartArea>
								<ResponsiveContainer>
									{sprintCumulative?.length > 0 ? (
										<LineChart data={sprintCumulative}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis
												dataKey="taskIndex"
												label={{
													value: "Task #",
													position: "insideBottom",
													offset: -4,
													fontSize: 11,
												}}
											/>
											<YAxis
												allowDecimals={false}
												label={{
													angle: -90,
													position: "insideLeft",
													offset: 10,
													fontSize: 11,
												}}
											/>
											<Tooltip
												labelFormatter={(v) => `Task ${v}`}
												formatter={(value) => [`${value}`, "Story Points"]}
											/>
											<Line
												type="monotone"
												dataKey="cumulativePoints"
												stroke="#3b82f6"
												dot={false}
												strokeWidth={2}
											/>
										</LineChart>
									) : (
										<EmptyLine />
									)}
								</ResponsiveContainer>
							</ChartArea>
						</Panel>
					)}

					{/* FEEDBACK BY SOURCE */}
					<Panel title="Feedback by Source" icon={<FiFileText />}>
						<ChartArea>
							<ResponsiveContainer>
								{(data.feedbackBySource || []).length > 0 ? (
									<BarChart data={data.feedbackBySource}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="_id" tickFormatter={shortLabel} />
										<YAxis allowDecimals={false} />
										<Tooltip />
										<Bar dataKey="count" fill="#f59e0b" />
									</BarChart>
								) : (
									<EmptyBar />
								)}
							</ResponsiveContainer>
						</ChartArea>
					</Panel>

					{/*FEEDBACK TYPES */}
					<Panel title="Feedback Types" icon={<FiFileText />}>
						<ChartArea>
							<ResponsiveContainer>
								{(data.feedbackTypeBreakdown || []).length > 0 ? (
									<PieChart>
										<Pie
											data={data.feedbackTypeBreakdown}
											dataKey="value"
											nameKey="_id"
											outerRadius={70}
											label={({ name }) => shortLabel(name)}
										>
											{data.feedbackTypeBreakdown.map((_, i) => (
												<Cell key={i} fill={COLORS[i % COLORS.length]} />
											))}
										</Pie>
										<Tooltip
											formatter={(v, n, p) => [
												v,
												shortLabel(p?.payload?._id ?? n),
											]}
										/>
									</PieChart>
								) : (
									<EmptyPie />
								)}
							</ResponsiveContainer>
						</ChartArea>
					</Panel>

					{/* SKILLS RADAR */}
					<Panel title="Skills Profile" icon={<FiFileText />}>
						<ChartArea>
							<ResponsiveContainer>
								{(data.skillsRadar || []).length > 0 ? (
									<RadarChart data={data.skillsRadar}>
										<PolarGrid />
										<PolarAngleAxis
											dataKey="skill"
											tickFormatter={shortLabel}
										/>
										<Radar
											dataKey="value"
											stroke="#3b82f6"
											fill="#3b82f6"
											fillOpacity={0.4}
										/>
										<Tooltip />
									</RadarChart>
								) : (
									<EmptyRadar />
								)}
							</ResponsiveContainer>
						</ChartArea>
					</Panel>
				</div>
			)}

			{!loading && !data && (
				<div className=" max-w-lg mx-auto text-center backdrop-blur-xl bg-white/50 border border-white/60 rounded-2xl shadow-lg p-8 text-sm text-slate-600">
					No analytics yet. As you log tasks, PRs, and feedback, insights will
					appear here.
				</div>
			)}
		</div>
	);
}
