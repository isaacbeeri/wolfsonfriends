import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  X, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Check
} from 'lucide-react';

/**
 * Universal cleaner to extract numeric value from strings like "342,972.92 ₪" or "188,857$"
 */
export function parseNumeric(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Universal date parser supporting YYYY-MM-DD, DD/MM/YYYY, DD.MM.YYYY and timestamps
 */
export function parseDateValue(val) {
  if (!val) return 0;
  if (val instanceof Date) return val.getTime();
  const str = String(val).trim();

  // DD.MM.YYYY or DD.MM.YYYY HH:mm
  const dotParts = str.split(' ')[0].split('.');
  if (dotParts.length === 3) {
    const d = parseInt(dotParts[0], 10);
    const m = parseInt(dotParts[1], 10) - 1;
    const y = parseInt(dotParts[2], 10);
    return new Date(y, m, d).getTime() || 0;
  }

  // DD/MM/YYYY
  const slashParts = str.split(' ')[0].split('/');
  if (slashParts.length === 3) {
    const d = parseInt(slashParts[0], 10);
    const m = parseInt(slashParts[1], 10) - 1;
    const y = parseInt(slashParts[2], 10);
    return new Date(y, m, d).getTime() || 0;
  }

  const ts = Date.parse(str);
  return isNaN(ts) ? 0 : ts;
}

/**
 * Custom React hook for complete Column Management (Sort, Filter, Reorder, Toggle Visibility)
 */
export function useTableManager({
  storageKey,
  columns: initialColumns, // array of { id, label, sortable, type: 'text'|'number'|'date'|'select', getValue, filterOptions }
  data = [],
  defaultSort = { key: null, direction: null },
  defaultFilterRow = false
}) {
  // Load saved column order & hidden state from localStorage
  const [columnOrder, setColumnOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(`fwmc_tbl_cols_${storageKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with any new columns not in saved
          const existingIds = new Set(parsed);
          const newCols = initialColumns.map(c => c.id).filter(id => !existingIds.has(id));
          return [...parsed.filter(id => initialColumns.some(c => c.id === id)), ...newCols];
        }
      }
    } catch (e) {}
    return initialColumns.map(c => c.id);
  });

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    try {
      const saved = localStorage.getItem(`fwmc_tbl_hidden_${storageKey}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {};
  });

  const [sortConfig, setSortConfig] = useState(defaultSort); // { key: string|null, direction: 'asc'|'desc'|null }
  const [columnFilters, setColumnFilters] = useState({}); // { [colId]: string }
  const [isFilterRowVisible, setIsFilterRowVisible] = useState(defaultFilterRow);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // Sync saved changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`fwmc_tbl_cols_${storageKey}`, JSON.stringify(columnOrder));
    } catch (e) {}
  }, [columnOrder, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`fwmc_tbl_hidden_${storageKey}`, JSON.stringify(hiddenColumns));
    } catch (e) {}
  }, [hiddenColumns, storageKey]);

  // Map columns by id for quick lookup
  const columnMap = useMemo(() => {
    const map = new Map();
    initialColumns.forEach(c => map.set(c.id, c));
    return map;
  }, [initialColumns]);

  // Ordered visible columns
  const visibleColumns = useMemo(() => {
    return columnOrder
      .map(id => columnMap.get(id))
      .filter(c => c && !hiddenColumns[c.id]);
  }, [columnOrder, columnMap, hiddenColumns]);

  // All ordered columns (including hidden)
  const allOrderedColumns = useMemo(() => {
    return columnOrder
      .map(id => columnMap.get(id))
      .filter(Boolean);
  }, [columnOrder, columnMap]);

  // Handle Sort Cycle: asc -> desc -> null
  const handleSort = (columnId) => {
    const col = columnMap.get(columnId);
    if (!col || col.sortable === false) return;

    setSortConfig(current => {
      if (current.key !== columnId) {
        return { key: columnId, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key: columnId, direction: 'desc' };
      }
      return { key: null, direction: null };
    });
  };

  // Handle Filter Change
  const handleFilterChange = (columnId, value) => {
    setColumnFilters(prev => {
      if (!value || value === 'ALL') {
        const next = { ...prev };
        delete next[columnId];
        return next;
      }
      return { ...prev, [columnId]: value };
    });
  };

  const clearAllFilters = () => {
    setColumnFilters({});
  };

  // Reorder columns
  const moveColumn = (columnId, direction) => {
    setColumnOrder(prev => {
      const idx = prev.indexOf(columnId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'left' ? idx + 1 : idx - 1; // In RTL, moving 'right' is moving towards index 0
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(targetIdx, 0, item);
      return next;
    });
  };

  const toggleColumnVisibility = (columnId) => {
    setHiddenColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const resetColumns = () => {
    const defaultIds = initialColumns.map(c => c.id);
    setColumnOrder(defaultIds);
    setHiddenColumns({});
    try {
      localStorage.removeItem(`fwmc_tbl_cols_${storageKey}`);
      localStorage.removeItem(`fwmc_tbl_hidden_${storageKey}`);
    } catch (e) {}
  };

  // Filter & Sort Data
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    // 1. Column-specific filtering
    let result = data.filter(item => {
      for (const [colId, filterVal] of Object.entries(columnFilters)) {
        if (!filterVal) continue;
        const col = columnMap.get(colId);
        if (!col) continue;

        const rawVal = col.getValue ? col.getValue(item) : item[colId];

        // Select exact match
        if (col.type === 'select') {
          if (String(rawVal) !== String(filterVal)) return false;
          continue;
        }

        // Numeric threshold filtering e.g. "> 1000" or "< 500" or simple text match
        if (col.type === 'number') {
          const num = parseNumeric(rawVal);
          const filterStr = String(filterVal).trim();
          if (filterStr.startsWith('>=')) {
            const threshold = parseFloat(filterStr.slice(2));
            if (!isNaN(threshold) && num < threshold) return false;
          } else if (filterStr.startsWith('<=')) {
            const threshold = parseFloat(filterStr.slice(2));
            if (!isNaN(threshold) && num > threshold) return false;
          } else if (filterStr.startsWith('>')) {
            const threshold = parseFloat(filterStr.slice(1));
            if (!isNaN(threshold) && num <= threshold) return false;
          } else if (filterStr.startsWith('<')) {
            const threshold = parseFloat(filterStr.slice(1));
            if (!isNaN(threshold) && num >= threshold) return false;
          } else {
            // standard substring check
            const target = String(rawVal || '').toLowerCase();
            const q = filterStr.toLowerCase();
            if (!target.includes(q)) return false;
          }
          continue;
        }

        // Date filtering
        if (col.type === 'date') {
          const target = String(rawVal || '').toLowerCase();
          const q = String(filterVal).trim().toLowerCase();
          if (!target.includes(q)) return false;
          continue;
        }

        // Default text filter
        const target = String(rawVal || '').toLowerCase();
        const q = String(filterVal).trim().toLowerCase();
        if (!target.includes(q)) return false;
      }
      return true;
    });

    // 2. Sorting
    if (sortConfig.key && sortConfig.direction) {
      const col = columnMap.get(sortConfig.key);
      if (col) {
        const dirMult = sortConfig.direction === 'asc' ? 1 : -1;
        result = [...result].sort((a, b) => {
          const valA = col.getValue ? col.getValue(a) : a[col.id];
          const valB = col.getValue ? col.getValue(b) : b[col.id];

          if (col.type === 'number') {
            const numA = parseNumeric(valA);
            const numB = parseNumeric(valB);
            return (numA - numB) * dirMult;
          }

          if (col.type === 'date') {
            const dateA = parseDateValue(valA);
            const dateB = parseDateValue(valB);
            return (dateA - dateB) * dirMult;
          }

          // Hebrew / string comparison
          const strA = String(valA || '');
          const strB = String(valB || '');
          return strA.localeCompare(strB, 'he', { numeric: true, sensitivity: 'base' }) * dirMult;
        });
      }
    }

    return result;
  }, [data, columnFilters, sortConfig, columnMap]);

  const activeFilterCount = Object.keys(columnFilters).length;

  return {
    // Columns
    visibleColumns,
    allOrderedColumns,
    columnOrder,
    hiddenColumns,
    moveColumn,
    toggleColumnVisibility,
    resetColumns,
    // Sort
    sortConfig,
    handleSort,
    // Filter
    columnFilters,
    handleFilterChange,
    clearAllFilters,
    activeFilterCount,
    isFilterRowVisible,
    setIsFilterRowVisible,
    // Modals
    isColumnModalOpen,
    setIsColumnModalOpen,
    // Processed data
    processedData
  };
}

