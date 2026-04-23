import React, { useState, useEffect, useMemo } from 'react';
import { io } from "socket.io-client";
import { Activity, Clock, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

const SOCKET_SERVER_URL = "http://localhost:4000";

function App() {
  const [requests, setRequests] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("dashboard_update", (data) => {
      setRequests((prev) => [data, ...prev].slice(0, 100)); // Keep last 100 requests
    });

    return () => socket.disconnect();
  }, []);

  const metrics = useMemo(() => {
    if (requests.length === 0) {
      return { avgTime: 0, total: 0, slowest: "N/A", slowestTime: 0 };
    }

    const totalTime = requests.reduce((acc, req) => acc + req.duration, 0);
    const avgTime = Math.round(totalTime / requests.length);
    const total = requests.length;
    
    let slowestReq = requests[0];
    requests.forEach(req => {
      if (req.duration > slowestReq.duration) slowestReq = req;
    });

    return {
      avgTime,
      total,
      slowest: slowestReq.route,
      slowestTime: slowestReq.duration
    };
  }, [requests]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-3 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Zap className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                SuperInspect <span className="text-sm text-slate-500 font-normal">v0.1</span>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">Real-time API performance tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700 shadow-inner">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-red-400'}`}></div>
            <span className="text-sm font-medium text-slate-300">
              {isConnected ? 'Live Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Total Requests</h3>
            </div>
            <p className="text-4xl font-bold text-slate-100">{metrics.total}</p>
          </div>
          
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Avg Response Time</h3>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-4xl font-bold text-slate-100">{metrics.avgTime}</p>
              <span className="text-slate-400 text-base font-medium">ms</span>
            </div>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
            {metrics.slowestTime > 500 && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-rose-500/10 transition-colors"></div>
            )}
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="p-2 bg-rose-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Slowest Endpoint</h3>
            </div>
            <p className="text-xl font-bold text-slate-100 truncate mb-1 relative" title={metrics.slowest}>
              {metrics.slowest}
            </p>
            <p className="text-sm text-rose-400 font-medium relative flex items-center gap-1.5">
              {metrics.slowestTime > 0 ? `${metrics.slowestTime}ms delay` : '-- delay'}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/60">
            <h2 className="font-semibold text-slate-200 text-lg">Live API Log</h2>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
               <div className="text-xs font-medium text-slate-400 px-3 py-1 bg-slate-900 rounded-full border border-slate-700">
                Tracking last 100 requests
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-widest">
                  <th className="p-4 font-semibold pl-6 rounded-tl-lg">Time</th>
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold">Route</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold pr-6 rounded-tr-lg">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500">
                       <Activity className="w-8 h-8 mx-auto mb-3 text-slate-600 animate-pulse" />
                      Waiting for API requests to arrive... Make sure the SDK is connected.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => {
                    const isSlow = req.duration > 500;
                    const isError = req.statusCode >= 400;
                    
                    return (
                      <tr key={req.id} className="hover:bg-slate-700/30 transition-colors group">
                        <td className="p-4 pl-6 text-sm text-slate-400 whitespace-nowrap">
                          {format(new Date(req.timestamp), "HH:mm:ss.SSS")}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider
                            ${req.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                              req.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              'bg-purple-500/10 text-purple-400 border border-purple-500/20'}
                          `}>
                            {req.method}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-sm text-slate-300">
                          {req.route}
                        </td>
                        <td className="p-4">
                          <div className={`flex items-center gap-1.5 text-sm font-semibold
                            ${isError ? 'text-rose-400' : 'text-emerald-400'}
                          `}>
                            {isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            {req.statusCode}
                          </div>
                        </td>
                        <td className="p-4 pr-6">
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-sm tabular-nums
                              ${isSlow ? 'text-rose-400 font-bold' : 'text-slate-300'}
                            `}>
                              {req.duration}ms
                            </span>
                            {isSlow && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <AlertTriangle className="w-3 h-3" />
                                Slow
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
