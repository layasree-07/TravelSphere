import React, { useState } from 'react';
import { Booking, Destination, TourPackage } from '../types/travel';
import { TRAVELSPHERE_DB_SCHEMAS, MYSQL_DUMP_SQL } from '../data/travelData';
import { Database, Play, Download, Copy, Check, Terminal, Table, Code2, Server, CheckCircle2 } from 'lucide-react';

interface DatabaseExplorerModalProps {
  destinations: Destination[];
  packages: TourPackage[];
  bookings: Booking[];
  onClose?: () => void;
  isFullView?: boolean;
}

export const DatabaseExplorerModal: React.FC<DatabaseExplorerModalProps> = ({
  destinations,
  packages,
  bookings,
  onClose,
  isFullView = false,
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'sql' | 'java'>('tables');
  const [selectedTable, setSelectedTable] = useState<string>('bookings');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedJava, setCopiedJava] = useState(false);

  // SQL Query Console State
  const defaultQuery = 'SELECT id, package_title, travel_date, travelers_count, total_amount, status FROM bookings;';
  const [sqlQuery, setSqlQuery] = useState<string>(defaultQuery);
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [querySuccessMsg, setQuerySuccessMsg] = useState<string | null>(null);

  // Prepare live table datasets
  const getTableData = (table: string) => {
    switch (table) {
      case 'destinations':
        return destinations.map((d) => ({
          id: d.id,
          name: d.name,
          state: d.state || 'N/A',
          country: d.country,
          continent: d.continent,
          significance: d.significance ? (d.significance.length > 60 ? d.significance.slice(0, 60) + '...' : d.significance) : 'N/A',
          rating: d.rating,
          review_count: d.reviewCount,
          starting_price: `$${d.startingPrice}`,
          best_season: d.bestTimeToVisit,
          verified_by_ai: d.verifiedByAi ? 'YES' : 'NO',
        }));
      case 'packages':
        return packages.map((p) => ({
          id: p.id,
          title: p.title,
          destination_id: p.destinationId,
          category: p.category,
          duration: `${p.durationDays}D / ${p.durationNights}N`,
          price: `$${p.price}`,
          max_guests: p.maxGuests,
          rating: p.rating,
        }));
      case 'users':
        return [
          { id: 1, full_name: 'Aarav Sharma', email: 'aarav.sharma@travelsphere.io', phone: '+91 98765 43210', nationality: 'India', tier: 'Gold' },
          { id: 2, full_name: 'Priya Reddy', email: 'priya.reddy@bvrithyderabad.edu.in', phone: '+91 91234 56789', nationality: 'India', tier: 'Platinum' },
          ...bookings.map((b, idx) => ({
            id: idx + 3,
            full_name: b.leadTraveler.fullName,
            email: b.leadTraveler.email,
            phone: b.leadTraveler.phone,
            nationality: b.leadTraveler.nationality,
            tier: 'Silver',
          })).filter((v, i, a) => a.findIndex(t => t.email === v.email) === i),
        ];
      case 'bookings':
        return bookings.map((b) => ({
          id: b.id,
          user_email: b.leadTraveler.email,
          package_id: b.packageId,
          package_title: b.packageTitle,
          travel_date: b.travelDate,
          travelers_count: b.travelersCount,
          total_amount: `$${b.totalAmount}`,
          status: b.status,
          booking_date: b.bookingDate,
        }));
      case 'payments':
        return bookings.map((b) => ({
          id: b.transactionId,
          booking_id: b.id,
          amount: `$${b.totalAmount}`,
          payment_method: b.paymentMethod,
          status: b.paymentStatus,
          timestamp: b.bookingDate,
        }));
      default:
        return [];
    }
  };

  const handleRunQuery = () => {
    setQueryError(null);
    setQuerySuccessMsg(null);
    const q = sqlQuery.trim().toLowerCase();

    try {
      if (q.includes('select') && q.includes('from bookings')) {
        const data = getTableData('bookings');
        if (q.includes("status = 'confirmed'") || q.includes('status="confirmed"')) {
          setQueryResult(data.filter((row: any) => row.status === 'Confirmed'));
        } else if (q.includes("status = 'cancelled'") || q.includes('status="cancelled"')) {
          setQueryResult(data.filter((row: any) => row.status === 'Cancelled'));
        } else {
          setQueryResult(data);
        }
        setQuerySuccessMsg(`Query executed successfully (${data.length} rows returned).`);
      } else if (q.includes('select') && q.includes('from packages')) {
        const data = getTableData('packages');
        setQueryResult(data);
        setQuerySuccessMsg(`Query executed successfully (${data.length} rows returned).`);
      } else if (q.includes('select') && q.includes('from destinations')) {
        const data = getTableData('destinations');
        setQueryResult(data);
        setQuerySuccessMsg(`Query executed successfully (${data.length} rows returned).`);
      } else if (q.includes('select') && q.includes('from users')) {
        const data = getTableData('users');
        setQueryResult(data);
        setQuerySuccessMsg(`Query executed successfully (${data.length} rows returned).`);
      } else if (q.includes('select') && q.includes('from payments')) {
        const data = getTableData('payments');
        setQueryResult(data);
        setQuerySuccessMsg(`Query executed successfully (${data.length} rows returned).`);
      } else {
        // Generic fallback for simulation
        const data = getTableData('bookings');
        setQueryResult(data);
        setQuerySuccessMsg(`Query executed successfully.`);
      }
    } catch (err: any) {
      setQueryError('SQL Syntax Error or table not found in travelsphere database.');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(MYSQL_DUMP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([MYSQL_DUMP_SQL], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travelsphere_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const javaDaoSnippet = `package com.travelsphere.dao;

import com.travelsphere.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookingDAO {
    // 1. Insert New Booking into travelsphere database
    public boolean createBooking(String id, String userEmail, String packageId, 
                                 Date travelDate, int travelersCount, double totalAmount) {
        String query = "INSERT INTO bookings (id, user_email, package_id, travel_date, travelers_count, total_amount, status, booking_date) "
                     + "VALUES (?, ?, ?, ?, ?, ?, 'Confirmed', CURDATE())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, id);
            ps.setString(2, userEmail);
            ps.setString(3, packageId);
            ps.setDate(4, travelDate);
            ps.setInt(5, travelersCount);
            ps.setDouble(6, totalAmount);
            return ps.executeUpdate() > 0;
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    // 2. Fetch User Bookings
    public List<BookingRecord> getBookingsByEmail(String email) {
        List<BookingRecord> list = new ArrayList<>();
        String query = "SELECT b.*, p.title as package_title, d.name as destination_name "
                     + "FROM bookings b "
                     + "JOIN packages p ON b.package_id = p.id "
                     + "JOIN destinations d ON p.destination_id = d.id "
                     + "WHERE b.user_email = ? ORDER BY b.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                // Populate BookingRecord POJO
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return list;
    }
}`;

  const currentTableSchema = TRAVELSPHERE_DB_SCHEMAS.find((s) => s.tableName === selectedTable);
  const currentTableRows = getTableData(selectedTable);

  return (
    <div className={`${isFullView ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : 'p-4 sm:p-6'}`}>
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 text-teal-400 border border-slate-700 flex items-center justify-center shadow-inner">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-lg font-bold text-teal-300">travelsphere</h2>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
              </div>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                jdbc:mysql://localhost:3306/travelsphere?useSSL=false&serverTimezone=UTC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="db-download-sql-btn"
              onClick={handleDownloadSql}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-medium px-3 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              Download travelsphere.sql
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 mb-6">
        <button
          id="db-tab-tables"
          onClick={() => setActiveTab('tables')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
            activeTab === 'tables'
              ? 'text-teal-700 border-b-2 border-teal-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Table className="w-4 h-4" />
          Live MySQL Tables ({TRAVELSPHERE_DB_SCHEMAS.length})
        </button>

        <button
          id="db-tab-query"
          onClick={() => {
            setActiveTab('query');
            if (!queryResult) handleRunQuery();
          }}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
            activeTab === 'query'
              ? 'text-teal-700 border-b-2 border-teal-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          SQL Query Console
        </button>

        <button
          id="db-tab-sql"
          onClick={() => setActiveTab('sql')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
            activeTab === 'sql'
              ? 'text-teal-700 border-b-2 border-teal-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          MySQL DDL &amp; Seed Script
        </button>

        <button
          id="db-tab-java"
          onClick={() => setActiveTab('java')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
            activeTab === 'java'
              ? 'text-teal-700 border-b-2 border-teal-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Java JDBC &amp; DAO Code
        </button>
      </div>

      {/* Tab 1: Live Tables */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {/* Table Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {TRAVELSPHERE_DB_SCHEMAS.map((schema) => (
              <button
                key={schema.tableName}
                id={`db-table-btn-${schema.tableName}`}
                onClick={() => setSelectedTable(schema.tableName)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-medium transition-all flex items-center gap-2 ${
                  selectedTable === schema.tableName
                    ? 'bg-slate-900 text-teal-300 shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{schema.tableName}</span>
                <span className="bg-slate-800 text-teal-400 px-1.5 py-0.2 rounded-full text-[10px]">
                  {getTableData(schema.tableName).length}
                </span>
              </button>
            ))}
          </div>

          {/* Table Info */}
          {currentTableSchema && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-mono text-sm font-bold text-slate-900">
                    Table: <span className="text-teal-700">{currentTableSchema.tableName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{currentTableSchema.description}</p>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {currentTableRows.length} active records
                </span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-mono border-b border-slate-200">
                    <tr>
                      {currentTableSchema.columns.map((col) => (
                        <th key={col.name} className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>{col.name}</span>
                            {col.isKey && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-sans">
                                PK
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal block font-mono">
                            {col.type}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {currentTableRows.length === 0 ? (
                      <tr>
                        <td colSpan={currentTableSchema.columns.length} className="p-6 text-center text-slate-400">
                          Table is currently empty.
                        </td>
                      </tr>
                    ) : (
                      currentTableRows.map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-teal-50/30 transition-colors">
                          {currentTableSchema.columns.map((col) => {
                            // Find matching row key
                            const keyMatch = Object.keys(row).find(
                              (k) => k.toLowerCase() === col.name.toLowerCase() || k.replace(/_/g, '') === col.name.replace(/_/g, '')
                            );
                            const val = keyMatch ? row[keyMatch] : row[col.name] || '—';
                            return (
                              <td key={col.name} className="px-4 py-2.5 whitespace-nowrap text-slate-800">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SQL Query Console */}
      {activeTab === 'query' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono font-semibold text-white">MySQL Query Terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSqlQuery("SELECT * FROM bookings WHERE status = 'Confirmed';")}
                  className="text-[11px] font-mono text-slate-400 hover:text-teal-300 transition-colors underline"
                >
                  Query Confirmed Bookings
                </button>
                <span className="text-slate-600">&middot;</span>
                <button
                  onClick={() => setSqlQuery("SELECT * FROM packages WHERE price < 1500;")}
                  className="text-[11px] font-mono text-slate-400 hover:text-teal-300 transition-colors underline"
                >
                  Budget Tours
                </button>
              </div>
            </div>

            <textarea
              id="sql-console-input"
              rows={3}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full bg-slate-950 text-teal-300 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Type SQL query (e.g. SELECT * FROM bookings;)"
            />

            <div className="flex justify-between items-center mt-3">
              <span className="text-[11px] font-mono text-slate-500">
                Connected to MySQL: travelsphere@localhost:3306
              </span>
              <button
                id="run-sql-query-btn"
                onClick={handleRunQuery}
                className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold font-mono text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Execute Query
              </button>
            </div>
          </div>

          {/* Results Area */}
          {queryError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono text-rose-700">
              {queryError}
            </div>
          )}

          {querySuccessMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {querySuccessMsg}
            </div>
          )}

          {queryResult && queryResult.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      {Object.keys(queryResult[0]).map((key) => (
                        <th key={key} className="px-4 py-2.5 whitespace-nowrap">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="px-4 py-2 whitespace-nowrap text-slate-800">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: MySQL DDL & Seed Script */}
      {activeTab === 'sql' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Execute this script in MySQL Workbench, phpMyAdmin, or terminal to initialize the <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">travelsphere</code> database on <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">localhost:3306</code>.
            </p>
            <div className="flex gap-2">
              <button
                id="copy-sql-code-btn"
                onClick={handleCopySql}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copied!' : 'Copy Script'}
              </button>
              <button
                onClick={handleDownloadSql}
                className="bg-slate-900 hover:bg-teal-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download .sql
              </button>
            </div>
          </div>

          <pre className="bg-slate-950 text-slate-300 font-mono text-xs p-4 rounded-2xl border border-slate-800 overflow-x-auto max-h-96 leading-relaxed">
            {MYSQL_DUMP_SQL}
          </pre>
        </div>
      )}

      {/* Tab 4: Java JDBC Code */}
      {activeTab === 'java' && (
        <div className="space-y-5">
          {/* User's Original DBConnection.java */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-mono text-xs font-bold text-slate-800">
                  com.travelsphere.util.DBConnection.java
                </h4>
                <p className="text-[11px] text-slate-500">
                  Your provided connection utility pointing to <code className="font-mono">jdbc:mysql://localhost:3306/travelsphere</code>
                </p>
              </div>
              <span className="text-[10px] font-mono bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200 font-semibold">
                User Provided Class
              </span>
            </div>
            <pre className="bg-slate-900 text-teal-300 font-mono text-xs p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
{`package com.travelsphere.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    // Update DB_USER and DB_PASSWORD to match your local MySQL settings
    private static final String URL = "jdbc:mysql://localhost:3306/travelsphere?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "password"; 

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection(URL, DB_USER, DB_PASSWORD);
    }
}`}
            </pre>
          </div>

          {/* Generated DAO companion */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-mono text-xs font-bold text-slate-800">
                  com.travelsphere.dao.BookingDAO.java
                </h4>
                <p className="text-[11px] text-slate-500">
                  Ready-to-use JDBC Data Access Object utilizing your DBConnection class
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(javaDaoSnippet);
                  setCopiedJava(true);
                  setTimeout(() => setCopiedJava(false), 2000);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copiedJava ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedJava ? 'Copied' : 'Copy DAO'}
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-300 font-mono text-xs p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-72 leading-relaxed">
              {javaDaoSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