/**
 * Toolbar buttons for toggling filters, opening column organizer, and clearing filters
 */
export function TableToolbarControls({
  activeFilterCount,
  isFilterRowVisible,
  onToggleFilterRow,
  onClearFilters,
  onOpenColumnModal,
  totalItems,
  filteredItems
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Toggle Filter Row Button */}
      <button
        onClick={onToggleFilterRow}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
          isFilterRowVisible || activeFilterCount > 0
            ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
        }`}
        title="הצג / הסתר שורת סינון טורים (FILTER)"
      >
        <Filter className="w-3.5 h-3.5 text-blue-400" />
        <span>סינון טורים</span>
        {activeFilterCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-blue-500 text-white font-mono text-[10px] flex items-center justify-center font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Clear Filters Button (shown only if active) */}
      {activeFilterCount > 0 && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium transition-colors"
          title="נקה את כל סינוני הטורים"
        >
          <X className="w-3.5 h-3.5 text-rose-400" />
          <span>נקה סינון</span>
        </button>
      )}

      {/* Arrange / Organize Columns Button */}
      <button
        onClick={onOpenColumnModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
        title="סידור והתאמת טורים (הזזה, הצגה/הסתרה)"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
        <span>סידור טורים</span>
      </button>
    </div>
  );
}

/**
 * Clickable Sortable Column Header
 */
export function SortableTh({
  column,
  sortConfig,
  onSort,
  className = '',
  children
}) {
  const isSorted = sortConfig.key === column.id;
  const isAsc = isSorted && sortConfig.direction === 'asc';
  const isDesc = isSorted && sortConfig.direction === 'desc';
  const isSortable = column.sortable !== false;

  return (
    <th
      className={`select-none ${className} ${
        isSortable ? 'cursor-pointer hover:bg-slate-800/80 transition-colors group' : ''
      }`}
      onClick={() => isSortable && onSort(column.id)}
      title={isSortable ? `לחץ למיון עפ״י ${column.label}` : undefined}
    >
      <div className={`flex items-center gap-1.5 ${column.align === 'center' ? 'justify-center' : column.align === 'left' ? 'justify-start' : 'justify-start'}`}>
        <span>{children || column.label}</span>
        {isSortable && (
          <span className="shrink-0 transition-opacity">
            {isAsc ? (
              <ArrowUp className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
            ) : isDesc ? (
              <ArrowDown className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

/**
 * Row with Filter inputs matching each visible column
 */
export function TableFilterRow({
  columns,
  columnFilters,
  onFilterChange
}) {
  return (
    <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px]">
      {columns.map(col => {
        if (col.filterable === false) {
          return (
            <td key={`filter-${col.id}`} className="py-1.5 px-2 text-center text-slate-600">
              —
            </td>
          );
        }

        const currentVal = columnFilters[col.id] || '';

        return (
          <td key={`filter-${col.id}`} className="py-1.5 px-2">
            <div className="relative">
              {col.type === 'select' && col.filterOptions ? (
                <select
                  value={currentVal}
                  onChange={(e) => onFilterChange(col.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-slate-200 text-[11px] focus:outline-none focus:border-blue-500"
                >
                  <option value="">הכל</option>
                  {col.filterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => onFilterChange(col.id, e.target.value)}
                    placeholder={col.filterPlaceholder || `סנן...`}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pr-2 pl-6 py-1 text-slate-200 text-[11px] placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  {currentVal ? (
                    <button
                      onClick={() => onFilterChange(col.id, '')}
                      className="absolute left-1.5 p-0.5 text-slate-400 hover:text-white"
                      title="נקה"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <Search className="w-3 h-3 text-slate-600 absolute left-2 pointer-events-none" />
                  )}
                </div>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

/**
 * Modal to Arrange (reorder) and show/hide table columns
 */
export function ColumnManagerModal({
  isOpen,
  onClose,
  allOrderedColumns,
  hiddenColumns,
  onMoveColumn,
  onToggleVisibility,
  onResetColumns,
  tableTitle = 'הטבלה'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">סידור והתאמת טורים: {tableTitle}</h3>
              <p className="text-[11px] text-slate-400">שנה את סדר הטורים או הסתר עמודות לפי העדפתך</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Column List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2">
          {allOrderedColumns.map((col, index) => {
            const isHidden = !!hiddenColumns[col.id];
            const isFirst = index === 0;
            const isLast = index === allOrderedColumns.length - 1;

            return (
              <div
                key={col.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isHidden 
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60' 
                    : 'bg-slate-800/60 border-slate-700/80 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Visibility Toggle Button */}
                  <button
                    onClick={() => onToggleVisibility(col.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isHidden 
                        ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' 
                        : 'text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                    title={isHidden ? 'הצג טור' : 'הסתר טור'}
                  >
                    {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <span className={`text-xs font-semibold ${isHidden ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {col.label}
                  </span>
                </div>

                {/* Move Controls: In RTL layout, ArrowRight moves towards the start (right), ArrowLeft moves towards end (left) */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onMoveColumn(col.id, 'right')}
                    disabled={isFirst}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-700/60 rounded-lg transition-colors"
                    title="הזז ימינה (קדימה בסדר)"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onMoveColumn(col.id, 'left')}
                    disabled={isLast}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-700/60 rounded-lg transition-colors"
                    title="הזז שמאלה (אחורה בסדר)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <button
            onClick={onResetColumns}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            title="איפוס לסדר הטורים המקורי"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>איפוס לברירת מחדל</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow transition-colors"
          >
            סיום ואישור
          </button>
        </div>
      </div>
    </div>
  );
}
