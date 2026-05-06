'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';

type RepeaterFieldProps<T extends Record<string, string>> = {
  label: string;
  value: T[];
  onChange: (items: T[]) => void;
  template: T;
  fields: Array<{ key: keyof T; label: string; placeholder?: string; multiline?: boolean }>;
  addLabel?: string;
};

export function RepeaterField<T extends Record<string, string>>({
  label,
  value,
  onChange,
  template,
  fields,
  addLabel = 'Add item',
}: RepeaterFieldProps<T>) {
  function add() {
    onChange([...value, { ...template }]);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function update(index: number, key: keyof T, val: string) {
    onChange(value.map((item, i) => (i === index ? { ...item, [key]: val } : item)));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
        >
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      </div>

      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
          No items yet — click &ldquo;{addLabel}&rdquo; to add one
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="group relative rounded-xl border border-gray-200 bg-white p-4">
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-3 top-3 hidden rounded-lg p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 group-hover:flex"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="grid gap-3" style={{ gridTemplateColumns: fields.length > 1 ? '1fr 1fr' : '1fr' }}>
                {fields.map(({ key, label: fieldLabel, placeholder, multiline }) => (
                  <div key={String(key)} className={fields.length === 1 || multiline ? 'col-span-2' : ''}>
                    <label className="mb-1 block text-xs font-medium text-gray-500">{fieldLabel}</label>
                    {multiline ? (
                      <textarea
                        value={item[key] ?? ''}
                        onChange={(e) => update(index, key, e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ) : (
                      <input
                        value={item[key] ?? ''}
                        onChange={(e) => update(index, key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Simple string list repeater (included/not-included, kit lists) */
export function StringListField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...value, ''])}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-gray-400"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-4 text-center text-xs text-gray-400">Empty</div>
      ) : (
        <div className="space-y-1.5">
          {value.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={item}
                onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
                placeholder={placeholder}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
