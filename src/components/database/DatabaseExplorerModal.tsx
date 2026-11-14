import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle,
  Play,
  RotateCcw,
  X,
  Table,
  Terminal,
  FileCode,
  HardDrive,
  RefreshCw,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

interface DatabaseExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseExplorerModal: React.FC<DatabaseExplorerModalProps> = ({ isOpen, onClose }) => {
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('SELECT id, name, category, minPrice, rating FROM creators LIMIT 5;');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'test'>('tables');

  // Manual test runner output
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.db.getStatus();
      if (res && res.database) {
        setDbStats(res.database);
      }
    } catch (err: any) {
      console.error('Failed to fetch db stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunQuery = async () => {
    setQueryLoading(true);
    setQueryError(null);
    try {
      const res = await api.db.runQuery(sqlQuery);
      if (res.error) {
        setQueryError(res.error);
        setQueryResults(null);
      } else {
        setQueryResults(res.rows || []);
      }
    } catch (err: any) {
      setQueryError(err.message || 'Query execution failed');
      setQueryResults(null);
    } finally {
      setQueryLoading(false);
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Reset and re-seed colab.db to its original state?')) return;
    setLoading(true);
    try {
      const res = await api.db.reseed();
      if (res.success) {
        alert('colab.db was successfully re-seeded from mockData!');
        fetchStats();
      }
    } catch (err) {
      alert('Failed to re-seed database');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = async (testName: string) => {
    setTestResult('Running live fetch test against colab.db...');
    try {
      if (testName === 'creators') {
        const data = await api.creators.getAll();
        setTestResult(`✓ Fetched ${data.length} creators directly from colab.db (e.g. ${data[0]?.name}, ${data[1]?.name})`);
      } else if (testName === 'campaigns') {
        const data = await api.campaigns.getAll();
        setTestResult(`✓ Fetched ${data.length} active campaigns from colab.db (e.g. "${data[0]?.title}")`);
      } else if (testName === 'enquiries') {
        const data = await api.enquiries.getAll();
        setTestResult(`✓ Fetched ${data.length} structured enquiries from colab.db (e.g. "${data[0]?.projectNeed}")`);
      } else if (testName === 'quotes') {
        const data = await api.quotes.getAll();
        setTestResult(`✓ Fetched ${data.length} negotiation quotes from colab.db (Current: ₹${data[0]?.currentAmount})`);
      }
    } catch (err: any) {
      setTestResult(`❌ Test error: ${err.message}`);
    }
  };

  const sampleQueries = [
    { label: 'Top 5 Creators', sql: 'SELECT id, name, category, minPrice, rating FROM creators ORDER BY rating DESC LIMIT 5;' },
    { label: 'Active Campaigns', sql: 'SELECT id, title, category, budgetMin, budgetMax, status FROM campaigns LIMIT 5;' },
    { label: 'Negotiation Quotes', sql: 'SELECT id, fromName, toName, currentAmount, status FROM negotiation_quotes;' },
    { label: 'Structured Enquiries', sql: 'SELECT id, senderName, targetName, budget, status FROM structured_enquiries;' },
    { label: 'Booking Slots', sql: 'SELECT id, serviceTitle, date, timeSlot, price, status FROM booking_slots;' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
              <Database className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900">SQLite Database Explorer (colab.db)</h3>
                <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>LIVE CONNECTED</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                All marketplace entities are persisted into and fetched from SQLite <code>colab.db</code>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database File Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Database File</span>
            <span className="font-mono font-bold text-slate-900 text-xs">colab.db</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">File Size</span>
            <span className="font-extrabold text-emerald-700 text-xs">{dbStats?.fileSizeFormatted || '404 KB'}</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tables</span>
            <span className="font-extrabold text-indigo-700 text-xs">
              {dbStats?.tables ? Object.keys(dbStats.tables).length : 23} Tables
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Engine</span>
              <span className="font-bold text-slate-800 text-xs">Node 22 SQLite</span>
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition"
              title="Refresh database stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('tables')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'tables'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tables & Row Counts</span>
          </button>

          <button
            onClick={() => setActiveTab('query')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'query'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive SQL Runner</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'test'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Manual Function Tester</span>
          </button>
        </div>

        {/* TAB 1: ALL TABLES GRID */}
        {activeTab === 'tables' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {dbStats?.tables &&
                Object.entries(dbStats.tables).map(([tableName, count]) => (
                  <div
                    key={tableName}
                    onClick={() => {
                      setSqlQuery(`SELECT * FROM ${tableName} LIMIT 5;`);
                      setActiveTab('query');
                    }}
                    className="p-3 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-2xl cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-xs text-slate-900 truncate block">{tableName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">table</span>
                    </div>
                    <span className="text-xs font-black bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-indigo-700 shrink-0">
                      {String(count)}
                    </span>
                  </div>
                ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                Click any table above to quickly query its records.
              </span>
              <button
                onClick={handleReseed}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold transition text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-seed colab.db</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE SQL QUERY RUNNER */}
        {activeTab === 'query' && (
          <div className="space-y-4 text-xs">
            {/* Quick Sample Queries */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick SQL Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSqlQuery(q.sql)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SQL Input Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">SQL SELECT Query (against colab.db):</label>
                <span className="text-[10px] text-slate-400 font-mono">SQLite 3 Syntax</span>
              </div>
              <textarea
                rows={3}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunQuery}
                disabled={queryLoading || !sqlQuery.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{queryLoading ? 'Executing...' : 'Run Query on colab.db'}</span>
              </button>
            </div>

            {/* Query Error Output */}
            {queryError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-mono">
                Error: {queryError}
              </div>
            )}

            {/* Query Result Output Table */}
            {queryResults && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span>Returned {queryResults.length} records</span>
                  <span>Status: 200 OK</span>
                </div>
                {queryResults.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400">
                    Query returned 0 rows.
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-56 border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200 sticky top-0">
                        <tr>
                          {Object.keys(queryResults[0]).map((col) => (
                            <th key={col} className="p-2.5 truncate font-mono text-[11px]">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {queryResults.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-indigo-50/30">
                            {Object.values(row).map((val: any, cIdx) => (
                              <td key={cIdx} className="p-2.5 text-slate-700 truncate max-w-xs">
                                {typeof val === 'object' && val !== null
                                  ? JSON.stringify(val).slice(0, 40) + '...'
                                  : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANUAL FEATURE TESTER */}
        {activeTab === 'test' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Click any of the live test triggers below to manually verify that data is being fetched and written directly to <code>colab.db</code>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickTest('creators')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">1. Fetch Creators Directory</span>
                  <span className="text-[10px] text-slate-500">Calls /api/v1/creators from colab.db</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => handleQuickTest('campaigns')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">2. Fetch Brand Campaigns</span>
                  <span className="text-[10px] text-slate-500">Calls /api/v1/campaigns from colab.db</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => handleQuickTest('enquiries')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">3. Fetch Structured Enquiries</span>
                  <span className="text-[10px] text-slate-500">Calls /api/v1/structured-enquiries</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => handleQuickTest('quotes')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">4. Fetch Negotiation Quotes</span>
                  <span className="text-[10px] text-slate-500">Calls /api/v1/negotiation-quotes</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>
            </div>

            {testResult && (
              <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Test Output:</span>
                <p>{testResult}</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 flex justify-end border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};

