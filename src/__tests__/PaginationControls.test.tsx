import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationControls } from '@/components/directory/PaginationControls';

describe('PaginationControls', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
    totalItems: 50,
    pageSize: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays correct result count', () => {
    render(<PaginationControls {...defaultProps} />);

    // Check the text content of the paragraph containing result info
    const resultsParagraph = screen.getByText(/Showing/);
    expect(resultsParagraph).toHaveTextContent('Showing 1 to 10 of 50 results');
  });

  it('disables previous button on first page', () => {
    render(<PaginationControls {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<PaginationControls {...defaultProps} currentPage={5} />);

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with correct page when clicking next', () => {
    const handlePageChange = jest.fn();
    render(
      <PaginationControls {...defaultProps} onPageChange={handlePageChange} currentPage={2} />
    );

    fireEvent.click(screen.getByLabelText('Next page'));

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with correct page when clicking previous', () => {
    const handlePageChange = jest.fn();
    render(
      <PaginationControls {...defaultProps} onPageChange={handlePageChange} currentPage={3} />
    );

    fireEvent.click(screen.getByLabelText('Previous page'));

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking page number', () => {
    const handlePageChange = jest.fn();
    render(<PaginationControls {...defaultProps} onPageChange={handlePageChange} />);

    // Find the page number buttons container
    const pageButtons = screen
      .getAllByRole('button')
      .filter(btn => btn.textContent === '3' && !btn.hasAttribute('aria-label'));

    fireEvent.click(pageButtons[0]);

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('highlights current page', () => {
    render(<PaginationControls {...defaultProps} currentPage={2} />);

    // Find buttons with page numbers
    const pageButtons = screen
      .getAllByRole('button')
      .filter(btn => btn.textContent === '2' && !btn.hasAttribute('aria-label'));

    expect(pageButtons[0]).toHaveClass('bg-brand-primary');
    expect(pageButtons[0]).toHaveClass('text-white');
  });

  it('returns null when totalPages is 1 or less', () => {
    const { container } = render(<PaginationControls {...defaultProps} totalPages={1} />);

    expect(container.firstChild).toBeNull();
  });

  it('shows correct range for middle page', () => {
    render(<PaginationControls {...defaultProps} currentPage={3} />);

    const resultsParagraph = screen.getByText(/Showing/);
    expect(resultsParagraph).toHaveTextContent('Showing 21 to 30 of 50 results');
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles single page pagination (should not render)', () => {
      const { container } = render(
        <PaginationControls
          currentPage={1}
          totalPages={1}
          onPageChange={jest.fn()}
          totalItems={5}
          pageSize={10}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles exactly one page of items', () => {
      const { container } = render(
        <PaginationControls
          currentPage={1}
          totalPages={1}
          onPageChange={jest.fn()}
          totalItems={10}
          pageSize={10}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles last page with partial items', () => {
      render(
        <PaginationControls
          currentPage={5}
          totalPages={5}
          onPageChange={jest.fn()}
          totalItems={47}
          pageSize={10}
        />
      );

      const resultsParagraph = screen.getByText(/Showing/);
      expect(resultsParagraph).toHaveTextContent('Showing 41 to 47 of 47 results');
    });

    it('handles very large page numbers', () => {
      render(
        <PaginationControls
          currentPage={100}
          totalPages={100}
          onPageChange={jest.fn()}
          totalItems={1000}
          pageSize={10}
        />
      );

      const resultsParagraph = screen.getByText(/Showing/);
      expect(resultsParagraph).toHaveTextContent('Showing 991 to 1000 of 1000 results');
    });

    it('handles page size larger than total items (returns null when totalPages is 1)', () => {
      const { container } = render(
        <PaginationControls
          currentPage={1}
          totalPages={1}
          onPageChange={jest.fn()}
          totalItems={5}
          pageSize={20}
        />
      );

      // Component returns null when totalPages <= 1
      expect(container.firstChild).toBeNull();
    });

    it('disables previous on first page even with many pages', () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={100}
          onPageChange={jest.fn()}
          totalItems={1000}
          pageSize={10}
        />
      );

      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });

    it('disables next on last page', () => {
      render(
        <PaginationControls
          currentPage={100}
          totalPages={100}
          onPageChange={jest.fn()}
          totalItems={1000}
          pageSize={10}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });

    it('shows correct page numbers for first page', () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={10}
          onPageChange={jest.fn()}
          totalItems={100}
          pageSize={10}
        />
      );

      // Should show page 1, and it should be highlighted
      const page1Button = screen
        .getAllByRole('button')
        .find(btn => btn.textContent === '1' && !btn.hasAttribute('aria-label'));
      expect(page1Button).toHaveClass('bg-brand-primary');
    });

    it('shows correct page numbers for last page', () => {
      render(
        <PaginationControls
          currentPage={10}
          totalPages={10}
          onPageChange={jest.fn()}
          totalItems={100}
          pageSize={10}
        />
      );

      // Should show page 10, and it should be highlighted
      const page10Button = screen
        .getAllByRole('button')
        .find(btn => btn.textContent === '10' && !btn.hasAttribute('aria-label'));
      expect(page10Button).toHaveClass('bg-brand-primary');
    });
  });
});
