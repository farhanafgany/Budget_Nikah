import { fireEvent, render, screen } from '@testing-library/react'
import { CurrentPriorities } from '@/components/dashboard/CurrentPriorities'

describe('CurrentPriorities checklist actions', () => {
  it('does not recommend a checklist item hidden by the user', () => {
    render(
      <CurrentPriorities
        days={3}
        checkedIds={[]}
        hiddenChecklistItemIds={['packing-honeymoon']}
        vendorPayments={[]}
      />,
    )

    expect(screen.queryByText('Packing untuk bulan madu')).not.toBeInTheDocument()
    expect(screen.getByText('Siapkan tas dan keperluan hari H')).toBeInTheDocument()
  })

  it('passes the selected checklist item to the dashboard action flow', () => {
    const onSelectChecklist = jest.fn()

    render(
      <CurrentPriorities
        days={3}
        checkedIds={[]}
        vendorPayments={[]}
        onSelectChecklist={onSelectChecklist}
      />,
    )

    fireEvent.click(screen.getByText('Packing untuk bulan madu'))

    expect(onSelectChecklist).toHaveBeenCalledWith('packing-honeymoon')
  })

  it('promotes an unfinished custom checklist item in the current timeline', () => {
    const onSelectChecklist = jest.fn()

    render(
      <CurrentPriorities
        days={3}
        checkedIds={[]}
        vendorPayments={[]}
        customChecklistItems={[
          { id: 'custom-konfirmasi-keluarga', label: 'Konfirmasi susunan keluarga', monthsBefore: 0 },
        ]}
        onSelectChecklist={onSelectChecklist}
      />,
    )

    fireEvent.click(screen.getByText('Konfirmasi susunan keluarga'))

    expect(screen.getByText(/Tugas pribadi/)).toBeInTheDocument()
    expect(onSelectChecklist).toHaveBeenCalledWith('custom-konfirmasi-keluarga')
  })
})
