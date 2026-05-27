import { buildSummaryChecklistPriorities } from '@/lib/dashboardSummary'

describe('buildSummaryChecklistPriorities', () => {
  it('does not show a task the user completed or hid', () => {
    const priorities = buildSummaryChecklistPriorities({
      daysUntilWedding: 6,
      checkedIds: ['packing-honeymoon'],
      hiddenIds: ['siapkan-tas-hari-h'],
    })

    expect(priorities.map(item => item.id)).not.toContain('packing-honeymoon')
    expect(priorities.map(item => item.id)).not.toContain('siapkan-tas-hari-h')
    expect(priorities[0].id).toBe('cek-vendor-akhir')
  })

  it('falls back to another pending timeline when the current timeline is complete', () => {
    const priorities = buildSummaryChecklistPriorities({
      daysUntilWedding: 6,
      checkedIds: [],
      hiddenIds: [
        'packing-honeymoon',
        'siapkan-tas-hari-h',
        'cek-vendor-akhir',
        'istirahat-cukup',
        'serahkan-koordinasi',
        'cek-cincin',
        'cek-baju',
        'cek-dokumen',
        'siapkan-cash',
        'brief-keluarga',
      ],
      limit: 1,
    })

    expect(priorities[0].id).toBe('tentukan-tanggal')
  })

  it('waits for a wedding date before creating time-based priorities', () => {
    const priorities = buildSummaryChecklistPriorities({
      daysUntilWedding: null,
      checkedIds: [],
      hiddenIds: [],
    })

    expect(priorities).toEqual([])
  })

  it('includes a custom task from the current timeline before template suggestions', () => {
    const priorities = buildSummaryChecklistPriorities({
      daysUntilWedding: 6,
      checkedIds: [],
      hiddenIds: [],
      customItems: [
        { id: 'custom-hubungi-penghulu', label: 'Hubungi penghulu keluarga', monthsBefore: 0 },
      ],
      limit: 1,
    })

    expect(priorities).toEqual([
      {
        id: 'custom-hubungi-penghulu',
        label: 'Hubungi penghulu keluarga',
        category: 'Tugas pribadi',
        monthsBefore: 0,
      },
    ])
  })
})
